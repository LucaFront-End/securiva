import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { sampleServicePose } from './service-choreography';

/** Local procedural miniatures for the three editorial service cards. */
export function createServiceComposition(kind = 'pentest', compact = false) {
  const root = new THREE.Group();
  const geos = new Map();
  const materials = new Set();
  const textures = new Set();
  const own = value => { materials.add(value); return value; };
  const geo = (key, create) => { if (!geos.has(key)) geos.set(key, create()); return geos.get(key); };
  const satin = own(new THREE.MeshStandardMaterial({ color: '#788898', metalness: 0.94, roughness: 0.3 }));
  const edge = own(new THREE.MeshPhysicalMaterial({ color: '#c0ccd8', metalness: 1, roughness: 0.13, clearcoat: 0.5, clearcoatRoughness: 0.1 }));
  const graphite = own(new THREE.MeshPhysicalMaterial({ color: '#242c36', metalness: 0.7, roughness: 0.36, clearcoat: 0.16, clearcoatRoughness: 0.3 }));
  const black = own(new THREE.MeshStandardMaterial({ color: '#0d1520', metalness: 0.3, roughness: 0.4 }));
  const blue = own(new THREE.MeshStandardMaterial({ color: '#347afa', emissive: '#2563eb', emissiveIntensity: 0.48, metalness: 0.38, roughness: 0.24 }));
  const coral = own(new THREE.MeshStandardMaterial({ color: '#ed785f', emissive: '#cf4f39', emissiveIntensity: 0.2, metalness: 0.4, roughness: 0.3 }));
  const green = own(new THREE.MeshStandardMaterial({ color: '#60bea5', emissive: '#229d7f', emissiveIntensity: 0.28, metalness: 0.4, roughness: 0.3 }));
  const glass = own(new THREE.MeshPhysicalMaterial({ color: '#254059', metalness: 0.04, roughness: 0.15, clearcoat: 0.6, envMapIntensity: 0.5, transparent: true, opacity: 0.36, depthWrite: false, side: THREE.DoubleSide }));
  const add = (parent, geometry, material, position, shadow = true) => {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...position); mesh.castShadow = shadow; mesh.receiveShadow = true;
    parent.add(mesh); return mesh;
  };
  const box = (parent, w, h, d, x, y, z, material = graphite, radius = 0.04, shadow = true) => add(parent,
    geo(`b:${w}:${h}:${d}:${radius}`, () => new RoundedBoxGeometry(w, h, d, compact ? 1 : 2, Math.min(radius, w / 4, h / 4, d / 4))), material, [x, y, z], shadow);
  const hex = (parent, w, d, h, x, y, z, material = graphite) => add(parent, geo(`h:${w}:${d}:${h}`, () => {
    const shape = new THREE.Shape();
    [[-w / 2, 0], [-w * 0.3, -d / 2], [w * 0.3, -d / 2], [w / 2, 0], [w * 0.3, d / 2], [-w * 0.3, d / 2]].forEach(([px, pz], i) => i ? shape.lineTo(px, -pz) : shape.moveTo(px, -pz));
    shape.closePath();
    const result = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025, bevelSegments: compact ? 1 : 2, steps: 1, curveSegments: 1 });
    result.translate(0, 0, -h / 2); result.rotateX(-Math.PI / 2); return result;
  }), material, [x, y, z]);
  const texture = (width, height, draw) => {
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    draw(canvas.getContext('2d'), width, height);
    const value = new THREE.CanvasTexture(canvas); value.colorSpace = THREE.SRGBColorSpace; value.anisotropy = compact ? 2 : 4; textures.add(value); return value;
  };
  const surface = (parent, map, w, d, x, y, z, materialOptions = {}) => {
    const plane = add(parent, geo(`p:${w}:${d}`, () => new THREE.PlaneGeometry(w, d)), own(new THREE.MeshStandardMaterial({ map, metalness: 0.06, roughness: 0.8, ...materialOptions })), [x, y, z], false);
    plane.rotation.x = -Math.PI / 2; return plane;
  };
  const identityMap = (text, bg, ink) => texture(768, 160, (ctx, w, h) => {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h); ctx.fillStyle = ink;
    ctx.font = '600 91px Inter,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, w / 2, h / 2 + 3);
  });
  const checkSeal = parent => {
    const seal = new THREE.Group(); parent.add(seal);
    hex(seal, 0.64, 0.53, 0.07, 0, 0, 0, edge);
    hex(seal, 0.52, 0.42, 0.025, 0, 0.065, 0, green);
    const a = box(seal, 0.18, 0.023, 0.045, -0.075, 0.105, 0.02, edge, 0.008, false); a.rotation.y = -0.72;
    const b = box(seal, 0.29, 0.023, 0.045, 0.075, 0.105, -0.025, edge, 0.008, false); b.rotation.y = 0.74;
    return seal;
  };
  const brushSize = compact ? 64 : 128;
  const pixels = new Uint8Array(brushSize * brushSize * 4);
  for (let y = 0; y < brushSize; y++) for (let x = 0; x < brushSize; x++) {
    const i = (y * brushSize + x) * 4;
    const v = Math.round(210 + Math.sin(y * 0.8) * 8 + ((x * 73 + y * 19) % 13 - 6) * 0.45);
    pixels[i] = pixels[i + 1] = pixels[i + 2] = v; pixels[i + 3] = 255;
  }
  const brush = new THREE.DataTexture(pixels, brushSize, brushSize, THREE.RGBAFormat); brush.wrapS = brush.wrapT = THREE.RepeatWrapping; brush.repeat.set(2, 2); brush.magFilter = THREE.LinearFilter; brush.minFilter = THREE.LinearMipmapLinearFilter; brush.generateMipmaps = true; brush.needsUpdate = true; textures.add(brush);
  satin.roughnessMap = brush; satin.bumpMap = brush; satin.bumpScale = 0.004; graphite.roughnessMap = brush;

  const pose = sampleServicePose(kind, 0, 0, true);
  const next = { ...pose };
  const keys = Object.keys(pose);
  let apply = () => {};

  if (kind === 'pentest') {
    hex(root, 4.3, 3.05, 0.19, 0, 0.17, 0, graphite);
    hex(root, 4.14, 2.91, 0.035, 0, 0.32, 0, edge);
    surface(root, identityMap('WEB', '#263242', '#ccd9e8'), 0.6, 0.19, -1.4, 0.371, 0.63);
    surface(root, identityMap('API', '#263242', '#ccd9e8'), 0.6, 0.19, 1.4, 0.371, 0.63);
    [-1, 1].forEach(side => {
      box(root, 0.79, 0.014, 0.045, side * 1.24, 0.374, 0.24, black, 0.006, false);
      box(root, 0.75, 0.012, 0.013, side * 1.24, 0.386, 0.24, blue, 0.003, false);
      hex(root, 0.11, 0.09, 0.018, side * 1.7, 0.375, -0.45, edge);
      box(root, 0.046, 0.005, 0.01, side * 1.7, 0.413, -0.45, black, 0.002, false);
    });
    const layers = [];
    for (let i = 0; i < 3; i++) {
      const layer = new THREE.Group(); root.add(layer);
      hex(layer, 2.1, 1.66, 0.18, 0, 0, 0, i === 1 ? satin : graphite);
      hex(layer, 2.15, 1.7, 0.025, 0, -0.06, 0, edge);
      hex(layer, 1.78, 1.4, 0.018, 0, 0.14, 0, blue);
      hex(layer, 1.62, 1.27, 0.024, 0, 0.16, 0, black);
      layers.push(layer);
    }
    const lid = new THREE.Group(); root.add(lid);
    hex(lid, 2.28, 1.84, 0.13, 0, 0, 0, satin);
    hex(lid, 1.96, 1.56, 0.035, 0, 0.11, 0, graphite);
    hex(lid, 1.45, 1.15, 0.025, 0, 0.15, 0, glass);
    [-1.38, 1.38].forEach(x => box(root, 0.12, 2.05, 0.16, x, 1.36, -0.62, satin, 0.025));
    box(root, 3.03, 0.17, 0.23, 0, 2.43, -0.62, graphite);
    box(root, 2.8, 0.023, 0.025, 0, 2.44, -0.48, edge, 0.006, false);
    const probe = new THREE.Group(); probe.position.set(-1.1, 2.28, -0.35); root.add(probe);
    box(probe, 0.48, 0.23, 0.55, 0, 0, 0, graphite);
    box(probe, 0.27, 0.13, 0.25, 0, -0.18, 0.22, satin);
    box(probe, 0.19, 0.025, 0.17, 0, -0.265, 0.22, blue, 0.015, false);
    const defect = box(root, 0.21, 0.21, 0.21, 0.56, 1.08, 0.5, coral, 0.025);
    const beamMat = own(new THREE.MeshBasicMaterial({ color: '#76b4ff', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    const beam = box(root, 0.014, 0.9, 0.48, 0, 1.49, -0.13, beamMat, 0.002, false);
    apply = () => {
      for (let i = 0; i < layers.length; i++) layers[i].position.set((i % 2 ? 1 : -1) * pose.open * 0.1, 0.58 + i * 0.25 + pose.open * i * 0.12, 0);
      lid.position.set(-pose.open * 0.09, 1.43 + pose.open * 0.46, -pose.open * 0.08);
      lid.rotation.x = pose.open * 0.16;
      probe.position.x = pose.probeX;
      beam.position.x = pose.probeX;
      beamMat.opacity = pose.scan * 0.075;
      defect.scale.setScalar(Math.max(0.001, pose.defect));
    };
  } else if (kind === 'bounty') {
    box(root, 5.02, 0.2, 3.12, 0, 0.17, 0, graphite, 0.1);
    box(root, 4.84, 0.045, 2.94, 0, 0.32, 0, edge, 0.035);
    box(root, 4.67, 0.036, 2.79, 0, 0.383, 0, black, 0.025);
    const track = (rx, rz, radius, material, y) => {
      const points = [];
      const segments = compact ? 36 : 56;
      for (let i = 0; i < segments; i++) {
        const theta = i / segments * Math.PI * 2;
        points.push(new THREE.Vector3(rx * Math.cos(theta), y, rz * Math.sin(theta) - 0.15));
      }
      const curve = new THREE.CatmullRomCurve3(points, true, 'centripetal');
      add(root, geo(`track:${rx}:${rz}:${radius}`, () => new THREE.TubeGeometry(curve, compact ? 64 : 96, radius, compact ? 5 : 7, true)), material, [0, 0, 0], false);
    };
    track(1.6, 0.72, 0.11, graphite, 0.51);
    track(1.74, 0.84, 0.022, edge, 0.53);
    track(1.44, 0.6, 0.016, blue, 0.53);
    // The portal is across the forward lane; the rear lane returns the cradle.
    [0.14, 1.03].forEach(z => {
      box(root, 0.31, 0.12, 0.3, 0, 0.47, z, graphite);
      box(root, 0.15, 1.13, 0.15, 0, 1.03, z, satin, 0.025);
      box(root, 0.018, 0.89, 0.025, 0.091, 1.05, z, blue, 0.004, false);
    });
    box(root, 0.3, 0.19, 1.15, 0, 1.67, 0.585, graphite);
    box(root, 0.023, 0.035, 0.95, 0.172, 1.66, 0.585, edge, 0.007, false);
    const gate = new THREE.Group(); root.add(gate);
    box(gate, 0.065, 0.27, 0.76, 0, 0, 0, glass, 0.018, false);
    box(gate, 0.028, 0.03, 0.76, 0.046, -0.147, 0, blue, 0.005, false);
    const gateLight = own(new THREE.MeshBasicMaterial({ color: '#65b9ff', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
    box(root, 0.009, 0.83, 0.72, 0.06, 1.02, 0.585, gateLight, 0.002, false);

    const proof = new THREE.Group(); proof.name = 'validated-proof'; root.add(proof);
    box(proof, 0.64, 0.17, 0.83, 0, 0, 0, satin);
    box(proof, 0.49, 0.025, 0.65, 0, 0.115, 0, black, 0.015, false);
    box(proof, 0.33, 0.035, 0.42, 0, 0.154, 0, glass, 0.014, false);
    box(proof, 0.19, 0.018, 0.035, 0, 0.185, 0, blue, 0.006, false);
    const seal = checkSeal(proof);
    seal.position.y = 0.26;

    // A separate unconfirmed submission never enters the validation lane.
    box(root, 0.78, 0.075, 0.65, -1.84, 0.46, 0.99, graphite);
    const unconfirmed = new THREE.Group(); unconfirmed.name = 'unconfirmed-submission'; unconfirmed.position.set(-1.84, 0.58, 0.99); unconfirmed.rotation.y = -0.15; root.add(unconfirmed);
    box(unconfirmed, 0.56, 0.12, 0.45, 0, 0, 0, satin);
    box(unconfirmed, 0.35, 0.025, 0.27, 0, 0.086, 0, black, 0.012, false);
    box(unconfirmed, 0.1, 0.025, 0.1, 0.12, 0.115, 0.04, coral, 0.012, false);
    surface(root, identityMap('REGLAS', '#172130', '#b8c7da'), 0.9, 0.22, 1.66, 0.432, 1.16);
    for (let i = 0; i < 4; i++) box(root, 0.1, 0.007, 0.02, 1.3 + i * 0.19, 0.438, 1.39, edge, 0.003, false);

    apply = () => {
      proof.position.set(pose.cartridgeX, 0.685, pose.cartridgeZ);
      proof.rotation.y = Math.atan2(pose.headingX, pose.headingZ);
      gate.position.set(0, 0.88 + pose.gateOpen * 0.57, 0.585);
      gateLight.opacity = pose.scan * 0.09;
      seal.scale.setScalar(Math.max(0.001, pose.accepted * 0.72));
    };
  } else if (kind === 'label') {
    box(root, 3.76, 0.18, 2.47, 0, 0.22, 0, graphite, 0.09);
    box(root, 3.58, 0.042, 2.31, 0, 0.36, 0, edge, 0.022);
    // The technical blue core never moves or changes between identities.
    const technicalCore = box(root, 3.43, 0.27, 2.22, 0, 0.535, 0, blue, 0.045);
    technicalCore.name = 'fixed-technical-core';
    for (let i = 0; i < 4; i++) box(root, 3.3, 0.026, 2.1, 0, 0.716 + i * 0.031, 0, i % 2 ? satin : edge, 0.012, false);
    const page = texture(768, 512, (ctx, w, h) => {
      ctx.fillStyle = '#b8c8d2'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#203c55'; ctx.font = '600 42px monospace'; ctx.fillText('INFORME TÉCNICO', 48, 84);
      ctx.fillStyle = '#506b82';
      for (let i = 0; i < 5; i++) ctx.fillRect(48, 127 + i * 24, i % 2 ? 360 : 480, 6);
      ctx.strokeStyle = '#174fc0'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(105, 333); ctx.lineTo(310, 333); ctx.lineTo(428, 406); ctx.lineTo(660, 406); ctx.stroke();
      ctx.fillStyle = '#2563eb'; ctx.fillRect(65, 299, 90, 68); ctx.fillRect(390, 373, 82, 68);
      ctx.strokeStyle = '#2a4860'; ctx.lineWidth = 4; ctx.strokeRect(610, 373, 87, 68);
    });
    surface(root, page, 3.12, 1.93, 0, 0.833, 0);
    box(root, 0.06, 0.25, 2.06, -1.73, 0.55, 0, edge, 0.015);
    for (let i = 0; i < 3; i++) box(root, 0.023, 0.016, 0.29, -1.772, 0.55, -0.65 + i * 0.65, black, 0.004, false);

    const sleeve = (name, body, bg, ink) => {
      const group = new THREE.Group(); root.add(group);
      box(group, 3.72, 0.14, 0.55, 0, 0, 0, body, 0.035);
      [-1.8, 1.8].forEach(x => box(group, 0.1, 0.25, 0.55, x, -0.1, 0, body, 0.025));
      surface(group, identityMap(name, bg, ink), 3.43, 0.4, 0, 0.081, 0, { color: '#dce6ed', roughness: 0.72 });
      box(group, 3.41, 0.012, 0.018, 0, 0.085, 0.23, edge, 0.003, false);
      return group;
    };
    const securiva = sleeve('SECURIVA', graphite, '#172130', '#f1f5fa');
    const agency = sleeve('TU AGENCIA', satin, '#c6d2da', '#162d42');
    [-1.99, 1.99].forEach(x => {
      box(root, 0.065, 0.55, 0.07, x, 0.65, 0.85, graphite, 0.014);
      box(root, 0.06, 0.06, 1.65, x, 0.95, 0.08, edge, 0.012);
    });
    apply = () => {
      securiva.position.set(pose.sleeveAX, pose.sleeveAY, pose.sleeveAZ);
      agency.position.set(pose.sleeveBX, pose.sleeveBY, pose.sleeveBZ);
      securiva.rotation.z = -pose.sleeveTilt;
      securiva.rotation.y = pose.cycleSin * 0.045;
      agency.rotation.y = -pose.cycleSin * 0.025;
    };
  }

  const update = (progress, time, _delta, moving) => {
    sampleServicePose(kind, progress, time, moving, next);
    let changed = false;
    for (let i = 0; i < keys.length; i++) { const key = keys[i]; if (Math.abs(pose[key] - next[key]) > 1e-6) changed = true; pose[key] = next[key]; }
    root.rotation.y = pose.yaw; apply(); return changed;
  };
  return { root, update, dispose() { geos.forEach(value => value.dispose()); materials.forEach(value => value.dispose()); textures.forEach(value => value.dispose()); } };
}
