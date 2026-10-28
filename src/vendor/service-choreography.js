export const SERVICE_CYCLE_SECONDS = Object.freeze({ pentest: 10, bounty: 12, label: 12 });
export const SERVICE_KINDS = Object.freeze(['pentest', 'bounty', 'label']);

const tau = Math.PI * 2;
const clamp = value => Math.max(0, Math.min(1, Number.isFinite(Number(value)) ? Number(value) : 0));
const wrap = value => ((value % 1) + 1) % 1;
const smooth = value => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * t * (t * (t * 6 - 15) + 10);
};
function envelope(phase, start, rise, fall, end) {
  if (phase <= start || phase >= end) return 0;
  if (phase < rise) return smooth((phase - start) / (rise - start));
  if (phase <= fall) return 1;
  return 1 - smooth((phase - fall) / (end - fall));
}

/** Stateless periodic mechanics. All output channels have a smooth loop seam. */
export function sampleServicePose(kind, progress, time, moving = true, out = {}) {
  const type = SERVICE_CYCLE_SECONDS[kind] ? kind : 'pentest';
  const p = clamp(progress);
  const seconds = Number.isFinite(Number(time)) ? Number(time) : 0;
  const stillPhase = type === 'pentest' ? 0.36 : type === 'bounty' ? 0.35 : 0.5;
  const phase = moving ? wrap(seconds / SERVICE_CYCLE_SECONDS[type] + p * 0.045) : wrap(stillPhase + p * 0.04);
  const angle = phase * tau;
  out.progress = p;
  out.cycleSin = Math.sin(angle);
  out.cycleCos = Math.cos(angle);
  out.open = 0;
  out.probeX = 0;
  out.defect = 0;
  out.scan = 0;
  out.cartridgeX = 0;
  out.cartridgeZ = 0;
  out.headingX = 0;
  out.headingZ = 1;
  out.accepted = 0;
  out.gateOpen = 0;
  out.sleeveAX = 0;
  out.sleeveAY = 0;
  out.sleeveAZ = 0;
  out.sleeveBX = 0;
  out.sleeveBY = 0;
  out.sleeveBZ = 0;
  out.sleeveTilt = 0;
  out.yaw = (p - 0.5) * 0.035;
  if (type === 'pentest') {
    out.open = envelope(phase, 0.06, 0.25, 0.64, 0.91);
    out.probeX = -1.1 * Math.cos(angle);
    out.defect = envelope(phase, 0.2, 0.34, 0.56, 0.75);
    out.scan = out.open;
  } else if (type === 'bounty') {
    const theta = Math.PI - angle;
    const dx = 1.6 * Math.sin(theta);
    const dz = -0.72 * Math.cos(theta);
    const length = Math.hypot(dx, dz);
    out.cartridgeX = 1.6 * Math.cos(theta);
    out.cartridgeZ = 0.72 * Math.sin(theta) - 0.15;
    out.headingX = dx / length;
    out.headingZ = dz / length;
    out.gateOpen = envelope(phase, 0.12, 0.21, 0.34, 0.43);
    out.scan = envelope(phase, 0.18, 0.235, 0.29, 0.35);
    out.accepted = envelope(phase, 0.27, 0.34, 0.61, 0.77);
  } else {
    const exchange = 0.5 - 0.5 * Math.cos(angle);
    const lift = Math.sin(angle) ** 2;
    out.sleeveAX = -0.13 * Math.sin(angle);
    out.sleeveAY = 0.98 + exchange * 0.42 + lift * 0.65;
    out.sleeveAZ = -0.62 + exchange * 1.47;
    out.sleeveBX = 0.13 * Math.sin(angle);
    out.sleeveBY = 1.4 - exchange * 0.42;
    out.sleeveBZ = 0.85 - exchange * 1.47;
    out.sleeveTilt = lift * 0.045;
  }
  return out;
}
