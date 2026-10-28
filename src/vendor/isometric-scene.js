import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { sampleSecurityPose } from './security-choreography';

const BLUE = new THREE.Color('#2563eb');
const CORAL = new THREE.Color('#ed725a');

/** Original procedural geometry. No external models or textures. */
export function createSecurityComposition(variant = 'architecture', compact = false) {
  const root = new THREE.Group();
  const geometries = new Map();
  const materials = new Set();
  const textures = new Set();
  const looseGeometries = new Set();
  const own = material => { materials.add(material); return material; };
  const geometry = (w, h, d, r = 0.06) => {
    const key = `${w}/${h}/${d}/${r}`;
    if (!geometries.has(key)) geometries.set(key, new RoundedBoxGeometry(w, h, d, compact ? 2 : 3, Math.min(r, w / 4, h / 4, d / 4)));
    return geometries.get(key);
  };
  const aluminium = own(new THREE.MeshStandardMaterial({ color: '#b7c0c9', metalness: 0.87, roughness: 0.26 }));
  const graphite = own(new THREE.MeshStandardMaterial({ color: '#242b34', metalness: 0.6, roughness: 0.3 }));
  const black = own(new THREE.MeshStandardMaterial({ color: '#101720', metalness: 0.32, roughness: 0.36 }));
  const paper = own(new THREE.MeshStandardMaterial({ color: '#e1e2df', metalness: 0.22, roughness: 0.38 }));
  const blue = own(new THREE.MeshStandardMaterial({ color: BLUE, emissive: BLUE, emissiveIntensity: 0.5, metalness: 0.36, roughness: 0.23 }));
  const risk = own(new THREE.MeshStandardMaterial({ color: CORAL, emissive: CORAL, emissiveIntensity: 0.34, metalness: 0.36, roughness: 0.28 }));
  const white = own(new THREE.MeshBasicMaterial({ color: '#eaf1ff' }));
  const glass = own(new THREE.MeshPhysicalMaterial({
    color: '#bdd2e9', metalness: 0.1, roughness: 0.16, transparent: true,
    opacity: 0.2, clearcoat: 1, clearcoatRoughness: 0.1,
    depthWrite: false, side: THREE.DoubleSide,
  }));

  const box = (parent, dims, position, material = graphite, radius = 0.06, shadow = true) => {
    const mesh = new THREE.Mesh(geometry(...dims, radius), material);
    mesh.position.set(...position);
    mesh.castShadow = shadow;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const tube = (parent, points, radius, material, closed = false) => {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), closed, 'centripetal');
    const geo = new THREE.TubeGeometry(curve, compact ? 40 : 64, radius, compact ? 5 : 7, closed);
    looseGeometries.add(geo);
    const mesh = new THREE.Mesh(geo, material);
    parent.add(mesh);
    return { curve, mesh };
  };
  const texture = draw => {
    const canvas = document.createElement('canvas');
    canvas.width = 768;
    canvas.height = 384;
    const context = canvas.getContext('2d');
    draw(context, canvas.width, canvas.height);
    const result = new THREE.CanvasTexture(canvas);
    result.colorSpace = THREE.SRGBColorSpace;
    result.anisotropy = 4;
    textures.add(result);
    return result;
  };
  const label = (parent, text, position, width, height, dark = true, horizontal = false) => {
    const tex = texture((ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = dark ? '#b9c5d5' : '#314052';
      ctx.font = '600 106px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, w / 2, h / 2);
    });
    const mat = own(new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false }));
    const geo = new THREE.PlaneGeometry(width, height);
    looseGeometries.add(geo);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(...position);
    if (horizontal) mesh.rotation.x = -Math.PI / 2;
    parent.add(mesh);
    return mesh;
  };

  const pose = sampleSecurityPose(0);
  const nextPose = sampleSecurityPose(0);
  const poseKeys = Object.keys(pose);
  const inspectionScale = compact ? 0.72 : 1;
  const flows = [];
  let updateComposition;

  if (variant === 'evidence') {
    const report = new THREE.Group();
    report.rotation.y = -0.12;
    root.add(report);
    box(report, [5.2, 0.3, 4.1], [0, 0.16, 0], graphite, 0.15);
    box(report, [4.86, 0.1, 3.78], [0, 0.38, 0], aluminium, 0.08);
    const sheet = new THREE.Group();
    report.add(sheet);
    box(sheet, [4.52, 0.12, 3.5], [0, 0.51, 0], paper, 0.09);
    label(sheet, 'EVIDENCIA', [0, 0.578, -1.09], 3.45, 0.62, false, true);
    box(sheet, [3.5, 0.014, 0.025], [0, 0.582, -0.63], graphite, 0.005, false);
    const severity = new THREE.Group();
    sheet.add(severity);
    const severityBars = [];
    for (let i = 0; i < 3; i++) {
      const stack = new THREE.Group();
      stack.position.set(-1.17 + i * 1.17, 0.59, 0.25);
      severity.add(stack);
      box(stack, [0.88, 0.11, 1.2], [0, 0.055, 0], aluminium, 0.035);
      const bar = box(stack, [0.66, 0.17 + i * 0.2, 0.78], [0, 0.2 + i * 0.1, 0], i === 2 ? risk : blue, 0.04);
      severityBars.push(bar);
      box(stack, [0.5, 0.018, 0.045], [0, 0.13, 0.45], black, 0.008, false);
    }
    const proof = new THREE.Group();
    proof.position.set(1.5, 0.75, 1.1);
    sheet.add(proof);
    box(proof, [1.05, 0.14, 0.75], [0, 0, 0], graphite, 0.06);
    box(proof, [0.8, 0.055, 0.49], [0, 0.095, 0], glass, 0.03, false);
    tube(proof, [[-0.24, 0.14, 0], [-0.06, 0.14, 0.16], [0.28, 0.14, -0.2]], 0.024, blue);
    updateComposition = () => {
      sheet.position.y = pose.explode * 0.55;
      sheet.rotation.y = pose.focus * 0.045;
      severityBars.forEach((bar, i) => { bar.scale.y = 1 + pose.risk * (i === 2 ? 0.55 : 0.12); });
      proof.position.y = 0.75 + pose.proof * 0.7;
      proof.rotation.y = pose.proof * -0.2;
      report.rotation.y = -0.12 + pose.focus * 0.1;
      blue.emissiveIntensity = 0.45 + pose.secured * 0.3;
    };
  } else {
    box(root, [8.1, 0.3, 5.05], [0, 0.16, 0], graphite, 0.14);
    box(root, [7.88, 0.065, 4.83], [0, 0.34, 0], aluminium, 0.11);
    box(root, [7.75, 0.035, 4.7], [0, 0.39, 0], graphite, 0.1);
    // Four machined feet lift the board just enough to make its contact shadow.
    [[-3.1, -1.65], [3.1, -1.65], [-3.1, 1.65], [3.1, 1.65]].forEach(([x, z]) => box(root, [0.72, 0.13, 0.65], [x, -0.02, z], black, 0.08));

    const web = new THREE.Group();
    web.position.set(-2.32, 0.13, 0.6);
    root.add(web);
    box(web, [1.05, 0.1, 0.73], [0, 0.4, 0], aluminium, 0.05);
    box(web, [0.21, 0.56, 0.21], [0, 0.69, -0.05], aluminium, 0.04);
    const screen = new THREE.Group();
    screen.position.set(0, 1.35, 0);
    screen.rotation.x = -0.12;
    web.add(screen);
    box(screen, [2.03, 1.35, 0.16], [0, 0, 0], aluminium, 0.065);
    box(screen, [1.93, 1.25, 0.035], [0, 0, 0.092], black, 0.04, false);
    const screenTexture = texture((ctx, w, h) => {
      ctx.fillStyle = '#121b28'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#203046'; ctx.fillRect(0, 0, w, 52);
      [28, 52, 76].forEach(x => { ctx.beginPath(); ctx.arc(x, 26, 5, 0, Math.PI * 2); ctx.fillStyle = '#647791'; ctx.fill(); });
      ctx.fillStyle = '#d3deed'; ctx.font = '600 44px Inter,sans-serif'; ctx.fillText('WEB', 49, 124);
      ctx.fillStyle = '#69809f'; ctx.fillRect(50, 152, 315, 9); ctx.fillRect(50, 176, 230, 9);
      ctx.fillStyle = '#1c2b40'; ctx.fillRect(50, 218, 195, 106); ctx.fillRect(269, 218, 195, 106);
      ctx.fillStyle = '#2563eb'; ctx.fillRect(488, 218, 229, 106);
      ctx.strokeStyle = '#a7c7ff'; ctx.lineWidth = 5; ctx.strokeRect(565, 240, 70, 53);
      ctx.beginPath(); ctx.arc(600, 260, 12, 0, Math.PI * 2); ctx.stroke();
    });
    const screenGeo = new THREE.PlaneGeometry(1.81, 1.08);
    looseGeometries.add(screenGeo);
    const screenFace = new THREE.Mesh(screenGeo, own(new THREE.MeshBasicMaterial({ map: screenTexture, toneMapped: false })));
    screenFace.position.z = 0.114;
    screen.add(screenFace);

    const api = new THREE.Group();
    api.position.set(0, 0, -0.16);
    root.add(api);
    const apiLayers = [];
    for (let i = 0; i < 3; i++) {
      const layer = new THREE.Group();
      layer.position.y = 0.57 + i * 0.32;
      api.add(layer);
      box(layer, [1.5, 0.24, 1.36], [0, 0, 0], i === 1 ? aluminium : graphite, 0.06);
      box(layer, [1.25, 0.025, 1.1], [0, 0.137, 0], black, 0.015, false);
      box(layer, [0.82, 0.035, 0.018], [0, 0.025, 0.693], blue, 0.006, false);
      apiLayers.push(layer);
    }
    const apiLid = new THREE.Group();
    apiLid.position.y = 1.49;
    api.add(apiLid);
    box(apiLid, [1.59, 0.13, 1.45], [0, 0, 0], aluminium, 0.05);
    box(apiLid, [1.3, 0.027, 1.15], [0, 0.085, 0], glass, 0.03, false);
    label(apiLayers[1], 'API', [0, 0.04, 0.705], 1.04, 0.41, false);

    const data = new THREE.Group();
    data.position.set(2.28, 0, -0.68);
    root.add(data);
    box(data, [1.45, 2.27, 1.38], [0, 1.52, 0], graphite, 0.08);
    box(data, [1.27, 0.065, 1.19], [0, 2.69, 0], aluminium, 0.035);
    box(data, [1.12, 0.025, 1.02], [0, 2.74, 0], glass, 0.025, false);
    const dataRows = [];
    for (let row = 0; row < 3; row++) {
      const y = 0.78 + row * 0.58;
      const drawer = new THREE.Group();
      drawer.position.y = y;
      data.add(drawer);
      dataRows.push(drawer);
      box(drawer, [1.28, 0.49, 0.065], [0, 0, 0.715], black, 0.035, false);
      box(drawer, [0.045, 0.25, 0.025], [-0.48, 0, 0.763], blue, 0.008, false);
      for (let vent = 0; vent < 4; vent++) box(drawer, [0.48, 0.018, 0.025], [0.04, -0.11 + vent * 0.075, 0.766], aluminium, 0.004, false);
      box(drawer, [0.045, 0.045, 0.025], [0.48, 0.11, 0.767], blue, 0.01, false);
    }
    label(data, 'DATOS', [0, 2.47, 0.716], 1.15, 0.32);

    const routes = [
      [[-2.32, 0.44, 0.93], [-1.74, 0.44, 0.93], [-1.36, 0.44, 0.67], [-1.04, 0.44, 0.23], [0, 0.44, 0.23]],
      [[0, 0.44, -0.37], [0.77, 0.44, -0.37], [1.24, 0.44, -0.76], [2.27, 0.44, -0.76]],
      [[0, 0.44, 2.23], [0, 0.44, 1.46], [0.18, 0.44, 1.08], [0.18, 0.44, 0.53]],
    ];
    routes.forEach((points, index) => {
      tube(root, points, 0.052, black);
      const route = tube(root, points.map(([x, y, z]) => [x, y + 0.014, z]), 0.019, index === 2 ? risk : blue);
      const packet = box(root, [0.095, 0.045, 0.095], [0, 0, 0], index === 2 ? risk : blue, 0.012, false);
      flows.push({ curve: route.curve, packet, index });
    });

    // A deliberately open front gate makes the permitted route legible.
    const perimeterPoints = [[-3.56, 0.55, 1.94], [-3.82, 0.55, 1.53], [-3.82, 0.55, -1.6], [-3.43, 0.55, -2.14], [3.41, 0.55, -2.14], [3.83, 0.55, -1.66], [3.83, 0.55, 1.58], [3.48, 0.55, 1.96]];
    tube(root, perimeterPoints, 0.032, aluminium);
    tube(root, perimeterPoints.map(([x, y, z]) => [x, y + 0.016, z]), 0.009, blue);
    [-3.45, 3.45].forEach(x => box(root, [0.075, 0.8, 0.075], [x, 0.84, -2.1], aluminium, 0.015));
    box(root, [6.85, 0.78, 0.035], [0, 0.9, -2.1], glass, 0.009, false);
    [-2.18, 2.18].forEach(x => box(root, [2.25, 0.43, 0.035], [x, 0.74, 2.03], glass, 0.009, false));
    [-0.69, 0.69].forEach(x => {
      box(root, [0.12, 0.91, 0.16], [x, 0.91, 2.04], graphite, 0.025);
      box(root, [0.025, 0.73, 0.022], [x, 0.92, 2.135], blue, 0.006, false);
    });
    box(root, [1.48, 0.13, 0.18], [0, 1.42, 2.04], aluminium, 0.03);
    const gate = new THREE.Group();
    gate.position.set(-0.59, 0.93, 2.04);
    root.add(gate);
    box(gate, [1.16, 0.76, 0.035], [0.58, 0, 0], glass, 0.008, false);
    box(gate, [0.025, 0.69, 0.028], [1.1, 0, 0.026], blue, 0.006, false);

    const proof = new THREE.Group();
    api.add(proof);
    box(proof, [0.93, 0.16, 0.78], [0, 0, 0], aluminium, 0.045);
    box(proof, [0.73, 0.035, 0.57], [0, 0.1, 0], black, 0.025, false);
    box(proof, [0.55, 0.06, 0.37], [0, 0.15, 0], glass, 0.02, false);
    label(proof, 'PROOF', [0, 0.19, 0.025], 0.65, 0.27, true, true);
    const finding = box(proof, [0.19, 0.19, 0.19], [0.34, 0.27, 0.25], risk, 0.025);
    finding.rotation.y = Math.PI / 4;
    const verified = new THREE.Group();
    verified.position.set(0.84, 1.26, 0.72);
    api.add(verified);
    box(verified, [0.4, 0.4, 0.08], [0, 0, 0], blue, 0.06);
    tube(verified, [[-0.11, 0.01, 0.052], [-0.025, -0.075, 0.052], [0.13, 0.10, 0.052]], 0.017, white);

    updateComposition = () => {
      web.position.x = -2.32 - pose.focus * 0.22 * inspectionScale;
      web.scale.setScalar(1 - pose.focus * 0.055);
      screen.rotation.x = -0.12 + pose.webTilt * inspectionScale;
      screen.rotation.y = pose.focus * 0.025 * inspectionScale;
      data.position.x = 2.28 + pose.focus * 0.18 * inspectionScale;
      data.scale.setScalar(1 - pose.focus * 0.045);
      dataRows.forEach((drawer, index) => {
        drawer.position.z = pose.dataInspect * (index === 1 ? 0.1 : 0.025) * inspectionScale;
      });
      apiLayers.forEach((layer, i) => { layer.position.y = 0.57 + i * 0.32 + pose.explode * i * 0.18; });
      apiLid.position.y = 1.49 + pose.explode * 0.9;
      apiLid.rotation.z = pose.explode * -0.06;
      proof.position.set(-pose.proof * 0.08, 0.87 + pose.proof * 0.28, 0.44 + pose.proof * 0.98);
      proof.rotation.y = pose.proof * 0.08;
      gate.rotation.y = pose.gate;
      finding.scale.setScalar(Math.max(0.001, pose.risk));
      verified.scale.setScalar(Math.max(0.001, pose.secured));
      glass.opacity = 0.17 + pose.secured * 0.085;
      blue.emissiveIntensity = 0.45 + pose.secured * 0.3;
    };
  }

  const sample = new THREE.Vector3();
  const update = (progress, _time, _delta, _moving) => {
    sampleSecurityPose(progress, nextPose);
    let changed = false;
    poseKeys.forEach(key => {
      if (key !== 'progress' && Math.abs(nextPose[key] - pose[key]) > 0.000001) changed = true;
      pose[key] = nextPose[key];
    });
    root.rotation.y = pose.yaw * (compact ? 0.65 : 1);
    risk.color.copy(BLUE).lerp(CORAL, pose.risk);
    risk.emissive.copy(risk.color);
    updateComposition();
    flows.forEach(({ curve, packet, index }) => {
      // Traverse each route with scroll, never a wall-clock loop or modulo jump.
      // This keeps both endpoint frames still and makes reversal deterministic.
      const routeProgress = index === 2
        ? 0.08 + pose.risk * 0.65 + pose.secured * 0.19
        : 0.06 + pose.progress * 0.86;
      curve.getPointAt(routeProgress, sample);
      packet.position.copy(sample);
      packet.position.y += 0.025;
      packet.scale.setScalar(index === 2 ? 0.7 + pose.risk * 0.6 : 1);
    });
    return changed;
  };

  return {
    root,
    update,
    dispose() {
      geometries.forEach(item => item.dispose());
      looseGeometries.forEach(item => item.dispose());
      materials.forEach(item => item.dispose());
      textures.forEach(item => item.dispose());
    },
  };
}
