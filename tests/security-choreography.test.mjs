import test from 'node:test';
import assert from 'node:assert/strict';
import { SECURITY_PHASES, sampleSecurityPose } from '../src/vendor/security-choreography.js';

test('phase controls share normalized landmarks and exact meaningful endpoint poses', () => {
  assert.deepEqual(SECURITY_PHASES, [0, 0.3, 0.64, 1]);
  assert.ok(Object.isFrozen(SECURITY_PHASES));
  const start = sampleSecurityPose(0);
  const proof = sampleSecurityPose(SECURITY_PHASES[2]);
  const end = sampleSecurityPose(1);
  assert.equal(start.explode, 0);
  assert.equal(start.proof, 0);
  assert.equal(start.yaw, 0);
  assert.ok(sampleSecurityPose(0.3).gate < -1);
  assert.equal(proof.explode, 1);
  assert.equal(proof.proof, 1);
  assert.equal(proof.risk, 1);
  assert.equal(end.explode, 0);
  assert.equal(end.proof, 0);
  assert.equal(end.gate, 0);
  assert.equal(end.risk, 0);
  assert.equal(end.secured, 1);
  assert.equal(end.yaw, 0);
});

test('sampler clamps scroll bounds, tolerates invalid input and reuses its output', () => {
  assert.deepEqual(sampleSecurityPose(-5), sampleSecurityPose(0));
  assert.deepEqual(sampleSecurityPose(5), sampleSecurityPose(1));
  assert.deepEqual(sampleSecurityPose(NaN), sampleSecurityPose(0));
  const out = {};
  assert.equal(sampleSecurityPose(0.42, out), out);
  assert.deepEqual(out, sampleSecurityPose(0.42));
});

test('all poses stay finite and within the mobile-safe mechanical envelope', () => {
  for (let index = 0; index <= 2000; index++) {
    const pose = sampleSecurityPose(index / 2000);
    for (const [key, value] of Object.entries(pose)) assert.ok(Number.isFinite(value), key);
    for (const key of ['explode', 'proof', 'focus', 'risk', 'secured', 'dataInspect']) {
      assert.ok(pose[key] >= -1e-12 && pose[key] <= 1 + 1e-12, `${key} at ${pose.progress}`);
    }
    assert.ok(pose.gate >= -1.100001 && pose.gate <= 0.000001);
    assert.ok(pose.yaw >= -0.045001 && pose.yaw <= 0.035001);
    assert.ok(pose.webTilt >= -0.075001 && pose.webTilt <= 0.000001);
  }
});

test('the first scroll segment moves continuously instead of waiting for a stage switch', () => {
  const early = sampleSecurityPose(0.04);
  const middle = sampleSecurityPose(0.08);
  const later = sampleSecurityPose(0.12);
  assert.ok(early.explode > 0 && middle.explode > early.explode && later.explode > middle.explode);
  assert.ok(early.yaw < 0 && middle.yaw < early.yaw && later.yaw < middle.yaw);
  assert.ok(early.gate < -0.22 && middle.gate < early.gate);
});

test('piecewise curves have no position or velocity jumps at mechanical keyframes', () => {
  const knots = [0.1, 0.12, 0.13, 0.16, 0.18, 0.27, 0.3, 0.42, 0.48, 0.5, 0.55, 0.64, 0.7, 0.73, 0.74, 0.76, 0.78, 0.82, 0.84, 0.88, 0.9, 0.93, 0.94];
  const epsilon = 1e-6;
  for (const progress of knots) {
    const before = sampleSecurityPose(progress - epsilon);
    const at = sampleSecurityPose(progress);
    const after = sampleSecurityPose(progress + epsilon);
    for (const key of Object.keys(at)) {
      assert.ok(Math.abs(after[key] - before[key]) < 0.0001, `${key} position at ${progress}`);
      const incoming = (at[key] - before[key]) / epsilon;
      const outgoing = (after[key] - at[key]) / epsilon;
      assert.ok(Math.abs(incoming - outgoing) < 0.02, `${key} velocity at ${progress}`);
    }
  }
});

test('reverse scrolling returns exactly the same poses without history or clock dependence', () => {
  const progress = [0, 0.1, 0.19, 0.3, 0.44, 0.58, 0.64, 0.78, 0.9, 1];
  const forward = progress.map(value => sampleSecurityPose(value));
  const out = {};
  for (let index = progress.length - 1; index >= 0; index--) {
    assert.deepEqual(sampleSecurityPose(progress[index], out), forward[index]);
  }
});
