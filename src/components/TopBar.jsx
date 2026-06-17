import { C } from '../data'

export default function TopBar() {
  return (
    <div style={{ background: C.bgCream, borderBottom: `1px solid ${C.border}`, padding: "14px 20px" }}>
      <span style={{
        fontFamily: "'Noto Serif JP', serif", fontSize: 14,
        color: C.accentDeep, fontWeight: 700, letterSpacing: "0.1em",
      }}>
        ONE PLANET
      </span>
    </div>
  )
}
