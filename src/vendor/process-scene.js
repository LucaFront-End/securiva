import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { sampleProcessPose } from './process-choreography';

/** Procedural examination apparatus; all surfaces and textures are local. */
export function createProcessComposition(compact = false) {
  const root = new THREE.Group();
  const geometries = new Map();
  const materials = new Set();
  const textures = new Set();
  const own = material => { materials.add(material); return material; };
  const geometry = (key, create) => {
    if (!geometries.has(key)) geometries.set(key, create());
    return geometries.get(key);
  };
  const graphite = own(new THREE.MeshPhysicalMaterial({ color: '#242b33', metalness: 0.76, roughness: 0.35, clearcoat: 0.2, clearcoatRoughness: 0.28 }));
  const steel = own(new THREE.MeshStandardMaterial({ color: '#8796a5', metalness: 0.94, roughness: 0.31 }));
  const edge = own(new THREE.MeshPhysicalMaterial({ color: '#c1ccd5', metalness: 1, roughness: 0.12, clearcoat: 0.6, clearcoatRoughness: 0.08 }));
  const black = own(new THREE.MeshStandardMaterial({ color: '#0b1017', metalness: 0.48, roughness: 0.34 }));
  const blue = own(new THREE.MeshStandardMaterial({ color: '#347aff', emissive: '#2563eb', emissiveIntensity: 0.65, metalness: 0.38, roughness: 0.2 }));
  const coral = own(new THREE.MeshStandardMaterial({ color: '#f07961', emissive: '#dd5741', emissiveIntensity: 0.28, metalness: 0.3, roughness: 0.29 }));
  const green = own(new THREE.MeshStandardMaterial({ color: '#44bea0', emissive: '#21a287', emissiveIntensity: 0.3, metalness: 0.48, roughness: 0.23 }));
  const glass = own(new THREE.MeshPhysicalMaterial({ color: '#263e54', metalness: 0.04, roughness: 0.14, clearcoat: 0.65, clearcoatRoughness: 0.12, envMapIntensity: 0.5, transparent: true, opacity: 0.34, depthWrite: false, side: THREE.DoubleSide }));

  const add = (parent, geo, material, position, shadows = true) => {
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(...position);
    mesh.castShadow = shadows;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const box = (parent, dimensions, position, material = graphite, radius = 0.04, shadows = true) => {
    const [w, h, d] = dimensions;
    const r = Math.min(radius, w / 4, h / 4, d / 4);
    return add(parent, geometry(`box:${w}:${h}:${d}:${r}`, () => new RoundedBoxGeometry(w, h, d, compact ? 2 : 3, r)), material, position, shadows);
  };
  const hex = (parent, width, depth, height, position, material = graphite, bevel = 0.035, shadows = true) => {
    const geo = geometry(`hex:${width}:${depth}:${height}:${bevel}`, () => {
      const shape = new THREE.Shape();
      [[-width / 2, 0], [-width * 0.285, -depth / 2], [width * 0.285, -depth / 2], [width / 2, 0], [width * 0.285, depth / 2], [-width * 0.285, depth / 2]].forEach(([x, z], index) => {
        if (!index) shape.moveTo(x, -z); else shape.lineTo(x, -z);
      });
      shape.closePath();
      const result = new THREE.ExtrudeGeometry(shape, { depth: height, steps: 1, bevelEnabled: true, bevelSegments: compact ? 2 : 3, bevelSize: bevel, bevelThickness: bevel, curveSegments: 1 });
      result.translate(0, 0, -height / 2);
      result.rotateX(-Math.PI / 2);
      return result;
    });
    return add(parent, geo, material, position, shadows);
  };
  const cylinder = (parent, radius, height, position, material = steel, sides = compact ? 12 : 20, shadows = true) => add(parent,
    geometry(`cylinder:${radius}:${height}:${sides}`, () => new THREE.CylinderGeometry(radius, radius, height, sides)), material, position, shadows);
  const screw = (parent, x, y, z) => {
    cylinder(parent, 0.042, 0.022, [x, y, z], edge, 6, false);
    box(parent, [0.035, 0.005, 0.009], [x, y + 0.013, z], black, 0.001, false);
  };
  const line = (parent, from, to, thickness, material = blue) => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const direction = b.clone().sub(a);
    const segment = box(parent, [thickness, direction.length(), thickness], [0, 0, 0], material, thickness / 4, false);
    segment.position.copy(a).add(b).multiplyScalar(0.5);
    segment.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.normalize());
    return segment;
  };
  const makeTexture = (width, height, draw) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    draw(canvas.getContext('2d'), width, height);
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    result.anisotropy = compact ? 2 : 4;
    textures.add(result);
    return result;
  };
  const label = (parent, text, position, width = 0.52, height = 0.16) => {
    const tex = makeTexture(512, 128, (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#bac9dd';
      ctx.font = '600 66px "JetBrains Mono",monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, w / 2, h / 2);
    });
    return add(parent, geometry(`label:${width}:${height}`, () => new THREE.PlaneGeometry(width, height)),
      own(new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false })), position, false);
  };

  // One shared static brush map; no image downloads or texture work per frame.
  const brushSize = compact ? 128 : 256;
  const brushData = new Uint8Array(brushSize * brushSize * 4);
  for (let y = 0; y < brushSize; y++) {
    const streak = Math.sin(y * 0.61) * 6 + Math.sin(y * 2.17) * 4;
    for (let x = 0; x < brushSize; x++) {
      const value = Math.round(211 + streak + ((x * 73 + y * 193) % 17 - 8) * 0.45);
      const index = (y * brushSize + x) * 4;
      brushData[index] = brushData[index + 1] = brushData[index + 2] = value;
      brushData[index + 3] = 255;
    }
  }
  const brush = new THREE.DataTexture(brushData, brushSize, brushSize, THREE.RGBAFormat);
  brush.wrapS = brush.wrapT = THREE.RepeatWrapping;
  brush.repeat.set(3, 3);
  brush.magFilter = THREE.LinearFilter;
  brush.minFilter = THREE.LinearMipmapLinearFilter;
  brush.generateMipmaps = true;
  brush.needsUpdate = true;
  textures.add(brush);
  steel.roughnessMap = brush;
  steel.bumpMap = brush;
  steel.bumpScale = 0.005;
  graphite.roughnessMap = brush;
  graphite.bumpMap = brush;
  graphite.bumpScale = 0.0018;
  edge.bumpMap = brush;
  edge.bumpScale = 0.0012;

  hex(root, 6.7, 4.3, 0.28, [0, 0.2, 0], graphite, 0.055);
  hex(root, 6.5, 4.12, 0.065, [0, 0.407, 0], steel, 0.025);
  hex(root, 6.38, 4, 0.04, [0, 0.475, 0], black, 0.018);

  const boundary = [[-3.13, 0], [-1.78, -1.97], [1.78, -1.97], [3.13, 0], [1.78, 1.97], [-1.78, 1.97]];
  boundary.forEach(([x, z], index) => {
    const [nx, nz] = boundary[(index + 1) % boundary.length];
    line(root, [x, 0.523, z], [nx, 0.523, nz], 0.024, edge);
    line(root, [x * 0.985, 0.54, z * 0.985], [nx * 0.985, 0.54, nz * 0.985], 0.009, blue);
    box(root, [0.105, 0.23, 0.105], [x, 0.61, z], graphite, 0.025);
    screw(root, x, 0.735, z);
  });
  [[-2.15, -1.27], [2.15, -1.27], [-2.15, 1.27], [2.15, 1.27]].forEach(([x, z]) => {
    box(root, [0.67, 0.11, 0.55], [x, 0.06, z], black, 0.045);
  });

  const assets = [];
  const assetSpecs = [
    { name: 'WEB', x: -2.27, z: 0.44, w: 0.75, h: 0.72, d: 0.83 },
    { name: 'API', x: -1.93, z: -1.18, w: 0.6, h: 0.43, d: 0.5 },
    { name: 'DATA', x: 1.96, z: -1.1, w: 0.68, h: 0.67, d: 0.6 },
  ];
  assetSpecs.forEach((spec, index) => {
    const asset = new THREE.Group();
    asset.position.set(spec.x, 0.51, spec.z);
    root.add(asset);
    box(asset, [spec.w, spec.h, spec.d], [0, spec.h / 2, 0], graphite, 0.055);
    box(asset, [spec.w * 0.84, 0.035, spec.d * 0.84], [0, spec.h + 0.032, 0], steel, 0.015);
    box(asset, [spec.w * 0.7, 0.026, spec.d * 0.7], [0, spec.h + 0.069, 0], glass, 0.012, false);
    label(asset, spec.name, [0, spec.h * 0.67, spec.d / 2 + 0.008], spec.w * 0.85, spec.h * 0.32);
    for (let vent = 0; vent < (compact ? 3 : 4); vent++) box(asset, [spec.w * 0.5, 0.012, 0.018], [0, 0.1 + vent * 0.055, spec.d / 2 + 0.012], steel, 0.003, false);
    box(asset, [0.025, 0.055, 0.018], [spec.w * 0.35, spec.h * 0.7, spec.d / 2 + 0.015], blue, 0.005, false);
    line(root, [spec.x, 0.53, spec.z], [spec.x * 0.44, 0.53, spec.z * 0.44], 0.017, blue);
    assets.push({ group: asset, x: spec.x, index });
  });

  const core = new THREE.Group();
  core.position.z = -0.15;
  root.add(core);
  hex(core, 2.55, 2.04, 0.16, [0, 0.62, 0], graphite, 0.04);
  const layers = [];
  for (let index = 0; index < 3; index++) {
    const layer = new THREE.Group();
    layer.position.y = 0.82 + index * 0.3;
    core.add(layer);
    hex(layer, 2.32, 1.86, 0.17, [0, 0, 0], index === 1 ? steel : graphite, 0.03);
    hex(layer, 2.4, 1.93, 0.024, [0, -0.072, 0], edge, 0.008);
    hex(layer, 2.17, 1.73, 0.018, [0, 0.12, 0], blue, 0.008, false);
    hex(layer, 1.99, 1.58, 0.022, [0, 0.141, 0], black, 0.008, false);
    [[-0.58, -0.57], [0.58, -0.57], [-0.58, 0.57], [0.58, 0.57]].forEach(([x, z]) => screw(layer, x, 0.16, z));
    layers.push(layer);
  }
  const lid = new THREE.Group();
  lid.position.y = 1.72;
  core.add(lid);
  hex(lid, 2.55, 2.04, 0.16, [0, 0, 0], steel, 0.035);
  hex(lid, 2.59, 2.08, 0.036, [0, -0.061, 0], edge, 0.012);
  hex(lid, 2.32, 1.85, 0.035, [0, 0.13, 0], graphite, 0.014);
  hex(lid, 1.77, 1.41, 0.027, [0, 0.17, 0], glass, 0.012, false);
  label(lid, 'CORE', [0, 0.008, 1.055], 1.05, 0.19);
  [[-0.66, -0.65], [0.66, -0.65], [-0.66, 0.65], [0.66, 0.65]].forEach(([x, z]) => screw(lid, x, 0.158, z));
  for (let index = 0; index < (compact ? 3 : 5); index++) {
    const x = -0.44 + index * (compact ? 0.44 : 0.22);
    box(lid, [0.11, 0.007, 0.027], [x, 0.155, 0.76], black, 0.004, false);
  }

  // A machined optical gantry: the head follows a physical linear guide.
  [-1.62, 1.62].forEach(x => {
    box(root, [0.29, 0.1, 0.48], [x, 0.57, -0.55], black, 0.035);
    box(root, [0.14, 2.9, 0.18], [x, 2.04, -0.55], steel, 0.025);
    box(root, [0.035, 2.64, 0.022], [x, 2.03, -0.445], black, 0.005, false);
  });
  box(root, [3.56, 0.2, 0.28], [0, 3.57, -0.55], graphite, 0.045);
  box(root, [3.32, 0.028, 0.025], [0, 3.59, -0.391], edge, 0.006, false);
  box(root, [3.1, 0.016, 0.018], [0, 3.52, -0.389], blue, 0.004, false);
  const scanner = new THREE.Group();
  scanner.position.set(-1.3, 3.42, -0.48);
  root.add(scanner);
  box(scanner, [0.58, 0.25, 0.48], [0, 0, 0], graphite, 0.045);
  box(scanner, [0.31, 0.07, 0.64], [0, 0.13, -0.06], steel, 0.025);
  cylinder(scanner, 0.19, 0.17, [0, -0.21, 0.32], steel);
  cylinder(scanner, 0.145, 0.018, [0, -0.307, 0.32], blue, compact ? 12 : 24, false);
  cylinder(scanner, 0.115, 0.022, [0, -0.323, 0.32], glass, compact ? 12 : 24, false);
  const beamMaterial = own(new THREE.MeshBasicMaterial({ color: '#6ab2ff', transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  const beam = box(root, [0.015, 1, 0.68], [0, 1.9, -0.16], beamMaterial, 0.002, false);
  const beamCross = box(root, [0.4, 1, 0.012], [0, 1.9, -0.16], beamMaterial, 0.002, false);

  const evidence = new THREE.Group();
  root.add(evidence);
  box(evidence, [1.08, 0.15, 0.78], [0, 0, 0], steel, 0.045);
  box(evidence, [0.89, 0.036, 0.59], [0, 0.11, 0], black, 0.02, false);
  box(evidence, [0.61, 0.065, 0.39], [-0.05, 0.16, 0], glass, 0.025, false);
  line(evidence, [-0.3, 0.205, 0.1], [0.18, 0.205, -0.13], 0.017, blue);
  const defect = box(evidence, [0.2, 0.2, 0.2], [0.38, 0.25, 0.2], coral, 0.025);
  defect.rotation.y = Math.PI / 4;
  const guides = [
    box(root, [0.045, 1, 0.045], [-0.24, 0.85, 0.6], edge, 0.009),
    box(root, [0.045, 1, 0.045], [0.48, 0.85, 0.6], edge, 0.009),
  ];
  const guideStart = new THREE.Vector3();
  const guideEnd = new THREE.Vector3();
  const guideDirection = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  // A real hinged report dock, not a floating paper plane.
  box(root, [1.46, 0.12, 1.55], [2, 0.56, 0.76], graphite, 0.06);
  const report = new THREE.Group();
  report.position.set(2, 0.65, 1.46);
  root.add(report);
  box(report, [1.34, 0.08, 1.39], [0, 0, -0.675], steel, 0.035);
  const reportTex = makeTexture(compact ? 480 : 640, compact ? 600 : 800, (ctx, w, h) => {
    ctx.fillStyle = '#a6b7c4'; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#7d94a6'; ctx.lineWidth = 1.3;
    for (let x = 30; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 30; y < h; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    ctx.strokeStyle = '#263d53'; ctx.lineWidth = 3; ctx.strokeRect(w * 0.045, h * 0.045, w * 0.91, h * 0.91);
    ctx.fillStyle = '#10263a'; ctx.font = `700 ${Math.round(w * 0.082)}px monospace`; ctx.fillText('EVIDENCIA', w * 0.1, h * 0.13);
    ctx.fillStyle = '#314c65';
    [0.22, 0.26, 0.3].forEach((y, index) => ctx.fillRect(w * 0.1, h * y, w * (0.72 - index * 0.13), h * 0.011));
    ctx.strokeStyle = '#174fbf'; ctx.lineWidth = w * 0.018;
    ctx.beginPath(); ctx.moveTo(w * 0.18, h * 0.47); ctx.lineTo(w * 0.42, h * 0.47); ctx.lineTo(w * 0.58, h * 0.58); ctx.lineTo(w * 0.81, h * 0.58); ctx.stroke();
    ctx.fillStyle = '#2563eb'; ctx.fillRect(w * 0.11, h * 0.42, w * 0.14, h * 0.1);
    ctx.fillStyle = '#d76b55'; ctx.fillRect(w * 0.51, h * 0.53, w * 0.15, h * 0.1);
    ctx.strokeStyle = '#607489'; ctx.lineWidth = 1.5; ctx.strokeRect(w * 0.74, h * 0.53, w * 0.14, h * 0.1);
    for (let index = 0; index < 6; index++) ctx.fillStyle = '#405a70', ctx.fillRect(w * 0.1, h * (0.73 + index * 0.03), w * (index % 2 ? 0.58 : 0.76), h * 0.009);
  });
  const reportSurface = add(report, geometry('report-surface', () => new THREE.PlaneGeometry(1.18, 1.23)),
    own(new THREE.MeshStandardMaterial({ map: reportTex, color: '#b5c0cb', metalness: 0.02, roughness: 0.9 })), [0, 0.051, -0.675], false);
  reportSurface.rotation.x = -Math.PI / 2;
  line(report, [-0.4, 0.068, -0.73], [-0.14, 0.068, -0.73], 0.012, blue);
  line(report, [-0.14, 0.068, -0.73], [0.11, 0.068, -0.57], 0.012, blue);
  line(report, [0.11, 0.068, -0.57], [0.42, 0.068, -0.57], 0.012, blue);
  box(report, [0.12, 0.014, 0.1], [0.11, 0.073, -0.57], coral, 0.008, false);
  box(report, [0.43, 0.035, 0.11], [0, 0.072, -1.255], graphite, 0.018);

  const seal = new THREE.Group();
  seal.position.set(0, 3.09, -0.15);
  root.add(seal);
  hex(seal, 1.02, 0.84, 0.1, [0, 0, 0], edge, 0.02);
  hex(seal, 0.86, 0.7, 0.034, [0, 0.075, 0], blue, 0.012, false);
  hex(seal, 0.71, 0.58, 0.018, [0, 0.111, 0], green, 0.008, false);
  const check = own(new THREE.MeshStandardMaterial({ color: '#e5fff7', metalness: 0.2, roughness: 0.3 }));
  line(seal, [-0.17, 0.14, 0], [-0.045, 0.14, 0.115], 0.035, check);
  line(seal, [-0.045, 0.14, 0.115], [0.19, 0.14, -0.15], 0.035, check);

  const pose = sampleProcessPose(0);
  const nextPose = sampleProcessPose(0);
  const keys = Object.keys(pose);
  const updateMechanism = () => {
    const detail = compact ? 0.85 : 1;
    for (let index = 0; index < layers.length; index++) {
      const layer = layers[index];
      const direction = index % 2 ? 1 : -1;
      layer.position.set(direction * pose.open * 0.21, 0.82 + index * 0.3 + pose.open * index * 0.26, direction * pose.open * 0.13);
      layer.rotation.y = direction * pose.open * 0.055;
    }
    lid.position.set(-pose.open * 0.12, 1.72 + pose.open * 1.03, -pose.open * 0.08);
    lid.rotation.set(pose.lidPitch, pose.open * 0.035, pose.open * -0.055);
    scanner.position.x = pose.scannerX * (compact ? 0.96 : 1);
    const top = 3.082;
    const bottom = 1.04 + pose.open * 0.27;
    const beamHeight = top - bottom;
    beam.position.set(scanner.position.x, (top + bottom) / 2, -0.16);
    beamCross.position.copy(beam.position);
    beam.scale.y = beamCross.scale.y = beamHeight;
    beamMaterial.opacity = pose.scan * 0.085;
    evidence.position.set(0.12 + pose.evidence * 0.4, 0.97 + pose.evidence * 0.36, 0.55 + pose.evidence * 1.35);
    evidence.rotation.y = pose.evidence * 0.12;
    for (let index = 0; index < guides.length; index++) {
      const offset = index ? 0.36 : -0.36;
      guideStart.set(0.12 + offset, 0.87, 0.55);
      guideEnd.set(evidence.position.x + offset, evidence.position.y - 0.1, evidence.position.z - 0.2);
      guideDirection.copy(guideEnd).sub(guideStart);
      const length = Math.max(0.001, guideDirection.length());
      const guide = guides[index];
      guide.position.copy(guideStart).add(guideEnd).multiplyScalar(0.5);
      guide.scale.y = length;
      guide.quaternion.setFromUnitVectors(up, guideDirection.divideScalar(length));
    }
    defect.scale.setScalar(Math.max(0.001, pose.defect));
    report.rotation.x = pose.report * 1.08;
    for (let index = 0; index < assets.length; index++) {
      const asset = assets[index];
      asset.group.position.x = asset.x + Math.sign(asset.x) * pose.focus * (index === 0 ? 0.06 : 0.045) * detail;
    }
    seal.scale.setScalar(Math.max(0.001, pose.seal));
    seal.position.y = 3.57 - pose.seat * 1.57;
    blue.emissiveIntensity = 0.58 + pose.seal * 0.22;
    glass.opacity = 0.31 + pose.open * 0.055;
  };
  const update = (progress, _time, _delta, _moving) => {
    sampleProcessPose(progress, nextPose);
    let changed = false;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (key !== 'progress' && Math.abs(nextPose[key] - pose[key]) > 1e-6) changed = true;
      pose[key] = nextPose[key];
    }
    root.rotation.y = pose.yaw * (compact ? 0.85 : 1);
    updateMechanism();
    return changed;
  };

  return {
    root,
    update,
    dispose() {
      geometries.forEach(item => item.dispose());
      materials.forEach(item => item.dispose());
      textures.forEach(item => item.dispose());
    },
  };
}
