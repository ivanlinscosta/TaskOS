/**
 * Radar icon that inherits the active workspace accent color via CSS variables.
 * Uses style props (not SVG presentation attributes) so CSS custom properties resolve correctly.
 */
export function TaskOSRadarIcon({ size = 36 }: { size?: number }) {
  const cx = 18, cy = 18;

  // Outer ring  r=15.5  circ≈97.4
  const r1 = 15.5;
  const c1 = 2 * Math.PI * r1;
  const arc1Len = c1 * (28 / 360);
  const arc1Offset = -(c1 * (295 / 360));

  // Middle ring  r=10.5  circ≈66
  const r2 = 10.5;
  const c2 = 2 * Math.PI * r2;
  const arc2Len = c2 * (22 / 360);
  const arc2Offset = -(c2 * (305 / 360));

  const accent = 'var(--theme-accent)';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="TaskOS"
    >
      {/* Dark background */}
      <circle cx={cx} cy={cy} r="18" style={{ fill: '#060A07' }} />

      {/* Dim concentric rings */}
      <circle cx={cx} cy={cy} r={r1}  fill="none" style={{ stroke: accent, strokeWidth: 0.7, strokeOpacity: 0.35 }} />
      <circle cx={cx} cy={cy} r={r2}  fill="none" style={{ stroke: accent, strokeWidth: 0.7, strokeOpacity: 0.45 }} />
      <circle cx={cx} cy={cy} r="5.5" fill="none" style={{ stroke: accent, strokeWidth: 0.7, strokeOpacity: 0.55 }} />

      {/* Bright outer arc — top-left quadrant */}
      <circle
        cx={cx} cy={cy} r={r1} fill="none"
        style={{
          stroke: accent,
          strokeWidth: 2.2,
          strokeLinecap: 'round',
          strokeDasharray: `${arc1Len} ${c1}`,
          strokeDashoffset: arc1Offset,
        }}
      />

      {/* Bright middle arc — slightly different angle for depth */}
      <circle
        cx={cx} cy={cy} r={r2} fill="none"
        style={{
          stroke: accent,
          strokeWidth: 1.8,
          strokeLinecap: 'round',
          strokeDasharray: `${arc2Len} ${c2}`,
          strokeDashoffset: arc2Offset,
        }}
      />

      {/* Center dot */}
      <circle cx={cx} cy={cy} r="2.2" style={{ fill: accent }} />
      <circle cx={cx} cy={cy} r="0.9" style={{ fill: 'white', fillOpacity: 0.75 }} />
    </svg>
  );
}
