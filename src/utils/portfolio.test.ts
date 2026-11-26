import assert from 'node:assert/strict';
import test from 'node:test';
import {
  computeOrbitalNodePosition,
  evaluateWqbCommand,
  resolveLlmTraceStep,
  resolveRetargetingChapter,
  resolveRrdUrl,
} from './portfolio.ts';
import {
  evaluateSpectralHeight,
  sampleArmTrajectory,
  solveForwardKinematics,
} from '../three/kinematics.ts';

test('computeOrbitalNodePosition preserves orbital radius under arbitrary 3D tilt', () => {
  const radius = 4.5;
  const pos = computeOrbitalNodePosition(radius, [0.32, -0.45, 0.21], 1.23);
  const dist = Math.hypot(pos.x, pos.y, pos.z);
  assert.ok(Math.abs(dist - radius) < 1e-9, `Expected distance ${radius}, got ${dist}`);
});

test('resolveRetargetingChapter maps timestamps across all 5 pipeline stages', () => {
  assert.equal(resolveRetargetingChapter(0).id, 'source');
  assert.equal(resolveRetargetingChapter(10.2).id, 'recovery');
  assert.equal(resolveRetargetingChapter(20.0).id, 'gmr');
  assert.equal(resolveRetargetingChapter(31.5).id, 'mjlab');
  assert.equal(resolveRetargetingChapter(44.0).id, 'sim2real');
});

test('resolveLlmTraceStep aligns perspective.mp4 timecodes to LLM control phases', () => {
  assert.equal(resolveLlmTraceStep(1.5).phase, 'PLAN');
  assert.equal(resolveLlmTraceStep(8.0).phase, 'STABILIZE');
  assert.equal(resolveLlmTraceStep(15.0).phase, 'GRASP');
  assert.equal(resolveLlmTraceStep(24.0).phase, 'PLACE');
});

test('resolveRrdUrl handles relative GitHub Pages paths and absolute/blob URLs', () => {
  assert.equal(
    resolveRrdUrl('./recordings/llm-g1-sim.rrd', 'https://untuitivist.github.io/site/index.html'),
    'https://untuitivist.github.io/site/recordings/llm-g1-sim.rrd',
  );
  assert.equal(
    resolveRrdUrl('https://app.rerun.io/version/0.44.0/examples/dna.rrd', 'http://localhost:3000/'),
    'https://app.rerun.io/version/0.44.0/examples/dna.rrd',
  );
  assert.equal(
    resolveRrdUrl('blob:https://example.com/1234', 'http://localhost:3000/'),
    'blob:https://example.com/1234',
  );
});

test('evaluateWqbCommand simulates deterministic CLI and MCP workflows in EN and ZH', () => {
  const simOut = evaluateWqbCommand('wqb sim run "rank(close)"', 'en');
  assert.ok(simOut.some((l) => l.text.includes('PASS (7/7)')));
  const helpZh = evaluateWqbCommand('help', 'zh');
  assert.ok(helpZh.some((l) => l.text.includes('Agent-Native')));
});

test('6-DOF forward kinematics and spectral evaluator produce bounded physical values', () => {
  const angles = sampleArmTrajectory(0.25);
  const fk = solveForwardKinematics(angles);
  assert.ok(fk.reach > 0.2 && fk.reach <= 3.1, `Unexpected reach: ${fk.reach}`);
  assert.ok(Number.isFinite(fk.tcp.x) && Number.isFinite(fk.tcp.y) && Number.isFinite(fk.tcp.z));

  const spec = evaluateSpectralHeight(0.1, 0.12, 0.5);
  assert.ok(spec >= 0 && spec < 3.0, `Unexpected spectral height: ${spec}`);
});
