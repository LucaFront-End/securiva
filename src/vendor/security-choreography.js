/** Scroll landmarks shared by the visual model and its chapter controls. */
export const SECURITY_PHASES = Object.freeze([0, 0.3, 0.64, 1]);

// Individual channels overlap rather than stopping together at four chapters.
// Shape-preserving Hermite tangents keep the mechanical motion C1-continuous
// without overshooting the enclosure or relying on time/history.
const channels = {
  explode: [[0, 0], [0.12, 0.08], [0.3, 0.46], [0.55, 0.9], [0.64, 1], [0.76, 0.88], [0.9, 0.35], [1, 0]],
  proof: [[0, 0], [0.16, 0.015], [0.3, 0.14], [0.48, 0.62], [0.64, 1], [0.73, 0.96], [0.84, 0.52], [0.94, 0.08], [1, 0]],
  focus: [[0, 0], [0.13, 0.03], [0.3, 0.22], [0.64, 1], [0.78, 0.82], [1, 0]],
  risk: [[0, 0], [0.12, 0.08], [0.27, 0.9], [0.3, 1], [0.64, 1], [0.78, 0.76], [0.93, 0.1], [1, 0]],
  secured: [[0, 0], [0.7, 0], [0.84, 0.15], [0.94, 0.72], [1, 1]],
  gate: [[0, -0.22], [0.1, -0.45], [0.3, -1.08], [0.64, -1.1], [0.74, -0.95], [0.88, -0.45], [1, 0]],
  yaw: [[0, 0], [0.18, -0.025], [0.42, -0.045], [0.64, 0.035], [0.82, 0.018], [1, 0]],
  webTilt: [[0, 0], [0.3, -0.025], [0.5, -0.075], [0.64, -0.055], [0.82, -0.02], [1, 0]],
  dataInspect: [[0, 0], [0.18, 0.05], [0.3, 0.7], [0.48, 1], [0.64, 0.65], [0.78, 0.25], [1, 0]],
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
    const previous = slopes[i - 1];
    const next = slopes[i];
    if (previous * next <= 0) continue;
    const firstWeight = 2 * lengths[i] + lengths[i - 1];
    const secondWeight = lengths[i] + 2 * lengths[i - 1];
    tangents[i] = (firstWeight + secondWeight) / (firstWeight / previous + secondWeight / next);
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

/**
 * Pure normalized-scroll sampler. Reuse `out` to avoid allocations per frame.
 * Damping belongs to the renderer; this function always returns the exact pose
 * for its progress, so reversing the scroll follows precisely the same path.
 */
export function sampleSecurityPose(progress, out = {}) {
  const numeric = Number(progress);
  const value = Number.isFinite(numeric) ? Math.max(0, Math.min(1, numeric)) : 0;
  out.progress = value;
  for (let i = 0; i < curves.length; i++) {
    const [key, curve] = curves[i];
    out[key] = evaluate(curve, value);
  }
  return out;
}
