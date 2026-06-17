import { AXES, BASELINE, C } from '../data'

export default function RadarChart({ axisScores }) {
  const cx = 180, cy = 130, r = 75, MAX = 20

  const DIR = [
    { axis: "A", dx:  0, dy: -1 },
    { axis: "B", dx:  1, dy:  0 },
    { axis: "C", dx:  0, dy:  1 },
    { axis: "D", dx: -1, dy:  0 },
  ]

  const pt = (dx, dy, score, max) => [cx + dx * r * (score / max), cy + dy * r * (score / max)]
  const toPoly = pts => pts.map(p => p.join(",")).join(" ")
  const toPath = pts => pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ") + "Z"

  const userPts = DIR.map(d => pt(d.dx, d.dy, axisScores[d.axis], MAX))
  const basePts = DIR.map(d => pt(d.dx, d.dy, BASELINE[d.axis], MAX))

  const LABEL_POS = [
    { axis: "A", x: cx,          y: cy - r - 24, anchor: "middle" },
    { axis: "B", x: cx + r + 24, y: cy,          anchor: "start"  },
    { axis: "C", x: cx,          y: cy + r + 24, anchor: "middle" },
    { axis: "D", x: cx - r - 24, y: cy,          anchor: "end"    },
  ]

  return (
    <svg viewBox="0 0 360 260" width="100%" style={{ maxWidth: 320, display: "block", margin: "0 auto" }}>
      {[0.25, 0.5, 0.75, 1.0].map(lv => (
        <polygon key={lv}
          points={toPoly(DIR.map(d => pt(d.dx, d.dy, MAX * lv, MAX)))}
          fill="none" stroke={C.border} strokeWidth="1" />
      ))}
      {DIR.map(d => {
        const [x2, y2] = pt(d.dx, d.dy, MAX, MAX)
        return <line key={d.axis} x1={cx} y1={cy} x2={x2} y2={y2} stroke={C.border} strokeWidth="1" />
      })}
      <path d={toPath(basePts)} fill={C.accentSoft + "18"} stroke={C.accentSoft}
        strokeWidth="1.5" strokeDasharray="4 3" />
      <path d={toPath(userPts)} fill={C.accent + "28"} stroke={C.accent} strokeWidth="2" />
      {userPts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4.5" fill={C.accent} />
      ))}
      {LABEL_POS.map(l => {
        const ax = AXES.find(a => a.id === l.axis)
        return (
          <text key={l.axis} x={l.x} y={l.y}
            textAnchor={l.anchor} dominantBaseline="middle"
            style={{ fontSize: 11, fill: C.textSub, fontFamily: "'Noto Sans JP', sans-serif" }}>
            {ax.short}
          </text>
        )
      })}
    </svg>
  )
}
