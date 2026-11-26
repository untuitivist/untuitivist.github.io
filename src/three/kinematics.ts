export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ArmJointAngles {
  q1: number; // Base yaw (rad)
  q2: number; // Shoulder pitch (rad)
  q3: number; // Elbow pitch (rad)
  q4: number; // Forearm roll (rad)
  q5: number; // Wrist pitch (rad)
  q6: number; // Flange roll (rad)
}

export interface ArmKinematicsResult {
  angles: ArmJointAngles;
  shoulder: Vec3;
  elbow: Vec3;
  wrist: Vec3;
  tcp: Vec3;
  reach: number;
}

export const ARM_DIMENSIONS = {
  pedestalHeight: 0.42,
  shoulderHeight: 0.46,
  upperArmLength: 1.42,
  forearmLength: 1.18,
  wristLength: 0.44,
} as const;

/**
 * Generates a smooth, periodic 6-DOF trajectory for phase in [0, 1].
 */
export function sampleArmTrajectory(phase01: number): ArmJointAngles {
  const p = ((phase01 % 1) + 1) % 1;
  const tau = p * Math.PI * 2;

  return {
    q1: Math.sin(tau) * 1.12 + Math.cos(tau * 0.5) * 0.14,
    q2: 0.34 + Math.sin(tau * 2) * 0.28,
    q3: 0.72 + Math.cos(tau * 2 + 0.4) * 0.34,
    q4: Math.sin(tau * 2) * 0.65,
    q5: -0.58 + Math.sin(tau + 0.7) * 0.32,
    q6: tau,
  };
}

/**
 * Computes exact 3D joint positions in Y-up world coordinates matching the Three.js hierarchy:
 * - joint1 rotates around +Y by q1
 * - joint2 pitches forward in local +X/+Y plane around -Z by q2 (0 = straight up)
 * - joint3 pitches further around -Z by q3
 * - joint5 pitches wrist around -Z by q5
 */
export function solveForwardKinematics(angles: ArmJointAngles): ArmKinematicsResult {
  const { pedestalHeight, shoulderHeight, upperArmLength, forearmLength, wristLength } =
    ARM_DIMENSIONS;

  const baseY = pedestalHeight + shoulderHeight;
  const shoulder: Vec3 = { x: 0, y: baseY, z: 0 };

  const cosY = Math.cos(angles.q1);
  const sinY = Math.sin(angles.q1);

  const a1 = angles.q2;
  const r1 = upperArmLength * Math.sin(a1);
  const y1 = baseY + upperArmLength * Math.cos(a1);

  const elbow: Vec3 = {
    x: r1 * cosY,
    y: y1,
    z: -r1 * sinY,
  };

  const a2 = angles.q2 + angles.q3;
  const r2 = r1 + forearmLength * Math.sin(a2);
  const y2 = y1 + forearmLength * Math.cos(a2);

  const wrist: Vec3 = {
    x: r2 * cosY,
    y: y2,
    z: -r2 * sinY,
  };

  const a3 = a2 + angles.q5;
  const r3 = r2 + wristLength * Math.sin(a3);
  const y3 = y2 + wristLength * Math.cos(a3);

  const tcp: Vec3 = {
    x: r3 * cosY,
    y: y3,
    z: -r3 * sinY,
  };

  const reach = Math.hypot(tcp.x, tcp.y - baseY, tcp.z);

  return {
    angles,
    shoulder,
    elbow,
    wrist,
    tcp,
    reach,
  };
}

/**
 * Evaluates a physics-inspired time-frequency bearing vibration spectrogram height
 * for normalized coordinates u, v in [-1, 1] and phase in [0, 1].
 */
export function evaluateSpectralHeight(u: number, v: number, phase01: number): number {
  const tau = phase01 * Math.PI * 2;

  // Fault harmonic ridges along frequency axis (v)
  const ridge1 = Math.exp(-Math.pow((v + 0.42) * 5.2, 2)) * (0.62 + 0.28 * Math.sin(u * 4.5 - tau));
  const ridge2 =
    Math.exp(-Math.pow((v - 0.12) * 6.0, 2)) * (0.78 + 0.34 * Math.cos(u * 6.2 - tau * 2.0));
  const ridge3 =
    Math.exp(-Math.pow((v - 0.56) * 4.8, 2)) * (0.48 + 0.22 * Math.sin(u * 3.1 + tau));

  // Domain-style modulation wave
  const styleWave = 0.14 * Math.sin(u * 2.8 + v * 2.2 - tau) * Math.exp(-(u * u + v * v) * 0.45);

  // Localized transient impulse packet
  const impulseCenter = Math.sin(tau) * 0.55;
  const impulse =
    0.46 * Math.exp(-(Math.pow((u - impulseCenter) * 3.4, 2) + Math.pow((v - 0.12) * 3.8, 2)));

  return Math.max(0, ridge1 + ridge2 + ridge3 + styleWave + impulse);
}

/**
 * Evaluates cross-sectional alpha factor surface elevation for u, v in [-1, 1].
 */
export function evaluateAlphaSurface(u: number, v: number, phase01: number): number {
  const tau = phase01 * Math.PI * 2;
  const primary = Math.sin(u * 2.6 + tau * 0.5) * Math.cos(v * 2.4 - tau * 0.5) * 0.52;
  const regime =
    0.48 * Math.exp(-(Math.pow((u - 0.32) * 2.2, 2) + Math.pow((v + 0.25) * 2.2, 2))) -
    0.34 * Math.exp(-(Math.pow((u + 0.44) * 2.4, 2) + Math.pow((v - 0.35) * 2.4, 2)));
  const micro = 0.11 * Math.cos((u - v) * 5.2 + tau);
  return primary + regime + micro;
}

export interface SpatialTelemetry {
  primaryLabel: string;
  primaryValue: string;
  secondaryLabel: string;
  secondaryValue: string;
  tertiaryLabel: string;
  tertiaryValue: string;
}

export function computeModeTelemetry(
  mode: 'embodied' | 'signals' | 'quant',
  phase01: number,
): SpatialTelemetry {
  if (mode === 'embodied') {
    const fk = solveForwardKinematics(sampleArmTrajectory(phase01));
    const q1Deg = ((fk.angles.q1 * 180) / Math.PI).toFixed(1);
    const q2Deg = ((fk.angles.q2 * 180) / Math.PI).toFixed(1);
    const q3Deg = ((fk.angles.q3 * 180) / Math.PI).toFixed(1);
    return {
      primaryLabel: 'TCP',
      primaryValue: `${fk.tcp.x.toFixed(2)}, ${fk.tcp.y.toFixed(2)}, ${fk.tcp.z.toFixed(2)} m`,
      secondaryLabel: 'Q1–Q3',
      secondaryValue: `${q1Deg}° / ${q2Deg}° / ${q3Deg}°`,
      tertiaryLabel: 'REACH',
      tertiaryValue: `${fk.reach.toFixed(2)} m`,
    };
  }

  if (mode === 'signals') {
    const tau = phase01 * Math.PI * 2;
    const bandEnergy = (98.7 + 0.8 * Math.sin(tau)).toFixed(2);
    const peakHz = Math.round(1420 + 185 * Math.cos(tau));
    const snrDb = (18.4 + 2.1 * Math.sin(tau * 2)).toFixed(1);
    return {
      primaryLabel: 'BAND-E',
      primaryValue: `${bandEnergy}%`,
      secondaryLabel: 'PEAK',
      secondaryValue: `${peakHz} Hz`,
      tertiaryLabel: 'SNR',
      tertiaryValue: `${snrDb} dB`,
    };
  }

  const tau = phase01 * Math.PI * 2;
  const rankIc = (0.068 + 0.014 * Math.sin(tau)).toFixed(3);
  const sharpe = (2.14 + 0.28 * Math.cos(tau)).toFixed(2);
  const turnover = (14.2 + 1.8 * Math.sin(tau * 2)).toFixed(1);
  return {
    primaryLabel: 'RANK IC',
    primaryValue: `+${rankIc}`,
    secondaryLabel: 'SHARPE',
    secondaryValue: sharpe,
    tertiaryLabel: 'TURNOVER',
    tertiaryValue: `${turnover}%`,
  };
}
