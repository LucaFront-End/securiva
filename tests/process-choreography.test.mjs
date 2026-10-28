import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import * as THREE from 'three';
import { PROCESS_PHASES, sampleProcessPose } from '../src/vendor/process-choreography.js';

test('the four controls share meaningful normalized physical landmarks', () => {
  assert.deepEqual(PROCESS_PHASES, [0, 0.3, 0.64, 1]);
  assert.ok(Object.isFrozen(PROCESS_PHASES));
  const define = sampleProcessPose(0);
  const investigate = sampleProcessPose(0.3);
  const demonstrate = sampleProcessPose(0.64);
  const retest = sampleProcessPose(1);
  assert.equal(define.open, 0);
  assert.equal(define.defect, 0);
  assert.ok(investigate.open > 0.9 && investigate.scan === 1 && investigate.defect === 1);
  assert.ok(1.42 + investigate.open * 0.52 > 1.88, 'the upper layer visibly separates at the investigation landmark');
  assert.ok(1.72 + investigate.open * 1.03 > 2.65, 'the lid opens above the exposed layers');
  assert.equal(demonstrate.evidence, 1);
  assert.equal(demonstrate.report, 1);
  assert.ok(0.55 + demonstrate.evidence * 1.35 > 1.8, 'the proof cartridge clears the core toward the viewer');
  assert.ok(demonstrate.report * 1.08 > 1, 'the physical report opens beyond 57 degrees');
  assert.equal(retest.open, 0);
  assert.equal(retest.evidence, 0);
  assert.equal(retest.report, 0);
  assert.equal(retest.defect, 0);
  assert.equal(retest.scan, 0);
  assert.equal(retest.seal, 1);
  assert.equal(retest.seat, 1);
  assert.equal(retest.yaw, 0);
});

test('sampler is bounded, finite and reuses its output without clock or history', () => {
  assert.deepEqual(sampleProcessPose(-1), sampleProcessPose(0));
  assert.deepEqual(sampleProcessPose(4), sampleProcessPose(1));
  assert.deepEqual(sampleProcessPose(NaN), sampleProcessPose(0));
  const out = {};
  for (let index = 0; index <= 2000; index++) {
    const progress = index / 2000;
    assert.equal(sampleProcessPose(progress, out), out);
    for (const value of Object.values(out)) assert.ok(Number.isFinite(value));
    for (const key of ['open', 'scan', 'evidence', 'report', 'defect', 'seal', 'seat', 'focus']) assert.ok(out[key] >= -1e-12 && out[key] <= 1 + 1e-12, key);
    assert.ok(out.lidPitch >= -1e-12 && out.lidPitch <= 0.380001);
    assert.ok(out.scannerX >= -1.300001 && out.scannerX <= 1.300001);
    assert.ok(out.yaw >= -0.130001 && out.yaw <= 0.140001);
  }
  const positions = [0, 0.05, 0.18, 0.3, 0.46, 0.64, 0.81, 0.95, 1];
  const forward = positions.map(p => sampleProcessPose(p));
  for (let i = positions.length - 1; i >= 0; i--) assert.deepEqual(sampleProcessPose(positions[i], out), forward[i]);
});

test('mechanism moves before the first chapter switch and has no seam jumps', () => {
  assert.ok(sampleProcessPose(0.05).open > 0);
  assert.ok(sampleProcessPose(0.05).scannerX > -1.3);
  assert.ok(sampleProcessPose(0.05).yaw < 0);
  const knots = [0.1, 0.12, 0.15, 0.18, 0.24, 0.3, 0.4, 0.44, 0.47, 0.48, 0.5, 0.58, 0.64, 0.7, 0.72, 0.74, 0.78, 0.8, 0.82, 0.83, 0.86, 0.88, 0.9, 0.92, 0.93, 0.95, 0.96];
  const epsilon = 1e-6;
  for (const p of knots) {
    const before = sampleProcessPose(p - epsilon);
    const at = sampleProcessPose(p);
    const after = sampleProcessPose(p + epsilon);
    for (const key of Object.keys(at)) {
      assert.ok(Math.abs(after[key] - before[key]) < 0.0001, `${key} position at ${p}`);
      const incoming = (at[key] - before[key]) / epsilon;
      const outgoing = (after[key] - at[key]) / epsilon;
      assert.ok(Math.abs(incoming - outgoing) < 0.03, `${key} velocity at ${p}`);
    }
  }
});

test('extraction and seal seating respect the mechanical height and perimeter budget', () => {
  for (let index = 0; index <= 1000; index++) {
    const pose = sampleProcessPose(index / 1000);
    const lidTop = 1.72 + pose.open * 1.03 + 0.22 + 1.09 * Math.sin(pose.lidPitch) + pose.open * 0.075;
    const evidenceFront = 0.55 + pose.evidence * 1.35 + 0.5;
    const evidenceRight = 0.12 + pose.evidence * 0.4 + 0.65;
    const sealTop = 3.57 - pose.seat * 1.57 + pose.seal * 0.16;
    assert.ok(lidTop < 3.9);
    assert.ok(evidenceFront < 2.7 && evidenceRight < 3.6);
    assert.ok(sealTop < 3.9);
  }
  // At rest the validation seal sits above the clearcoat lid rather than
  // intersecting it; on return the complete core is closed underneath it.
  const closedLidTop = 1.72 + 0.17 + 0.027 / 2 + 0.012;
  const sealBottom = 2 - 0.1 / 2 - 0.02;
  assert.ok(sealBottom > closedLidTop);
});

test('actual desktop and mobile geometry remains inside the framing envelope throughout the sweep', async () => {
  // Texture pixels never affect vertex bounds. A no-op 2D context keeps this
  // spatial contract test DOM/GPU-free while testing the actual Three geometry.
  const previousDocument = globalThis.document;
  const noop = () => {};
  globalThis.document = { createElement: () => ({ width: 1, height: 1, getContext: () => new Proxy({}, { get: (target, key) => key in target ? target[key] : noop }) }) };
  try {
    const built = await build({ entryPoints: ['src/vendor/process-scene.js'], bundle: true, write: false, platform: 'node', format: 'esm', logLevel: 'silent' });
    const module = await import(`data:text/javascript;base64,${Buffer.from(built.outputFiles[0].contents).toString('base64')}`);
    const bounds = new THREE.Box3();
    for (const compact of [false, true]) {
      const composition = module.createProcessComposition(compact);
      try {
        for (let index = 0; index <= 100; index++) {
          composition.update(index / 100, 0, 0, false);
          composition.root.updateMatrixWorld(true);
          bounds.setFromObject(composition.root, true);
          assert.ok(bounds.min.x >= -3.6 && bounds.max.x <= 3.6, `X envelope at ${index}, compact=${compact}`);
          assert.ok(bounds.min.z >= -2.7 && bounds.max.z <= 2.7, `Z envelope at ${index}, compact=${compact}`);
          assert.ok(bounds.min.y >= -0.001 && bounds.max.y < 3.9, `Y envelope at ${index}, compact=${compact}`);
        }
      } finally {
        composition.dispose();
      }
    }
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
});
