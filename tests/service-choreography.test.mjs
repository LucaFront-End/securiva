import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import * as THREE from 'three';
import { SERVICE_KINDS, SERVICE_CYCLE_SECONDS, sampleServicePose } from '../src/vendor/service-choreography.js';

test('each service moves without scrolling, while paused poses ignore the clock', () => {
  for (const kind of SERVICE_KINDS) {
    const first = sampleServicePose(kind, 0.3, 1, true);
    const next = sampleServicePose(kind, 0.3, 4, true);
    const channel = kind === 'pentest' ? 'probeX' : kind === 'bounty' ? 'cartridgeX' : 'sleeveAZ';
    assert.ok(Math.abs(first[channel] - next[channel]) > 0.15, `${kind} genuinely animates`);
    assert.deepEqual(sampleServicePose(kind, 0.3, 1, false), sampleServicePose(kind, 0.3, 500, false));
    const out = {};
    assert.equal(sampleServicePose(kind, 0.3, 2, true, out), out);
  }
});

test('all mechanical channels have continuous position and velocity at the loop wrap', () => {
  const epsilon = 1e-5;
  const progress = 0.37;
  for (const kind of SERVICE_KINDS) {
    const duration = SERVICE_CYCLE_SECONDS[kind];
    const seam = duration * (1 - progress * 0.045);
    const before = sampleServicePose(kind, progress, seam - epsilon, true);
    const at = sampleServicePose(kind, progress, seam, true);
    const after = sampleServicePose(kind, progress, seam + epsilon, true);
    const repeated = sampleServicePose(kind, progress, seam + duration, true);
    for (const key of Object.keys(at)) {
      assert.ok(Number.isFinite(at[key]), `${kind}/${key}`);
      assert.ok(Math.abs(at[key] - repeated[key]) < 1e-10, `${kind}/${key} repeats`);
      assert.ok(Math.abs(after[key] - before[key]) < 0.0001, `${kind}/${key} has no position jump`);
      const incoming = (at[key] - before[key]) / epsilon;
      const outgoing = (after[key] - at[key]) / epsilon;
      assert.ok(Math.abs(incoming - outgoing) < 0.001, `${kind}/${key} has no velocity jump`);
    }
  }
});

test('validation happens after the proof passes through the gate', () => {
  const duration = SERVICE_CYCLE_SECONDS.bounty;
  const incoming = sampleServicePose('bounty', 0, duration * 0.15, true);
  const crossing = sampleServicePose('bounty', 0, duration * 0.25, true);
  const accepted = sampleServicePose('bounty', 0, duration * 0.4, true);
  assert.equal(incoming.accepted, 0);
  assert.ok(incoming.cartridgeX < 0);
  assert.ok(Math.abs(crossing.cartridgeX) < 1e-10 && crossing.gateOpen > 0.99);
  assert.equal(crossing.accepted, 0);
  assert.equal(accepted.accepted, 1);
  assert.ok(accepted.cartridgeX > 1);
});

test('the identity sleeves clear one another during both exchange directions', () => {
  for (let index = 0; index <= 1000; index++) {
    const pose = sampleServicePose('label', 0, SERVICE_CYCLE_SECONDS.label * index / 1000, true);
    if (Math.abs(pose.sleeveAZ - pose.sleeveBZ) < 0.55) {
      const lowerEdgeA = pose.sleeveAY - 0.225 - 1.86 * Math.sin(pose.sleeveTilt);
      const upperEdgeB = pose.sleeveBY + 0.07;
      assert.ok(lowerEdgeA > upperEdgeB, `sleeves collide at ${index / 1000}`);
    }
  }
});

test('real geometry fits each card, stays modest, and the proof queue/core stay fixed', async () => {
  const previousDocument = globalThis.document;
  const noop = () => {};
  // Canvas pixels cannot affect mechanical bounds; keep this CPU test GPU-free.
  globalThis.document = { createElement: () => ({ width: 1, height: 1, getContext: () => new Proxy({}, { get: (target, key) => key in target ? target[key] : noop }) }) };
  try {
    const built = await build({ entryPoints: ['src/vendor/service-scenes.js'], bundle: true, write: false, platform: 'node', format: 'esm', logLevel: 'silent' });
    const module = await import(`data:text/javascript;base64,${Buffer.from(built.outputFiles[0].contents).toString('base64')}`);
    const bounds = new THREE.Box3();
    for (const kind of SERVICE_KINDS) for (const compact of [false, true]) {
      const composition = module.createServiceComposition(kind, compact);
      let meshCount = 0;
      composition.root.traverse(object => { if (object.isMesh) meshCount++; });
      assert.ok(meshCount > 15 && meshCount < 120, `${kind} mesh budget: ${meshCount}`);
      const invariant = composition.root.getObjectByName(kind === 'label' ? 'fixed-technical-core' : 'unconfirmed-submission');
      let initialMatrix;
      try {
        for (let index = 0; index <= 100; index++) {
          composition.update(0.3, SERVICE_CYCLE_SECONDS[kind] * index / 100, 1 / 30, true);
          composition.root.updateMatrixWorld(true);
          bounds.setFromObject(composition.root, true);
          assert.ok(bounds.min.x >= -2.8 && bounds.max.x <= 2.8, `${kind} X bounds`);
          assert.ok(bounds.min.z >= -2.1 && bounds.max.z <= 2.1, `${kind} Z bounds`);
          assert.ok(bounds.min.y >= -0.001 && bounds.max.y <= 3.1, `${kind} Y bounds`);
          if (invariant) {
            if (!initialMatrix) initialMatrix = [...invariant.matrixWorld.elements];
            else assert.deepEqual(invariant.matrixWorld.elements, initialMatrix, `${kind} invariant contents/queue`);
          }
        }
      } finally { composition.dispose(); }
    }
  } finally {
    if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument;
  }
});
