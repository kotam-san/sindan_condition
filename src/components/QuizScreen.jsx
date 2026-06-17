import { C, QUESTIONS, OPTIONS } from '../data'
import ProgressBar from './ProgressBar'

export default function QuizScreen({ answers, onAnswer, onBack }) {
  const answeredCount = Object.keys(answers).length
  const currentQ = QUESTIONS.find(q => answers[q.id] === undefined)
  if (!currentQ) return null

  return (
    <div style={{ padding: "0 0 32px" }}>
      <ProgressBar current={answeredCount} total={QUESTIONS.length} />
      <div style={{ padding: "16px 20px 0" }}>

        <div style={{
          background: C.bgWhite, borderRadius: 16, padding: "24px 20px 20px",
          boxShadow: `0 2px 16px rgba(58,50,38,0.08)`, border: `1px solid ${C.border}`,
        }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "flex-start" }}>
            <span style={{
              background: C.accent, color: "#fff",
              minWidth: 26, height: 26, borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 700, flexShrink: 0,
            }}>
              {answeredCount + 1}
            </span>
            <p style={{
              margin: 0, fontSize: 16, color: C.textMain,
              lineHeight: 1.8, fontFamily: "'Noto Serif JP', serif",
            }}>
              {currentQ.text}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {OPTIONS.map(opt => (
              <button key={opt.value} onClick={() => onAnswer(currentQ.id, opt.value)} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px", borderRadius: 10,
                border: `1.5px solid ${C.border}`,
                background: C.bgWarm, cursor: "pointer", textAlign: "left",
              }}>
                <span style={{
                  width: 18, height: 18, borderRadius: "50%",
                  border: `2px solid ${C.accentSoft}`, flexShrink: 0,
                }} />
                <span style={{ fontSize: 14, color: C.textSub }}>{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {answeredCount > 0 && (
          <button onClick={onBack} style={{
            marginTop: 16, padding: "8px 16px",
            border: `1px solid ${C.border}`, borderRadius: 8,
            background: "transparent", color: C.textLight,
            fontSize: 13, cursor: "pointer",
          }}>
            ← 戻る
          </button>
        )}
      </div>
    </div>
  )
}
