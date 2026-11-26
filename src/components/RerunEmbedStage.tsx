import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Cpu,
  ExternalLink,
  FolderUp,
  Link2,
  Maximize2,
  Play,
  Square,
  Video,
} from 'lucide-react';
import type { Locale, WorkItem } from '../types/portfolio';
import {
  LLM_G1_TRACE_STEPS,
  pickLocale,
  resolveLlmTraceStep,
  resolveRrdUrl,
} from '../utils/portfolio';

interface RerunEmbedStageProps {
  work: WorkItem;
  locale: Locale;
}

type RerunInstance = {
  start: (
    rrd: string | string[] | null,
    parent: HTMLElement | null,
    options: Record<string, unknown> | null,
  ) => Promise<void>;
  stop: () => void;
  toggleFullscreen: () => void;
  openChannel: (name?: string) => {
    sendRrd: (bytes: Uint8Array) => void;
    close: () => void;
  };
};

export const RerunEmbedStage: React.FC<RerunEmbedStageProps> = ({ work, locale }) => {
  const [viewMode, setViewMode] = useState<'sim' | 'rerun'>('sim');
  const [videoTime, setVideoTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Rerun live engine state
  const rerunContainerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<RerunInstance | null>(null);
  const [rerunStatus, setRerunStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [rerunError, setRerunError] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>(work.media.sampleRrdUrl ?? '');
  const [activeRrdLabel, setActiveRrdLabel] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const stopViewer = useCallback(() => {
    if (viewerRef.current) {
      try {
        viewerRef.current.stop();
      } catch {
        // Ignore teardown errors if viewer wasn't fully started
      }
      viewerRef.current = null;
    }
    if (rerunContainerRef.current) {
      rerunContainerRef.current.innerHTML = '';
    }
    setRerunStatus('idle');
  }, []);

  useEffect(() => {
    return () => {
      stopViewer();
    };
  }, [stopViewer]);

  const launchRerunWithUrl = useCallback(
    async (rawUrl: string | null, label: string) => {
      if (!rerunContainerRef.current) return;
      stopViewer();
      setRerunStatus('loading');
      setRerunError('');
      setActiveRrdLabel(label);

      try {
        const mod = await import('@rerun-io/web-viewer');
        const viewer = new mod.WebViewer() as unknown as RerunInstance;
        viewerRef.current = viewer;
        const resolved = rawUrl ? resolveRrdUrl(rawUrl, window.location.href) : null;

        await viewer.start(resolved, rerunContainerRef.current, {
          width: '100%',
          height: '100%',
          hideWelcomeScreen: Boolean(resolved),
          allowFullscreen: true,
          checkForUpdatesOnStartup: false,
          analytics: 'off',
        });

        setRerunStatus('ready');
      } catch (err) {
        setRerunStatus('error');
        setRerunError(err instanceof Error ? err.message : String(err));
      }
    },
    [stopViewer],
  );

  const launchRerunWithLocalFile = useCallback(
    async (file: File) => {
      if (!rerunContainerRef.current) return;
      stopViewer();
      setRerunStatus('loading');
      setRerunError('');
      setActiveRrdLabel(file.name);

      try {
        const bytes = new Uint8Array(await file.arrayBuffer());
        const mod = await import('@rerun-io/web-viewer');
        const viewer = new mod.WebViewer() as unknown as RerunInstance;
        viewerRef.current = viewer;

        await viewer.start(null, rerunContainerRef.current, {
          width: '100%',
          height: '100%',
          hideWelcomeScreen: true,
          allowFullscreen: true,
          checkForUpdatesOnStartup: false,
          analytics: 'off',
        });

        const channel = viewer.openChannel(file.name);
        channel.sendRrd(bytes);
        setRerunStatus('ready');
      } catch (err) {
        setRerunStatus('error');
        setRerunError(err instanceof Error ? err.message : String(err));
      }
    },
    [stopViewer],
  );

  const handleAutoLaunch = useCallback(async () => {
    const localCandidate = work.media.defaultLocalRrd;
    if (localCandidate) {
      try {
        const res = await fetch(localCandidate, { method: 'HEAD' });
        if (res.ok) {
          await launchRerunWithUrl(localCandidate, 'llm-g1-sim.rrd (local)');
          return;
        }
      } catch {
        // Fall back to sample RRD if user hasn't dropped llm-g1-sim.rrd yet
      }
    }
    const sample = work.media.sampleRrdUrl ?? 'https://app.rerun.io/version/0.44.0/examples/dna.rrd';
    await launchRerunWithUrl(sample, 'Rerun v0.44 Live 3D Session');
  }, [launchRerunWithUrl, work.media.defaultLocalRrd, work.media.sampleRrdUrl]);

  const activeTrace = resolveLlmTraceStep(videoTime);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.toLowerCase().endsWith('.rrd')) {
      setViewMode('rerun');
      void launchRerunWithLocalFile(file);
    }
  };

  return (
    <div className="space-y-4">
      {/* Mode Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="inline-flex border border-white/12 bg-[#080B12]">
          <button
            type="button"
            onClick={() => {
              stopViewer();
              setViewMode('sim');
            }}
            className={`inline-flex items-center gap-2 px-3.5 py-2 font-mono-tech text-xs transition-colors ${
              viewMode === 'sim'
                ? 'bg-[#5EEAD4]/16 text-[#5EEAD4]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="h-3.5 w-3.5" />
            <span>
              {locale === 'zh' ? '仿真视角 · perspective.mp4' : 'Sim Perspective · perspective.mp4'}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('rerun')}
            className={`inline-flex items-center gap-2 border-l border-white/12 px-3.5 py-2 font-mono-tech text-xs transition-colors ${
              viewMode === 'rerun'
                ? 'bg-[#D4F0A0]/16 text-[#D4F0A0]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Box className="h-3.5 w-3.5" />
            <span>
              {locale === 'zh'
                ? 'Rerun Web Viewer (v0.44 真引擎)'
                : 'Live Rerun Web Viewer (v0.44)'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".rrd"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setViewMode('rerun');
                void launchRerunWithLocalFile(file);
              }
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 border border-white/15 bg-[#0E1420] px-3 py-1.5 font-mono-tech text-xs text-slate-200 transition-colors hover:border-[#D4F0A0]/60 hover:text-[#D4F0A0]"
          >
            <FolderUp className="h-3.5 w-3.5" />
            <span>{locale === 'zh' ? '载入本地 .rrd' : 'Load Local .rrd'}</span>
          </button>
        </div>
      </div>

      {viewMode === 'sim' ? (
        <div className="grid gap-5 lg:grid-cols-12">
          {/* Real perspective.mp4 viewport */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden border border-white/12 bg-[#04060A]">
              <video
                ref={videoRef}
                src={work.media.video}
                poster={work.media.poster}
                controls
                playsInline
                muted
                loop
                preload="metadata"
                onTimeUpdate={(e) => setVideoTime(e.currentTarget.currentTime)}
                className="aspect-[16/10] w-full bg-black object-contain"
              />
            </div>
            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 font-mono-tech text-[11px] text-slate-400">
              <span>MuJoCo · Unitree G1 Tabletop Manipulation · 27.7s</span>
              <button
                type="button"
                onClick={() => {
                  setViewMode('rerun');
                }}
                className="inline-flex items-center gap-1 text-[#D4F0A0] hover:underline"
              >
                <span>
                  {locale === 'zh' ? '切至 Rerun Web Viewer 交互检验 →' : 'Open in Rerun Web Viewer →'}
                </span>
              </button>
            </div>
          </div>

          {/* Synchronized LLM Planner -> Action Trace */}
          <div className="flex flex-col justify-between border border-white/10 bg-[#080C14] p-4 lg:col-span-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[#5EEAD4]">
                  <Cpu className="h-3.5 w-3.5" />
                  <span>{locale === 'zh' ? 'LLM 任务分解与动作追踪' : 'LLM Plan → Control Trace'}</span>
                </span>
                <span className="font-mono-tech text-[11px] text-slate-400">
                  t = {videoTime.toFixed(1)}s
                </span>
              </div>

              <div className="mt-3 space-y-2.5">
                {LLM_G1_TRACE_STEPS.map((step) => {
                  const isActive = step.id === activeTrace.id;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.currentTime = step.startSec + 0.1;
                          setVideoTime(step.startSec + 0.1);
                          void videoRef.current.play();
                        }
                      }}
                      className={`w-full border p-3 text-left transition-colors ${
                        isActive
                          ? 'border-[#5EEAD4]/60 bg-[#5EEAD4]/10'
                          : 'border-white/8 bg-[#0B101A] hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono-tech text-[11px]">
                        <span className={isActive ? 'text-[#D4F0A0]' : 'text-slate-400'}>
                          {step.phase}
                        </span>
                        <span className="text-slate-500">
                          {step.startSec.toFixed(0)}s – {step.endSec.toFixed(0)}s
                        </span>
                      </div>
                      <code className="mt-1 block truncate font-mono-tech text-[11px] text-slate-200">
                        {step.command}
                      </code>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                        {pickLocale(step.description, locale)}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Live Official @rerun-io/web-viewer Container */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`space-y-3 border p-3 transition-colors ${
            dragActive ? 'border-[#D4F0A0] bg-[#D4F0A0]/5' : 'border-white/12 bg-[#080B12]'
          }`}
        >
          {/* Rerun Source Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex min-w-[240px] flex-1 items-center border border-white/12 bg-[#05070C] px-2.5">
              <Link2 className="h-3.5 w-3.5 shrink-0 text-slate-500" />
              <input
                type="text"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="./recordings/llm-g1-sim.rrd or https://.../sim.rrd"
                className="w-full bg-transparent px-2 py-1.5 font-mono-tech text-xs text-slate-200 outline-none placeholder:text-slate-600"
              />
            </div>

            <button
              type="button"
              onClick={() => void launchRerunWithUrl(customUrl || null, customUrl || 'Rerun Welcome')}
              className="inline-flex items-center gap-1.5 border border-[#D4F0A0]/60 bg-[#D4F0A0] px-3 py-1.5 font-mono-tech text-xs font-semibold text-[#06080D] hover:opacity-90"
            >
              <Play className="h-3.5 w-3.5" />
              <span>{locale === 'zh' ? '启动 Rerun 引擎' : 'Launch Rerun'}</span>
            </button>

            {rerunStatus === 'ready' && (
              <>
                <button
                  type="button"
                  onClick={() => viewerRef.current?.toggleFullscreen()}
                  className="inline-flex items-center gap-1 border border-white/15 px-2.5 py-1.5 font-mono-tech text-xs text-slate-300 hover:border-white/35 hover:text-white"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>{locale === 'zh' ? '全屏' : 'Fullscreen'}</span>
                </button>
                <button
                  type="button"
                  onClick={stopViewer}
                  className="inline-flex items-center gap-1 border border-white/15 px-2.5 py-1.5 font-mono-tech text-xs text-slate-300 hover:border-rose-400/50 hover:text-rose-300"
                >
                  <Square className="h-3 w-3" />
                  <span>{locale === 'zh' ? '停止' : 'Stop'}</span>
                </button>
              </>
            )}
          </div>

          {/* Dedicated Rerun Canvas Viewport */}
          <div className="relative h-[440px] w-full overflow-hidden border border-white/10 bg-[#05070C] sm:h-[500px]">
            <div ref={rerunContainerRef} className="h-full w-full" />

            {rerunStatus === 'idle' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#060911]/94 p-6 text-center">
                <p className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#D4F0A0]">
                  @rerun-io/web-viewer · v0.44 (RRD SDK v0.23–v0.44)
                </p>
                <h4 className="mt-2 font-display text-2xl font-semibold text-white">
                  {locale === 'zh'
                    ? '按需挂载浏览器原生 Rerun 3D 引擎'
                    : 'On-Demand Native Rerun Web Viewer'}
                </h4>
                <p className="mt-2 max-w-lg text-sm text-slate-400">
                  {locale === 'zh'
                    ? '可直接拖入你的本地 LLM Control G1 .rrd 文件、在上方输入托管直链，或一键启动实时 3D Rerun 会话（将文件放入 public/recordings/llm-g1-sim.rrd 即可自动加载）。'
                    : 'Drag & drop your local LLM Control G1 .rrd recording here, paste a CORS-enabled URL above, or launch a live 3D Rerun session immediately. Dropping llm-g1-sim.rrd into public/recordings/ auto-loads on GitHub Pages.'}
                </p>
                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => void handleAutoLaunch()}
                    className="inline-flex items-center gap-2 border border-[#D4F0A0] bg-[#D4F0A0] px-4 py-2 font-mono-tech text-xs font-semibold text-[#06080D] transition-opacity hover:opacity-90"
                  >
                    <Play className="h-3.5 w-3.5" />
                    <span>
                      {locale === 'zh' ? '立即运行 Rerun Web 3D 演示' : 'Start Live Rerun 3D Session'}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 border border-white/20 bg-[#0D1320] px-4 py-2 font-mono-tech text-xs text-slate-200 hover:border-[#5EEAD4] hover:text-[#5EEAD4]"
                  >
                    <FolderUp className="h-3.5 w-3.5" />
                    <span>{locale === 'zh' ? '选择本地 .rrd 文件' : 'Open Local .rrd File'}</span>
                  </button>
                  <a
                    href="https://rerun.io/docs/viewer/integrations/embed-web"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 border border-white/12 px-3.5 py-2 font-mono-tech text-xs text-slate-400 hover:text-white"
                  >
                    <span>Rerun Docs</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            )}

            {rerunStatus === 'loading' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#060911]/92 p-6 text-center">
                <p className="font-mono-tech text-xs uppercase tracking-[0.2em] text-[#5EEAD4]">
                  {locale === 'zh' ? '正在初始化 Rerun WebAssembly 渲染器…' : 'Initializing Rerun WASM + WebGPU/WebGL…'}
                </p>
                <p className="mt-2 font-mono-tech text-xs text-slate-400">{activeRrdLabel}</p>
              </div>
            )}

            {rerunStatus === 'error' && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#060911]/95 p-6 text-center">
                <p className="font-mono-tech text-xs uppercase tracking-[0.18em] text-amber-400">
                  {locale === 'zh' ? 'Rerun 加载中断' : 'Rerun Session Interrupted'}
                </p>
                <p className="mt-2 max-w-md font-mono-tech text-xs text-slate-300">{rerunError}</p>
                <button
                  type="button"
                  onClick={() => void launchRerunWithUrl(work.media.secondarySampleRrdUrl ?? null, 'DNA Fallback Sample')}
                  className="mt-4 border border-[#D4F0A0]/60 bg-[#D4F0A0]/15 px-3.5 py-1.5 font-mono-tech text-xs text-[#D4F0A0] hover:bg-[#D4F0A0] hover:text-[#06080D]"
                >
                  {locale === 'zh' ? '重试内置示例' : 'Retry Built-in Sample'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
