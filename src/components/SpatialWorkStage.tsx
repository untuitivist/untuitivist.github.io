import React, { useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Eye,
  Play,
  Sliders,
  Terminal,
} from 'lucide-react';
import type { DomainInfo, Locale, WorkItem } from '../types/portfolio';
import {
  evaluateWqbCommand,
  G1_RETARGETING_CHAPTERS,
  getDomainById,
  pickLocale,
  resolveRetargetingChapter,
  type CliOutputLine,
} from '../utils/portfolio';
import {
  solveForwardKinematics,
  type ArmJointAngles,
} from '../three/kinematics';
import { RoboticArmStage } from '../three/RoboticArmStage';
import { SpectralStage } from '../three/SpectralStage';
import { RerunEmbedStage } from './RerunEmbedStage';

interface SpatialWorkStageProps {
  domains: DomainInfo[];
  works: WorkItem[];
  activeWorkId: string;
  locale: Locale;
  onSelectWork: (workId: string) => void;
}

const ARM_PRESETS: Record<string, { label: { en: string; zh: string }; angles: ArmJointAngles }> = {
  home: {
    label: { en: 'Home Pose', zh: '归零姿态' },
    angles: { q1: 0.25, q2: 0.35, q3: 0.72, q4: 0.0, q5: -0.52, q6: 0.0 },
  },
  pick: {
    label: { en: 'Tabletop Pick', zh: '桌面抓取' },
    angles: { q1: -0.68, q2: 0.78, q3: 1.04, q4: 0.35, q5: -0.92, q6: 0.4 },
  },
  inspect: {
    label: { en: 'High Inspect', zh: '高位巡检' },
    angles: { q1: 0.92, q2: 0.16, q3: 0.42, q4: -0.55, q5: -0.25, q6: 1.1 },
  },
};

export const SpatialWorkStage: React.FC<SpatialWorkStageProps> = ({
  domains,
  works,
  activeWorkId,
  locale,
  onSelectWork,
}) => {
  const activeIndex = Math.max(
    0,
    works.findIndex((w) => w.id === activeWorkId),
  );
  const work = works[activeIndex] ?? works[0];
  const domain = getDomainById(domains, work.domain);

  // Stage-specific interactive states
  const [roboTab, setRoboTab] = useState<'g1' | 'mocap' | 'hardware' | 'ego'>('g1');

  // G1 Retargeting chapter theatre state
  const retargetVideoRef = useRef<HTMLVideoElement | null>(null);
  const [retargetTime, setRetargetTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  // Six-Axis Robotic Arm state
  const [armAngles, setArmAngles] = useState<ArmJointAngles>(ARM_PRESETS.home.angles);
  const [armAuto, setArmAuto] = useState(true);

  // PCASTNet AdaSN spectral alignment state
  const [adasnAlignment, setAdasnAlignment] = useState(0.84);
  const [machineShift, setMachineShift] = useState(0.75);
  const [pcastImgTab, setPcastImgTab] = useState<'overview' | 'detail'>('overview');

  // Manhole perception slider state
  const [curtainPos, setCurtainPos] = useState(58);

  // WorldQuant BRAIN wqb_cli interactive terminal state
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState<CliOutputLine[]>(() => [
    ...evaluateWqbCommand('wqb sim run "rank(ts_delta(close, 5)) / ts_std_dev(returns, 20)"', 'en'),
  ]);

  const fkResult = useMemo(() => solveForwardKinematics(armAngles), [armAngles]);
  const activeRetargetChapter = resolveRetargetingChapter(retargetTime);

  const stepWork = (delta: number) => {
    const nextIdx = (activeIndex + delta + works.length) % works.length;
    onSelectWork(works[nextIdx].id);
  };

  const runCli = (cmd: string) => {
    const output = evaluateWqbCommand(cmd, locale);
    setCliHistory((prev) => [...prev.slice(-14), ...output]);
  };

  return (
    <section id="stages" className="relative border-b border-white/10 bg-[#06080D] py-14 sm:py-20">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8">
        {/* Domain-Grouped Orbital Waypoint Rail (Replaces any generic card matrix) */}
        <div className="flex flex-col gap-5 border-b border-white/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono-tech text-xs uppercase tracking-[0.22em] text-[#D4F0A0]">
              {locale === 'zh' ? '交互式领域舞台 · 非矩阵叙事' : 'Interactive Domain Stages'}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {locale === 'zh'
                ? '七项真实研究 × 专属空间交互'
                : 'Seven Real Systems, Seven Native Interfaces'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => stepWork(-1)}
              className="inline-flex items-center gap-1 border border-white/15 bg-[#0C1018] px-3 py-2 font-mono-tech text-xs text-slate-300 transition-colors hover:border-[#D4F0A0]/60 hover:text-[#D4F0A0]"
              aria-label="Previous work"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>{locale === 'zh' ? '上一个' : 'Prev'}</span>
            </button>
            <span className="px-2 font-mono-tech text-xs text-slate-400">
              {String(activeIndex + 1).padStart(2, '0')} / {String(works.length).padStart(2, '0')}
            </span>
            <button
              type="button"
              onClick={() => stepWork(1)}
              className="inline-flex items-center gap-1 border border-white/15 bg-[#0C1018] px-3 py-2 font-mono-tech text-xs text-slate-300 transition-colors hover:border-[#D4F0A0]/60 hover:text-[#D4F0A0]"
              aria-label="Next work"
            >
              <span>{locale === 'zh' ? '下一个' : 'Next'}</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Sleek Linear Waypoint Rail (NO card grid!) */}
        <div className="mt-6 flex items-stretch gap-1 overflow-x-auto border-b border-white/10 pb-4">
          {works.map((item) => {
            const itemDomain = getDomainById(domains, item.domain);
            const isSelected = item.id === work.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectWork(item.id)}
                className={`relative flex min-w-[155px] flex-1 flex-col justify-between border-t-2 px-3 py-2.5 text-left transition-colors ${
                  isSelected
                    ? 'bg-[#0E1420] text-white'
                    : 'border-transparent bg-transparent text-slate-400 hover:bg-[#0B101A]/70 hover:text-slate-200'
                }`}
                style={{
                  borderTopColor: isSelected ? itemDomain.color : 'rgba(255,255,255,0.08)',
                }}
              >
                <div className="flex items-center justify-between font-mono-tech text-[10px] tracking-[0.14em]">
                  <span style={{ color: itemDomain.color }}>{item.code}</span>
                  <span className="text-slate-500">{item.year}</span>
                </div>
                <span className="mt-1.5 text-xs font-semibold sm:text-sm">
                  {pickLocale(item.title, locale)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Monumental Active Work Stage */}
        <article className="mt-8 border border-white/10 bg-[#0B0F18]">
          {/* Stage Editorial Header */}
          <div className="grid gap-6 border-b border-white/10 p-6 sm:p-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-3 font-mono-tech text-xs uppercase tracking-[0.16em]">
                <span style={{ color: domain.color }}>{work.code}</span>
                <span className="text-white/20">/</span>
                <span style={{ color: domain.color }}>{pickLocale(domain.title, locale)}</span>
                <span className="text-white/20">/</span>
                <span className="text-slate-400">{work.year}</span>
              </div>

              <h3 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {pickLocale(work.title, locale)}
              </h3>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
                {pickLocale(work.summary, locale)}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                {work.links.map((lnk) => (
                  <a
                    key={lnk.url}
                    href={lnk.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-1.5 border px-3.5 py-2 font-mono-tech text-xs transition-colors ${
                      lnk.primary
                        ? 'border-[#D4F0A0] bg-[#D4F0A0] font-semibold text-[#06080D] hover:opacity-90'
                        : 'border-white/15 bg-[#101624] text-slate-200 hover:border-[#D4F0A0]/60 hover:text-[#D4F0A0]'
                    }`}
                  >
                    <span>{pickLocale(lnk.label, locale)}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Key Technical Metrics (Architectural ruled table, zero pills) */}
            <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 lg:col-span-5">
              {work.highlights.map((hl, i) => (
                <div key={i} className="flex flex-col justify-between bg-[#080C14] p-4">
                  <span className="font-mono-tech text-[10px] uppercase tracking-[0.16em] text-slate-500">
                    {pickLocale(hl.label, locale)}
                  </span>
                  <span className="mt-2 font-display text-sm font-semibold text-slate-100 sm:text-base">
                    {hl.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bespoke Interactive Stage Canvas */}
          <div className="p-5 sm:p-8">
            {/* 1. ROBOMOCAP MULTI-MODAL CAPTURE & RETARGETING STAGE */}
            {work.stageType === 'robomocap' && (
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                  <div className="flex flex-wrap gap-1.5">
                    {(
                      [
                        ['g1', { en: '29-DoF G1 Retargeting', zh: '29-DoF G1 重定向' }],
                        ['mocap', { en: '120Hz Optical MoCap', zh: '120Hz 全身动捕' }],
                        ['hardware', { en: 'RoboCap + RoboWrist Rig', zh: 'RoboCap + 腕部硬件' }],
                        ['ego', { en: 'Egocentric Multi-View', zh: '第一视角多目画面' }],
                      ] as const
                    ).map(([key, label]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setRoboTab(key)}
                        className={`border px-3 py-1.5 font-mono-tech text-xs transition-colors ${
                          roboTab === key
                            ? 'border-[#5EEAD4] bg-[#5EEAD4]/14 text-[#5EEAD4]'
                            : 'border-white/12 bg-[#080C14] text-slate-400 hover:text-white'
                        }`}
                      >
                        {pickLocale(label, locale)}
                      </button>
                    ))}
                  </div>
                  <a
                    href="https://bitrobot-foundation.github.io/robomocap/"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-mono-tech text-xs text-[#D4F0A0] hover:underline"
                  >
                    <span>bitrobot-foundation.github.io/robomocap</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </div>

                {roboTab === 'g1' && (
                  <div className="grid gap-5 lg:grid-cols-12">
                    <div className="overflow-hidden border border-white/12 bg-black lg:col-span-8">
                      <video
                        src={work.media.g1Video}
                        poster={work.media.g1Poster}
                        controls
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="aspect-video w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-between border border-white/10 bg-[#080C14] p-5 lg:col-span-4">
                      <div>
                        <p className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[#5EEAD4]">
                          {locale === 'zh' ? '跨具身重定向基准' : 'Human-to-Humanoid Retargeting'}
                        </p>
                        <h4 className="mt-2 font-display text-xl font-semibold text-white">
                          {locale === 'zh' ? '从光学全身动捕到 29-DoF G1' : '53-Marker MoCap → 29-DoF Unitree G1'}
                        </h4>
                        <p className="mt-2.5 text-xs leading-relaxed text-slate-300">
                          {locale === 'zh'
                            ? '借助 120 Hz NOKOV 光学动捕获取被第一视角遮挡的下肢步态与足部着地真值，直接支撑人形机器人全身移动与操作（Loco-Manipulation）重定向训练。'
                            : '120 Hz NOKOV optical supervision recovers lower-body swing, foot placement, and whole-body balance typically occluded from head-mounted cameras — directly enabling dynamic 29-DoF Unitree G1 retargeting.'}
                        </p>
                      </div>
                      <img
                        src={work.media.poster}
                        alt="RoboMoCap overview still"
                        className="mt-4 aspect-video w-full border border-white/10 object-cover"
                      />
                    </div>
                  </div>
                )}

                {roboTab === 'mocap' && (
                  <div className="grid gap-5 lg:grid-cols-12">
                    <div className="overflow-hidden border border-white/12 bg-black lg:col-span-8">
                      <video
                        src={work.media.bodyVideo}
                        poster={work.media.bodyPoster}
                        controls
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="aspect-video w-full object-cover"
                      />
                    </div>
                    <div className="border border-white/10 bg-[#080C14] p-5 lg:col-span-4">
                      <p className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[#5EEAD4]">
                        {locale === 'zh' ? '全身运动学 + 物体 6-DoF 追踪' : 'Whole-Body + 6-DoF Object Supervision'}
                      </p>
                      <ul className="mt-4 space-y-3 text-xs leading-relaxed text-slate-300">
                        <li className="border-l-2 border-[#5EEAD4] pl-3">
                          <strong className="text-white">SMPL-X & MANO:</strong>{' '}
                          {locale === 'zh'
                            ? '统一输出全身人体参数与精细手部姿态，对齐第一视角相机位姿。'
                            : 'Aligned SMPL-X body fits and MANO hand poses synchronized with egocentric trajectories.'}
                        </li>
                        <li className="border-l-2 border-[#D4F0A0] pl-3">
                          <strong className="text-white">6-DoF Objects & 3D Scans:</strong>{' '}
                          {locale === 'zh'
                            ? '刚体反光标记追踪交互物体位姿，并配套带纹理三维物体网格。'
                            : 'Reflective markers capture manipulated object poses paired with textured 3D geometry scans.'}
                        </li>
                        <li className="border-l-2 border-slate-600 pl-3">
                          <strong className="text-white">290+ Actions:</strong>{' '}
                          {locale === 'zh'
                            ? '涵盖变速行走、上下台阶、搬运与复杂全身操作，数据量超 5TB。'
                            : 'Variable-speed locomotion, stairs/ramps, dynamic maneuvers, and object carrying across 5TB+.'}
                        </li>
                      </ul>
                    </div>
                  </div>
                )}

                {roboTab === 'hardware' && (
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="border border-white/10 bg-[#080C14] p-5">
                      <div className="flex items-center justify-between font-mono-tech text-xs text-[#5EEAD4]">
                        <span>ROBOCAP HEADSET</span>
                        <span>6 × GLOBAL-SHUTTER RGB + DUAL IMU</span>
                      </div>
                      <img
                        src={work.media.robocapImg}
                        alt="RoboCap 6-camera headset hardware"
                        className="mt-4 aspect-[16/10] w-full bg-[#06080D] object-contain p-4"
                      />
                      <p className="mt-3 text-xs leading-relaxed text-slate-300">
                        {locale === 'zh'
                          ? '前视/下视双目及侧向广角共 6 路硬件同步相机，融合双 200 Hz IMU、磁力计与音频流。'
                          : 'Forward, downward stereo, and lateral wide-angle cameras with hardware trigger sync, dual IMUs, magnetometer, and WAV audio.'}
                      </p>
                    </div>
                    <div className="border border-white/10 bg-[#080C14] p-5">
                      <div className="flex items-center justify-between font-mono-tech text-xs text-[#D4F0A0]">
                        <span>ROBOWRIST SENSING</span>
                        <span>DUAL WRIST RGB + INERTIAL</span>
                      </div>
                      <img
                        src={work.media.robowristImg}
                        alt="RoboWrist wearable cameras"
                        className="mt-4 aspect-[16/10] w-full bg-[#06080D] object-contain p-4"
                      />
                      <p className="mt-3 text-xs leading-relaxed text-slate-300">
                        {locale === 'zh'
                          ? '左右手腕近距相机与惯性测量单元，专门捕捉精细手物接触与遮挡操作细节。'
                          : 'Left and right wrist-mounted cameras plus inertial sensors capturing close-range hand-object manipulation.'}
                      </p>
                    </div>
                  </div>
                )}

                {roboTab === 'ego' && (
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="border border-white/10 bg-[#080C14] p-3">
                      <img
                        src={work.media.ego1}
                        alt="RoboMoCap Egocentric Sequence 01"
                        className="aspect-video w-full object-cover"
                      />
                      <p className="mt-2 font-mono-tech text-[11px] text-slate-400">
                        SM43 · Egocentric Frame 01 — Hardware-Synchronized First-Person Stream
                      </p>
                    </div>
                    <div className="border border-white/10 bg-[#080C14] p-3">
                      <img
                        src={work.media.ego2}
                        alt="RoboMoCap Egocentric Sequence 02"
                        className="aspect-video w-full object-cover"
                      />
                      <p className="mt-2 font-mono-tech text-[11px] text-slate-400">
                        SM43 · Egocentric Frame 02 — Coordinated Navigation & Manipulation
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. LLM CONTROL G1 — REAL PERSPECTIVE.MP4 + LIVE RERUN WEB VIEWER */}
            {work.stageType === 'rerun' && <RerunEmbedStage work={work} locale={locale} />}

            {/* 3. G1 MOTION RETARGETING — CINEMATIC PIPELINE CHAPTER THEATRE */}
            {work.stageType === 'retargeting' && (
              <div className="space-y-5">
                <div className="grid gap-5 lg:grid-cols-12">
                  <div className="lg:col-span-8">
                    <div className="overflow-hidden border border-white/12 bg-black">
                      <video
                        ref={retargetVideoRef}
                        src={work.media.video}
                        poster={work.media.poster}
                        controls
                        muted
                        playsInline
                        preload="metadata"
                        onTimeUpdate={(e) => setRetargetTime(e.currentTarget.currentTime)}
                        className="aspect-video w-full bg-black object-contain"
                      />
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border border-white/10 bg-[#080C14] px-3.5 py-2 font-mono-tech text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Play className="h-3.5 w-3.5 text-[#5EEAD4]" />
                        <span>
                          {activeRetargetChapter.index} · {pickLocale(activeRetargetChapter.title, locale)}
                        </span>
                        <span className="text-slate-500">({retargetTime.toFixed(1)}s)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {[0.5, 1, 1.5].map((rate) => (
                          <button
                            key={rate}
                            type="button"
                            onClick={() => {
                              setPlaybackRate(rate);
                              if (retargetVideoRef.current) {
                                retargetVideoRef.current.playbackRate = rate;
                              }
                            }}
                            className={`border px-2 py-0.5 text-[11px] ${
                              playbackRate === rate
                                ? 'border-[#D4F0A0] bg-[#D4F0A0]/15 text-[#D4F0A0]'
                                : 'border-white/12 text-slate-400 hover:text-white'
                            }`}
                          >
                            {rate}x
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            if (retargetVideoRef.current) {
                              retargetVideoRef.current.pause();
                              retargetVideoRef.current.currentTime = Math.max(
                                0,
                                retargetVideoRef.current.currentTime - 1 / 30,
                              );
                            }
                          }}
                          className="border border-white/12 px-2 py-0.5 text-[11px] text-slate-300 hover:border-white/30"
                        >
                          -1f
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (retargetVideoRef.current) {
                              retargetVideoRef.current.pause();
                              retargetVideoRef.current.currentTime += 1 / 30;
                            }
                          }}
                          className="border border-white/12 px-2 py-0.5 text-[11px] text-slate-300 hover:border-white/30"
                        >
                          +1f
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Interactive 5-Stage Pipeline Chapter Rail */}
                  <div className="flex flex-col justify-between space-y-2 lg:col-span-4">
                    {G1_RETARGETING_CHAPTERS.map((chapter) => {
                      const isCurrent = chapter.id === activeRetargetChapter.id;
                      return (
                        <button
                          key={chapter.id}
                          type="button"
                          onClick={() => {
                            if (retargetVideoRef.current) {
                              retargetVideoRef.current.currentTime = chapter.startSec;
                              setRetargetTime(chapter.startSec);
                              void retargetVideoRef.current.play();
                            }
                          }}
                          className={`w-full border p-3 text-left transition-colors ${
                            isCurrent
                              ? 'border-[#5EEAD4]/70 bg-[#5EEAD4]/10'
                              : 'border-white/10 bg-[#080C14] hover:border-white/25'
                          }`}
                        >
                          <div className="flex items-center justify-between font-mono-tech text-[11px]">
                            <span className={isCurrent ? 'text-[#D4F0A0]' : 'text-[#5EEAD4]'}>
                              {chapter.index} · {pickLocale(chapter.title, locale)}
                            </span>
                            <span className="text-slate-500">0:{String(chapter.startSec).padStart(2, '0')}</span>
                          </div>
                          <p className="mt-1 text-xs leading-relaxed text-slate-400">
                            {pickLocale(chapter.detail, locale)}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* 4. SIX-AXIS ROBOTIC ARM — INTERACTIVE 3D 6-DOF DH KINEMATICS + REAL PROTOTYPE */}
            {work.stageType === 'arm3d' && (
              <div className="grid gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-7">
                  <div className="relative overflow-hidden border border-white/12 bg-[#090D15]">
                    <RoboticArmStage
                      angles={armAngles}
                      autoMotion={armAuto}
                      onAutoAngles={setArmAngles}
                    />
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#070B12] px-4 py-2.5 font-mono-tech text-[11px]">
                      <span className="text-[#5EEAD4]">
                        TCP: ({fkResult.tcp.x.toFixed(2)}, {fkResult.tcp.y.toFixed(2)},{' '}
                        {fkResult.tcp.z.toFixed(2)}) m
                      </span>
                      <span className="text-slate-400">
                        Reach: {fkResult.reach.toFixed(2)} m
                      </span>
                      <button
                        type="button"
                        onClick={() => setArmAuto((prev) => !prev)}
                        className={`border px-2.5 py-0.5 transition-colors ${
                          armAuto
                            ? 'border-[#D4F0A0] bg-[#D4F0A0]/15 text-[#D4F0A0]'
                            : 'border-white/15 text-slate-300 hover:text-white'
                        }`}
                      >
                        {armAuto
                          ? locale === 'zh'
                            ? '自动轨迹: 开'
                            : 'Auto Trajectory: ON'
                          : locale === 'zh'
                            ? '手动 DH 调节'
                            : 'Manual Joint Control'}
                      </button>
                    </div>
                  </div>

                  {/* Interactive Joint Sliders & Presets */}
                  <div className="border border-white/10 bg-[#080C14] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
                      <span className="inline-flex items-center gap-1.5 font-mono-tech text-xs text-slate-300">
                        <Sliders className="h-3.5 w-3.5 text-[#D4F0A0]" />
                        <span>{locale === 'zh' ? '6-DOF 关节角控制 (rad)' : '6-DOF Joint Angles (rad)'}</span>
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {Object.entries(ARM_PRESETS).map(([key, preset]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              setArmAuto(false);
                              setArmAngles(preset.angles);
                            }}
                            className="border border-white/12 bg-[#0E1420] px-2.5 py-1 font-mono-tech text-[11px] text-slate-300 hover:border-[#5EEAD4] hover:text-[#5EEAD4]"
                          >
                            {pickLocale(preset.label, locale)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {(
                        [
                          ['q1', 'Q1 Waist', -2.4, 2.4],
                          ['q2', 'Q2 Shoulder', -1.1, 1.35],
                          ['q3', 'Q3 Elbow', -1.2, 1.8],
                          ['q4', 'Q4 Roll', -2.0, 2.0],
                          ['q5', 'Q5 Wrist', -1.5, 1.5],
                          ['q6', 'Q6 Flange', -3.14, 3.14],
                        ] as const
                      ).map(([jointKey, label, min, max]) => (
                        <label key={jointKey} className="block space-y-1">
                          <div className="flex justify-between font-mono-tech text-[11px]">
                            <span className="text-slate-400">{label}</span>
                            <span className="text-[#D4F0A0]">
                              {((armAngles[jointKey] * 180) / Math.PI).toFixed(0)}°
                            </span>
                          </div>
                          <input
                            type="range"
                            min={min}
                            max={max}
                            step={0.02}
                            value={armAngles[jointKey]}
                            onChange={(e) => {
                              setArmAuto(false);
                              setArmAngles((prev) => ({
                                ...prev,
                                [jointKey]: parseFloat(e.target.value),
                              }));
                            }}
                            className="wiz-slider w-full"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Real Hardware Prototype Demo */}
                <div className="flex flex-col justify-between border border-white/10 bg-[#080C14] p-4 lg:col-span-5">
                  <div>
                    <p className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[#5EEAD4]">
                      {locale === 'zh' ? '物理样机实测 (00:12)' : 'Physical Prototype Verification (00:12)'}
                    </p>
                    <div className="mt-3 overflow-hidden border border-white/12 bg-black">
                      <video
                        src={work.media.video}
                        poster={work.media.poster}
                        controls
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="aspect-video w-full object-cover"
                      />
                    </div>
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-slate-400">
                    {locale === 'zh'
                      ? '左侧为实时 Three.js 正运动学解算模型，与 MATLAB 控制台及物理 6-DOF 样机采用同一套 Denavit–Hartenberg 参数化约束。'
                      : 'The interactive Three.js manipulator on the left runs the exact Denavit–Hartenberg forward kinematic chain used in the MATLAB controller and physical 6-DOF prototype.'}
                  </p>
                </div>
              </div>
            )}

            {/* 5. PCASTNET — 3D GLSL SPECTRAL ADASN VISUALIZER + PAPER OVERVIEW */}
            {work.stageType === 'spectral' && (
              <div className="grid gap-6 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-7">
                  <div className="overflow-hidden border border-white/12 bg-[#090D15]">
                    <SpectralStage alignment={adasnAlignment} regimeShift={machineShift} />
                  </div>
                  <div className="grid gap-4 border border-white/10 bg-[#080C14] p-4 sm:grid-cols-2">
                    <label className="block space-y-1.5">
                      <div className="flex justify-between font-mono-tech text-xs">
                        <span className="text-slate-300">
                          {locale === 'zh' ? 'AdaSN 物理对齐强度' : 'AdaSN Physical Alignment'}
                        </span>
                        <span className="text-[#D4F0A0]">{Math.round(adasnAlignment * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={adasnAlignment}
                        onChange={(e) => setAdasnAlignment(parseFloat(e.target.value))}
                        className="wiz-slider w-full"
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <div className="flex justify-between font-mono-tech text-xs">
                        <span className="text-slate-300">
                          {locale === 'zh' ? '跨机器工况偏移' : 'Cross-Machine Shift'}
                        </span>
                        <span className="text-[#F59E0B]">{(machineShift * 100).toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min={0.1}
                        max={1}
                        step={0.02}
                        value={machineShift}
                        onChange={(e) => setMachineShift(parseFloat(e.target.value))}
                        className="wiz-slider w-full"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex flex-col justify-between border border-white/10 bg-[#080C14] p-4 lg:col-span-5">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[#F59E0B]">
                        IEEE TIM 2025 · Architecture
                      </span>
                      <div className="inline-flex border border-white/12 font-mono-tech text-[11px]">
                        <button
                          type="button"
                          onClick={() => setPcastImgTab('overview')}
                          className={`px-2 py-0.5 ${
                            pcastImgTab === 'overview'
                              ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                              : 'text-slate-400'
                          }`}
                        >
                          Overview
                        </button>
                        <button
                          type="button"
                          onClick={() => setPcastImgTab('detail')}
                          className={`px-2 py-0.5 ${
                            pcastImgTab === 'detail'
                              ? 'bg-[#F59E0B]/20 text-[#F59E0B]'
                              : 'text-slate-400'
                          }`}
                        >
                          Signal
                        </button>
                      </div>
                    </div>
                    <img
                      src={pcastImgTab === 'overview' ? work.media.overview : work.media.image}
                      alt="PCASTNet architecture diagram"
                      className="mt-3 aspect-[16/11] w-full border border-white/10 bg-white/95 object-contain p-2"
                    />
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-400">
                    {locale === 'zh'
                      ? '拖动左侧 AdaSN 滑块，观察物理约束自适应风格迁移如何在不同机器转速/负载偏移下重新对齐故障谐波脊线。'
                      : 'Drag the AdaSN slider to observe how physics-constrained adaptive style normalization realigns displaced cross-machine fault harmonics back onto invariant diagnostic bands.'}
                  </p>
                </div>
              </div>
            )}

            {/* 6. MANHOLE HAZARD DETECTION — RBC LARGE-KERNEL ARCHITECTURE & RECEPTIVE FIELD STAGE */}
            {work.stageType === 'vision' && (
              <div className="grid gap-6 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <div className="overflow-hidden border border-white/12 bg-white/95 p-4">
                    <img
                      src={work.media.image}
                      alt="YOLOv10 + RepLKBlock RBC module architecture diagram"
                      className="max-h-[360px] w-full object-contain"
                    />
                  </div>
                  <p className="mt-2.5 font-mono-tech text-[11px] text-slate-400">
                    {locale === 'zh'
                      ? 'RBC 模块结构：大核深度卷积 + 小核并行分支 + 推理期结构重参数化等价融合'
                      : 'RBC Architecture: Large-kernel depthwise conv + parallel small-kernel branches fused via structural re-parameterization'}
                  </p>
                </div>

                <div className="flex flex-col justify-between border border-white/10 bg-[#080C14] p-5 lg:col-span-5">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[#F59E0B]">
                        <Eye className="h-3.5 w-3.5" />
                        <span>{locale === 'zh' ? '有效感受野交互对比' : 'Effective Receptive Field'}</span>
                      </span>
                      <span className="font-mono-tech text-xs text-[#D4F0A0]">
                        {curtainPos < 35 ? '3×3 Baseline' : curtainPos < 70 ? '7×7 Mid-Kernel' : '31×31 RepLK (RBC)'}
                      </span>
                    </div>

                    {/* Interactive ERF Coverage Grid */}
                    <div className="mt-4 grid grid-cols-9 gap-1 border border-white/10 bg-[#05080F] p-3">
                      {Array.from({ length: 81 }, (_, idx) => {
                        const r = Math.floor(idx / 9) - 4;
                        const c = (idx % 9) - 4;
                        const dist = Math.hypot(r, c);
                        const sigma = 0.8 + (curtainPos / 100) * 3.1;
                        const weight = Math.exp(-(dist * dist) / (2 * sigma * sigma));
                        return (
                          <div
                            key={idx}
                            className="aspect-square transition-colors duration-150"
                            style={{
                              backgroundColor:
                                weight > 0.65
                                  ? `rgba(212, 240, 160, ${0.28 + weight * 0.72})`
                                  : weight > 0.25
                                    ? `rgba(245, 158, 11, ${0.15 + weight * 0.65})`
                                    : 'rgba(255, 255, 255, 0.04)',
                            }}
                          />
                        );
                      })}
                    </div>

                    <label className="mt-4 block space-y-1.5">
                      <div className="flex justify-between font-mono-tech text-xs">
                        <span className="text-slate-300">
                          {locale === 'zh' ? '卷积核尺度扩展 (3×3 → 31×31)' : 'Kernel Scale Expansion (3×3 → 31×31)'}
                        </span>
                        <span className="text-[#F59E0B]">{curtainPos}%</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={100}
                        value={curtainPos}
                        onChange={(e) => setCurtainPos(Number(e.target.value))}
                        className="wiz-slider w-full"
                      />
                    </label>
                  </div>

                  <div className="mt-4 border-t border-white/10 pt-3.5 text-xs leading-relaxed text-slate-400">
                    {locale === 'zh'
                      ? '相比传统 3×3 局部感受野，RBC 大核卷积在遮挡与阴影场景下可同时捕获井盖本体与周边路面上下文，推理期等价融合保持实时帧率。'
                      : 'Compared against local 3×3 convolutions, RepLKBlock (RBC) captures global road context around occluded or damaged covers while fusing cleanly for real-time edge inference.'}
                  </div>
                </div>
              </div>
            )}

            {/* 7. WORLDQUANT BRAIN / WQB_CLI — INTERACTIVE AGENT TERMINAL */}
            {work.stageType === 'terminal' && (
              <div className="grid gap-6 lg:grid-cols-12">
                <div className="flex flex-col border border-white/12 bg-[#05080F] lg:col-span-7">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#0B101B] px-4 py-2.5">
                    <span className="inline-flex items-center gap-2 font-mono-tech text-xs text-[#818CF8]">
                      <Terminal className="h-3.5 w-3.5" />
                      <span>wqb_cli · MCP Interactive Console</span>
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        ['search', 'wqb alpha search --region USA --delay 1'],
                        ['sim', 'wqb sim run "rank(ts_delta(close, 5)) / ts_std_dev(returns, 20)"'],
                        ['screen', 'wqb mcp screen --sharpe 1.8 --turnover 0.35'],
                        ['status', 'wqb status'],
                      ].map(([label, cmd]) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => runCli(cmd)}
                          className="border border-white/12 bg-[#060911] px-2 py-0.5 font-mono-tech text-[11px] text-slate-300 transition-colors hover:border-[#818CF8] hover:text-[#D4F0A0]"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-[270px] space-y-1 overflow-y-auto p-4 font-mono-tech text-xs">
                    {cliHistory.map((line, idx) => (
                      <div
                        key={idx}
                        className={
                          line.kind === 'cmd'
                            ? 'pt-2 font-semibold text-white'
                            : line.kind === 'accent'
                              ? 'text-[#D4F0A0]'
                              : line.kind === 'table'
                                ? 'whitespace-pre text-[#5EEAD4]'
                                : line.kind === 'warn'
                                  ? 'text-amber-400'
                                  : 'text-slate-400'
                        }
                      >
                        {line.text}
                      </div>
                    ))}
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!cliInput.trim()) return;
                      runCli(cliInput);
                      setCliInput('');
                    }}
                    className="flex items-center border-t border-white/10 bg-[#080C14] px-4 py-2"
                  >
                    <span className="font-mono-tech text-xs text-[#D4F0A0]">$</span>
                    <input
                      type="text"
                      value={cliInput}
                      onChange={(e) => setCliInput(e.target.value)}
                      placeholder={
                        locale === 'zh'
                          ? '输入 wqb sim / search / screen / status / help...'
                          : 'Type wqb sim / search / screen / status / help...'
                      }
                      className="w-full bg-transparent px-2.5 py-1 font-mono-tech text-xs text-white outline-none placeholder:text-slate-600"
                    />
                    <button
                      type="submit"
                      className="border border-[#818CF8]/50 bg-[#818CF8]/15 px-3 py-1 font-mono-tech text-[11px] text-[#818CF8] hover:bg-[#818CF8] hover:text-[#06080D]"
                    >
                      Run
                    </button>
                  </form>
                </div>

                <div className="flex flex-col justify-between border border-white/10 bg-[#080C14] p-4 lg:col-span-5">
                  <div>
                    <div className="flex items-center gap-2 font-mono-tech text-[11px] uppercase tracking-[0.16em] text-[#818CF8]">
                      <Cpu className="h-3.5 w-3.5" />
                      <span>Agent-Native Research Loop</span>
                    </div>
                    <img
                      src={work.media.image}
                      alt="WorldQuant BRAIN wqb_cli workflow"
                      className="mt-3 aspect-[16/10] w-full border border-white/10 object-cover"
                    />
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-slate-400">
                    {locale === 'zh'
                      ? '将 WorldQuant BRAIN 平台 API 封装为无状态 CLI 与标准 MCP 工具接口，让大语言模型 Agent 直接参与因子假设提出、批量回测与低相关性筛选。'
                      : 'Wraps WorldQuant BRAIN APIs into composable CLI commands and standard MCP tools so LLM agents directly execute alpha synthesis, batch simulation, and orthogonality screening.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </section>
  );
};
