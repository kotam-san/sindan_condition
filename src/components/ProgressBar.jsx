import { C } from '../data'

export default function ProgressBar({ current, total }) {
  return (
    <div style={{ padding: "14px 20px 6px" }}>
      <div style={{ height: 5, background: C.border, borderRadius: 3 }}>
        <div style={{
          height: "100%",
          width: `${(current / total) * 100}%`,
          borderRadius: 3,
          background: `linear-gradient(90deg, ${C.accentSoft}, ${C.accent})`,
          transition: "width 0.4s ease",
        }} />
      </div>
      <p style={{ fontSize: 11, color: C.textLight, textAlign: "right", marginTop: 4 }}>
        {current} / {total}
      </p>
    </div>
  )
}
