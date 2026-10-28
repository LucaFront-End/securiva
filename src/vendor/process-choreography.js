export const PROCESS_PHASES = Object.freeze([0, 0.3, 0.64, 1]);

const channels = {
  open: [[0, 0], [0.1, 0.18], [0.3, 0.94], [0.48, 1], [0.64, 0.93], [0.78, 0.4], [0.9, 0.07], [1, 0]],
  lidPitch: [[0, 0], [0.15, 0.04], [0.3, 0.14], [0.48, 0.18], [0.64, 0.38], [0.78, 0.22], [0.92, 0.025], [1, 0]],
  scannerX: [[0, -1.3], [0.12, -0.85], [0.3, 0.2], [0.48, 1.3], [0.64, 1.3], [0.74, 1.2], [0.9, -0.6], [1, -1.3]],
  scan: [[0, 0], [0.12, 0.7], [0.3, 1], [0.48, 0.3], [0.58, 0], [0.7, 0], [0.83, 0.6], [0.95, 0.2], [1, 0]],
  evidence: [[0, 0], [0.18, 0.03], [0.3, 0.18], [0.5, 0.82], [0.64, 1], [0.74, 0.9], [0.86, 0.28], [0.96, 0.02], [1, 0]],
  report: [[0, 0], [0.24, 0.06], [0.44, 0.64], [0.64, 1], [0.78, 0.68], [0.93, 0.08], [1, 0]],
  defect: [[0, 0], [0.15, 0.2], [0.3, 1], [0.64, 1], [0.78, 0.76], [0.92, 0.06], [1, 0]],
  seal: [[0, 0], [0.72, 0], [0.82, 0.2], [0.93, 0.9], [1, 1]],
  seat: [[0, 0], [0.8, 0], [0.88, 0.3], [0.96, 0.85], [1, 1]],
  focus: [[0, 0], [0.3, 0.25], [0.64, 1], [0.82, 0.38], [1, 0]],
  yaw: [[0, 0], [0.15, -0.075], [0.3, -0.13], [0.47, -0.025], [0.64, 0.14], [0.82, 0.07], [1, 0]],
};

function compile(points) {
  const lengths = [];
  const slopes = [];
  const tangents = points.map(() => 0);
  for (let i = 0; i < points.length - 1; i++) {
    const length = points[i + 1][0] - points[i][0];
    lengths.push(length);
    slopes.push((points[i + 1][1] - points[i][1]) / length);
  }
  for (let i = 1; i < points.length - 1; i++) {
    if (slopes[i - 1] * slopes[i] <= 0) continue;
    const a = 2 * lengths[i] + lengths[i - 1];
    const b = lengths[i] + 2 * lengths[i - 1];
    tangents[i] = (a + b) / (a / slopes[i - 1] + b / slopes[i]);
  }
  return { points, lengths, tangents };
}

const curves = Object.entries(channels).map(([key, points]) => [key, compile(points)]);

function evaluate(curve, progress) {
  const { points, lengths, tangents } = curve;
  if (progress <= 0) return points[0][1];
  if (progress >= 1) return points[points.length - 1][1];
  let i = 0;
  while (i < points.length - 2 && progress > points[i + 1][0]) i++;
  const t = (progress - points[i][0]) / lengths[i];
  const square = t * t;
  const cube = square * t;
  return (2 * cube - 3 * square + 1) * points[i][1]
    + (cube - 2 * square + t) * lengths[i] * tangents[i]
    + (-2 * cube + 3 * square) * points[i + 1][1]
    + (cube - square) * lengths[i] * tangents[i + 1];
}

/** Stateless, C1-continuous mechanical pose. The renderer owns scalar damping. */
export function sampleProcessPose(progress, out = {}) {
  const number = Number(progress);
  const p = Number.isFinite(number) ? Math.max(0, Math.min(1, number)) : 0;
  out.progress = p;
  for (let i = 0; i < curves.length; i++) {
    const entry = curves[i];
    out[entry[0]] = evaluate(entry[1], p);
  }
  return out;
}
