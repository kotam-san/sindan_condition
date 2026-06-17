import { useState } from 'react'
import { C } from '../data'

export default function FreeTextScreen({ onNext, onSkip }) {
  const [text, setText] = useState("")

  return (
    <div style={{ padding: "32px 20px" }}>
      <div style={{
        background: C.bgWhite, borderRadius: 16, padding: "28px 20px",
        border: `1px solid ${C.border}`, boxShadow: `0 2px 16px rgba(58,50,38,0.08)`,
      }}>
        <p style={{ fontSize: 11, color: C.accent, letterSpacing: 2, marginBottom: 12, fontWeight: 500 }}>
          最後に
        </p>
        <p style={{
          fontFamily: "'Noto Serif JP', serif", fontSize: 16,
          color: C.textMain, lineHeight: 1.8, marginBottom: 20,
        }}>
          今、一番気になっていることを<br />一言で書いてください。
        </p>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="例：先代との関係、社員のモチベーション、自分の将来..."
          rows={3}
          style={{
            width: "100%", padding: "12px 14px", borderRadius: 10,
            border: `1.5px solid ${C.border}`, background: C.bgWarm,
            fontSize: 14, color: C.textMain, lineHeight: 1.8,
            resize: "none", outline: "none", boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
        <button onClick={() => onNext(text)} style={{
          width: "100%", padding: "15px", borderRadius: 60,
          border: "none", background: C.accent, color: "#fff",
          fontSize: 15, fontWeight: 600, cursor: "pointer",
          boxShadow: `0 4px 16px ${C.accent}40`,
        }}>
          結果を見る
        </button>
        <button onClick={onSkip} style={{
          width: "100%", padding: "12px", borderRadius: 60,
          border: `1px solid ${C.border}`, background: "transparent",
          color: C.textLight, fontSize: 13, cursor: "pointer",
        }}>
          スキップして結果を見る
        </button>
      </div>
    </div>
  )
}
