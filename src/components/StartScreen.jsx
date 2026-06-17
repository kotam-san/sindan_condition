import { C } from '../data'

export default function StartScreen({ onStart }) {
  return (
    <div style={{ padding: "40px 20px 32px" }}>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <p style={{ fontSize: 11, letterSpacing: 3, color: C.accent, marginBottom: 16, fontWeight: 500 }}>
          CONDITION CHECK
        </p>
        <h1 style={{
          fontFamily: "'Noto Serif JP', serif", fontSize: 22,
          color: C.textMain, lineHeight: 1.8, marginBottom: 14,
        }}>
          後継者の<br />コンディション診断
        </h1>
        <p style={{ fontSize: 14, color: C.textSub, lineHeight: 2 }}>
          経営者としての<em style={{ fontStyle: "normal", color: C.accent }}>今の状態</em>を、<br />
          4つの視点から見ていきます。
        </p>
      </div>

      <div style={{
        display: "flex", justifyContent: "center", gap: 24,
        padding: "18px", background: C.bgCream, borderRadius: 12,
        marginBottom: 24, border: `1px solid ${C.border}`,
      }}>
        {[["16問", "質問数"], ["約3分", "所要時間"], ["無料", "費用"]].map(([val, lbl]) => (
          <div key={lbl} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "'Noto Serif JP', serif", fontSize: 20, fontWeight: 700, color: C.textMain }}>{val}</div>
            <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>{lbl}</div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: C.textLight, textAlign: "center", marginBottom: 20, marginTop: -8 }}>
        ※ 同じ立場の後継者との比較結果もお伝えします
      </p>

      <div style={{
        background: C.bgWhite, borderRadius: 12, padding: "20px",
        marginBottom: 24, border: `1px solid ${C.border}`,
        borderLeft: `3px solid ${C.accentSoft}`,
      }}>
        <p style={{ fontSize: 14, color: C.textSub, lineHeight: 2, margin: 0 }}>
          正解・不正解はありません。<br />直感で選んでください。
        </p>
      </div>

      <button onClick={onStart} style={{
        width: "100%", padding: "16px", borderRadius: 60,
        border: "none", background: C.accent, color: "#fff",
        fontSize: 15, fontWeight: 600, cursor: "pointer",
        boxShadow: `0 4px 20px ${C.accent}40`, letterSpacing: "0.05em",
        transition: "all 0.2s",
      }}>
        診断をはじめる
      </button>

      <p style={{ fontSize: 11, color: C.textLight, textAlign: "center", marginTop: 20, lineHeight: 1.9 }}>
        この診断は、経営者としてのあなたの「今の状態」を<br />
        考えてほしいとして作成されたものです。<br />
        医学的・心理学的な診断や評価を目的とするものではありません。
      </p>
    </div>
  )
}
