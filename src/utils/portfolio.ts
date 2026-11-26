import type { DomainId, DomainInfo, Locale, LocalizedText, WorkItem } from '../types/portfolio';

export function pickLocale(text: LocalizedText, locale: Locale): string {
  return locale === 'zh' ? text.zh : text.en;
}

export function getDomainById(domains: DomainInfo[], id: DomainId): DomainInfo {
  return domains.find((d) => d.id === id) ?? domains[0];
}

export function getWorkById(works: WorkItem[], id: string): WorkItem {
  return works.find((w) => w.id === id) ?? works[0];
}

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

/**
 * Computes the world-space position of an orbital waypoint on a tilted circular orbit.
 * Applies XYZ Euler tilt identical to Three.js Group rotation order ('XYZ').
 */
export function computeOrbitalNodePosition(
  radius: number,
  tilt: [number, number, number],
  angleRad: number,
): Point3D {
  const x0 = Math.cos(angleRad) * radius;
  const y0 = 0;
  const z0 = Math.sin(angleRad) * radius;

  const [rx, ry, rz] = tilt;

  // Rotate around X
  const cx = Math.cos(rx);
  const sx = Math.sin(rx);
  const y1 = y0 * cx - z0 * sx;
  const z1 = y0 * sx + z0 * cx;
  const x1 = x0;

  // Rotate around Y
  const cy = Math.cos(ry);
  const sy = Math.sin(ry);
  const x2 = x1 * cy + z1 * sy;
  const z2 = -x1 * sy + z1 * cy;
  const y2 = y1;

  // Rotate around Z
  const cz = Math.cos(rz);
  const sz = Math.sin(rz);
  const x3 = x2 * cz - y2 * sz;
  const y3 = x2 * sz + y2 * cz;
  const z3 = z2;

  return { x: x3, y: y3, z: z3 };
}

export interface PipelineChapter {
  id: string;
  index: string;
  startSec: number;
  title: LocalizedText;
  detail: LocalizedText;
}

export const G1_RETARGETING_CHAPTERS: PipelineChapter[] = [
  {
    id: 'source',
    index: '01',
    startSec: 0,
    title: { en: 'Dance Source RGB', zh: '原始舞蹈视频' },
    detail: {
      en: 'Monocular agile human choreography with dynamic turns and rapid weight shifts.',
      zh: '单目敏捷舞蹈视频输入，包含高速旋转、大幅度跨步与重心切换。',
    },
  },
  {
    id: 'recovery',
    index: '02',
    startSec: 9,
    title: { en: 'Human Recovery', zh: '三维人体动作恢复' },
    detail: {
      en: '3D SMPL kinematic trajectory reconstruction with global root translation and foot contact smoothing.',
      zh: '重建全局根节点位移与三维 SMPL 关节轨迹，并平滑足底接触约束。',
    },
  },
  {
    id: 'gmr',
    index: '03',
    startSec: 18,
    title: { en: 'GMR Retargeting', zh: 'GMR 运动重定向' },
    detail: {
      en: 'Kinematic retargeting onto the 29-DoF Unitree G1 skeleton respecting joint and torque limits.',
      zh: '在关节限位与力矩约束下，将人体动作映射至 29-DoF 宇树 G1 运动学树。',
    },
  },
  {
    id: 'mjlab',
    index: '04',
    startSec: 28,
    title: { en: 'mjlab RL Tracking', zh: 'mjlab 强化学习追踪' },
    detail: {
      en: 'Whole-body RL imitation policy trained in MuJoCo / mjlab with terrain & dynamics randomization.',
      zh: '在 mjlab / MuJoCo 环境中结合动力学随机化训练全身强化学习追踪策略。',
    },
  },
  {
    id: 'sim2real',
    index: '05',
    startSec: 38,
    title: { en: 'Sim-to-Real G1', zh: '宇树 G1 实机部署' },
    detail: {
      en: 'Zero-shot deployment onto physical Unitree G1 preserving rhythm, posture, and dynamic balance.',
      zh: '策略零样本迁移至物理宇树 G1，保持流畅节拍、上肢表现力与动态平衡。',
    },
  },
];

export function resolveRetargetingChapter(currentTimeSec: number): PipelineChapter {
  let active = G1_RETARGETING_CHAPTERS[0];
  for (const chapter of G1_RETARGETING_CHAPTERS) {
    if (currentTimeSec >= chapter.startSec) {
      active = chapter;
    }
  }
  return active;
}

export interface LlmTraceStep {
  id: string;
  startSec: number;
  endSec: number;
  phase: string;
  command: string;
  description: LocalizedText;
}

export const LLM_G1_TRACE_STEPS: LlmTraceStep[] = [
  {
    id: 'parse',
    startSec: 0,
    endSec: 5.5,
    phase: 'PLAN',
    command: 'plan_task("pick up the black cylinder and place it inside the basket")',
    description: {
      en: 'LLM decomposes language goal into grounded object targets and collision-free whole-body waypoints.',
      zh: '大语言模型将自然语言目标解析为桌面物体位姿约束与无碰撞全身操作子目标。',
    },
  },
  {
    id: 'approach',
    startSec: 5.5,
    endSec: 12.0,
    phase: 'STABILIZE',
    command: 'whole_body_ctrl.set_stance(com_z=0.74, torso_pitch=0.08, left_ee="pre_grasp")',
    description: {
      en: 'Humanoid adjusts lower-body CoM support polygon while elevating the left manipulator toward the cylinder.',
      zh: '人形机器人实时调整质心支撑域，同时抬升左臂末端至黑色圆柱预抓取位姿。',
    },
  },
  {
    id: 'grasp',
    startSec: 12.0,
    endSec: 20.0,
    phase: 'GRASP',
    command: 'gripper.close(force_limit=18.0) && lift(dz=+0.16)',
    description: {
      en: 'Closed-loop contact grasp lifts the upright cylinder smoothly while maintaining bipedal stability.',
      zh: '闭环接触抓取稳定抬起竖直圆柱，双足全身平衡控制器同步抵消负载扰动。',
    },
  },
  {
    id: 'place',
    startSec: 20.0,
    endSec: 28.0,
    phase: 'PLACE',
    command: 'transport_to(target="wire_basket_center") && release()',
    description: {
      en: 'Transfers object over the wire basket and confirms completion state back to the LLM agent.',
      zh: '将物体平稳转移至桌上网篮上方并释放，随后向 LLM 智能体回传任务完成状态。',
    },
  },
];

export function resolveLlmTraceStep(currentTimeSec: number): LlmTraceStep {
  for (const step of LLM_G1_TRACE_STEPS) {
    if (currentTimeSec >= step.startSec && currentTimeSec < step.endSec) {
      return step;
    }
  }
  return LLM_G1_TRACE_STEPS[LLM_G1_TRACE_STEPS.length - 1];
}

/**
 * Resolves a relative or absolute RRD URL safely across both localhost dev and GitHub Pages subpaths.
 */
export function resolveRrdUrl(rawUrl: string, baseHref: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';
  if (/^(https?:|blob:|rerun(\+https?)?:)/i.test(trimmed)) {
    return trimmed;
  }
  try {
    return new URL(trimmed, baseHref).href;
  } catch {
    return trimmed;
  }
}

export interface CliOutputLine {
  kind: 'cmd' | 'info' | 'accent' | 'table' | 'warn';
  text: string;
}

export function evaluateWqbCommand(rawCommand: string, locale: Locale): CliOutputLine[] {
  const cmd = rawCommand.trim();
  const normalized = cmd.toLowerCase();

  if (!cmd || normalized === 'help' || normalized === 'wqb --help') {
    return [
      { kind: 'cmd', text: `$ ${cmd || 'wqb --help'}` },
      {
        kind: 'info',
        text:
          locale === 'zh'
            ? 'wqb_cli — WorldQuant BRAIN Agent-Native CLI & MCP 工具集'
            : 'wqb_cli — Agent-Native CLI & MCP Toolkit for WorldQuant BRAIN',
      },
      { kind: 'accent', text: '  wqb alpha search --region USA --delay 1' },
      { kind: 'accent', text: '  wqb sim run "rank(ts_delta(close, 5)) / ts_std_dev(returns, 20)"' },
      { kind: 'accent', text: '  wqb mcp screen --sharpe 1.8 --turnover 0.35' },
      { kind: 'accent', text: '  wqb status' },
    ];
  }

  if (normalized.includes('status')) {
    return [
      { kind: 'cmd', text: `$ ${cmd}` },
      { kind: 'info', text: 'Session      : authenticated (WorldQuant BRAIN REST v2)' },
      { kind: 'info', text: 'MCP Server   : stdio + streamable-http ready (6 tools registered)' },
      { kind: 'accent', text: 'Rate Budget  : 42 / 60 concurrent simulation slots available' },
      { kind: 'info', text: 'Repository   : https://github.com/untuitivist/wqb_cli' },
    ];
  }

  if (normalized.includes('search')) {
    return [
      { kind: 'cmd', text: `$ ${cmd}` },
      { kind: 'info', text: 'Querying WorldQuant BRAIN data fields [USA · TOP3000 · D1]...' },
      { kind: 'table', text: 'FIELD_ID                  DATASET          COVERAGE   TYPE' },
      { kind: 'table', text: 'mdl175_momentum_20d       model175         0.984      MATRIX' },
      { kind: 'table', text: 'fnd6_ebitda_ttm           fundamental6     0.941      MATRIX' },
      { kind: 'table', text: 'snt_news_polarity_5d      sentiment1       0.876      VECTOR' },
      { kind: 'accent', text: '3 candidate fields exported → ready for MCP hypothesis synthesis.' },
    ];
  }

  if (normalized.includes('sim')) {
    return [
      { kind: 'cmd', text: `$ ${cmd}` },
      { kind: 'info', text: 'Compiling FastExpr AST & dispatching BRAIN simulation batch...' },
      { kind: 'table', text: 'SHARPE    FITNESS   TURNOVER   DRAWDOWN   MARGIN(bps)   IS_CHECKS' },
      { kind: 'accent', text: '2.18      1.49      18.4%      -6.2%      14.8          PASS (7/7)' },
      {
        kind: 'info',
        text:
          locale === 'zh'
            ? '中性化: SUBINDUSTRY · 衰减: 4 · 样本内全部风控指标通过。'
            : 'Neutralization: SUBINDUSTRY · Decay: 4 · All in-sample checks passed.',
      },
    ];
  }

  if (normalized.includes('screen') || normalized.includes('mcp')) {
    return [
      { kind: 'cmd', text: `$ ${cmd}` },
      { kind: 'info', text: 'MCP tool `brain_screen_alphas` filtering 64 simulated candidates...' },
      { kind: 'table', text: 'ALPHA_ID      SHARPE   FITNESS   CORR_MAX   STATUS' },
      { kind: 'accent', text: 'wqb_8f2a19    2.31     1.62      0.41       SUBMIT_READY' },
      { kind: 'accent', text: 'wqb_3c9d04    1.96     1.34      0.52       SUBMIT_READY' },
      { kind: 'info', text: 'wqb_7a1b88    1.84     1.12      0.74       PRUNED (HIGH_CORR)' },
      { kind: 'accent', text: '2 orthogonal alphas shortlisted for portfolio submission.' },
    ];
  }

  return [
    { kind: 'cmd', text: `$ ${cmd}` },
    {
      kind: 'warn',
      text:
        locale === 'zh'
          ? `未识别命令 "${cmd}"。输入 help 查看可用 wqb_cli / MCP 命令。`
          : `Unknown command "${cmd}". Type "help" to inspect available wqb_cli / MCP commands.`,
    },
  ];
}
