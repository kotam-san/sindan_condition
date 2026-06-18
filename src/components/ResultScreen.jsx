import { useState } from 'react'
import {
  C, AXES, BASELINE, SUGGESTIONS, TOP_AXIS_COMMENTS,
  NOTE_ARTICLES, WORKER_URL, GAS_URL,
} from '../data'
import { calcAxisScores, calcTotal, getStage, getTopAxis } from '../logic'
import RadarChart from './RadarChart'

export default function ResultScreen({ answers, freeText, onRestart }) {
  const [emailUnlocked, setEmailUnlocked] = useState(false)
  const [emailValue, setEmailValue]       = useState("")
  const [submitting, setSubmitting]       = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState([])
  const [agreed, setAgreed]               = useState(false)

  const axisScores = calcAxisScores(answers)
  const total      = calcTotal(answers)
  const stage      = getStage(total)
  const topAxis    = getTopAxis(axisScores)

  async function handleEmailSubmit(e) {
    e.preventDefault()
    if (!emailValue.trim() || !agreed) return
    setSubmitting(true)
    const payload = {
      email: emailValue.trim(),
      stage: stage.id,
      topAxis: topAxis.id,
      axisScores,
      total,
      freeText,
    }
    try {
      const requests = []
      if (WORKER_URL) {
        requests.push(
          fetch(WORKER_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }).then(res => res.ok ? res.json() : null)
        )
      }
      if (GAS_URL) {
        const formData = new URLSearchParams({
          email: payload.email,
          stage: payload.stage,
          scoreA: payload.axisScores.A,
          scoreB: payload.axisScores.B,
          scoreC: payload.axisScores.C,
          scoreD: payload.axisScores.D,
          total: payload.total,
          freeText: payload.freeText || "",
        })
        requests.push(
          fetch(GAS_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: formData.toString(),
          }).catch(() => null)
        )
      }
      const [workerData] = await Promise.all(requests)
      if (workerData && workerData.suggestions && workerData.suggestions.length >= 3) {
        setAiSuggestions(workerData.suggestions)
      }
    } catch (_) {}
    setEmailUnlocked(true)
    setSubmitting(false)
  }

  return (
    <div style={{ padding: "20px 20px 40px" }}>

      <div style={{
        background: C.bgCream, borderRadius: 16, padding: "28px 20px",
        textAlign: "center", border: `1px solid ${C.border}`, marginBottom: 16,
      }}>
        <p style={{ fontSize: 11, letterSpacing: 3, color: stage.color, marginBottom: 8, fontWeight: 500 }}>
          診断結果
        </p>
        <p style={{ fontSize: 12, color: C.textLight, marginBottom: 6 }}>あなたは今</p>
        <h2 style={{
          fontFamily: "'Noto Serif JP', serif", fontSize: 24,
          color: stage.color, marginBottom: 10, fontWeight: 700,
        }}>
          ステージ{stage.id}「{stage.name}」
        </h2>
        <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.9, marginBottom: 16 }}>
          {stage.message}
        </p>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: 4 }}>
          <span style={{
            fontFamily: "'Noto Serif JP', serif", fontSize: 52,
            fontWeight: 700, color: stage.color, lineHeight: 1,
          }}>{total}</span>
          <span style={{ fontSize: 16, color: C.textLight }}>/80</span>
        </div>
        <p style={{ fontSize: 13, color: C.textSub, marginTop: 12, lineHeight: 1.8 }}>
          {stage.sub}
        </p>
      </div>

      <div style={{
        background: C.bgWhite, borderRadius: 16, padding: "24px 16px",
        border: `1px solid ${C.border}`, marginBottom: 16,
      }}>
        <p style={{ fontSize: 12, color: C.textSub, textAlign: "center", marginBottom: 12 }}>
          4つの軸のスコア
        </p>
        <RadarChart axisScores={axisScores} />

        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="20" height="3"><line x1="0" y1="1.5" x2="20" y2="1.5" stroke={C.accent} strokeWidth="2" /></svg>
            <span style={{ fontSize: 11, color: C.textSub }}>あなた</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <svg width="20" height="3"><line x1="0" y1="1.5" x2="20" y2="1.5" stroke={C.accentSoft} strokeWidth="1.5" strokeDasharray="4 3" /></svg>
            <span style={{ fontSize: 11, color: C.textSub }}>同じ立場の平均</span>
          </div>
        </div>

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          {AXES.map(ax => {
            const score = axisScores[ax.id]
            const isTop = ax.id === topAxis.id
            return (
              <div key={ax.id}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: C.textSub }}>{ax.label}</span>
                  <span style={{ fontSize: 12, color: isTop ? stage.color : C.textLight, fontWeight: isTop ? 700 : 400 }}>
                    {score}<span style={{ fontSize: 10, color: C.textLight }}>/20</span>
                    {isTop && <span style={{ fontSize: 10, color: stage.color, marginLeft: 4 }}>▲最高</span>}
                  </span>
                </div>
                <div style={{ height: 5, background: C.border, borderRadius: 3 }}>
                  <div style={{
                    height: "100%",
                    width: `${(score / 20) * 100}%`,
                    borderRadius: 3,
                    background: isTop ? stage.color : C.accentSoft,
                    transition: "width 0.6s ease",
                  }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{
        background: C.bgWhite, borderRadius: 16, padding: "20px",
        border: `1px solid ${C.border}`, borderLeft: `3px solid ${stage.color}`,
        marginBottom: 16,
      }}>
        <p style={{ fontSize: 12, color: stage.color, fontWeight: 600, marginBottom: 8 }}>
          あなたの特徴
        </p>
        <p style={{
          fontFamily: "'Noto Serif JP', serif", fontSize: 15,
          color: C.textMain, lineHeight: 1.9, margin: 0,
        }}>
          特に<strong>「{topAxis.label}」</strong>のスコアが高い傾向にあります。<br />
          {TOP_AXIS_COMMENTS[topAxis.id]}
        </p>
      </div>

      <div style={{
        background: C.bgCream, borderRadius: 12, padding: "16px 18px",
        border: `1px solid ${C.border}`, marginBottom: 24,
      }}>
        <p style={{ fontSize: 11, color: C.textLight, marginBottom: 6 }}>
          同じ立場の後継者と比べると
        </p>
        <p style={{ fontSize: 14, color: C.textSub, lineHeight: 1.9, margin: 0 }}>
          「{topAxis.label}」のスコアが平均（{BASELINE[topAxis.id]}/20）より
          <strong>{axisScores[topAxis.id] >= BASELINE[topAxis.id] ? "高い" : "低い"}</strong>傾向です。
          {axisScores[topAxis.id] >= BASELINE[topAxis.id]
            ? `「${topAxis.short}」に関して、具体的に気になっていることがあるかもしれません。`
            : `この軸は比較的安定しているようです。`}
        </p>
      </div>

      {!emailUnlocked ? (
        <div style={{
          background: C.bgWhite, borderRadius: 16, padding: "28px 20px",
          border: `2px solid ${C.accent}`, marginBottom: 16,
          boxShadow: `0 4px 24px rgba(184,120,78,0.12)`,
        }}>
          <p style={{
            fontFamily: "'Noto Serif JP', serif", fontSize: 17,
            color: C.textMain, lineHeight: 1.8, textAlign: "center",
            marginBottom: 20, fontWeight: 700,
          }}>
            あなたに合わせた<br />「AIパーソナル・ヒント」を<br />このまま無料で作成します
          </p>

          <div style={{
            border: `1px solid ${C.border}`, borderRadius: 12,
            padding: "16px 18px", marginBottom: 20, background: C.bgWarm,
          }}>
            <p style={{ fontSize: 12, color: C.accent, fontWeight: 600, marginBottom: 12 }}>
              ▼ この後すぐに見られる内容
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                `「${topAxis.label}」の客観的な分析`,
                "現状のパターンから抜け出す「コーチからの問い」",
                "明日から試せる小さなアクション（3つ）",
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ fontSize: 16, lineHeight: 1.5 }}>💡</span>
                  <p style={{ margin: 0, fontSize: 14, color: C.textSub, lineHeight: 1.6 }}>{item}</p>
                </div>
              ))}
            </div>
          </div>

          <p style={{ fontSize: 13, color: C.textSub, lineHeight: 1.9, marginBottom: 20, textAlign: "center" }}>
            ※生成されたヒントと解説は、後ほどメールでもお届けします。<br />
            メールアドレスを入力して、AIヒントを作成してください。
          </p>

          <form onSubmit={handleEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="email"
              placeholder="メールアドレスを入力"
              value={emailValue}
              onChange={e => setEmailValue(e.target.value)}
              required
              style={{
                width: "100%", padding: "14px 16px", borderRadius: 60,
                border: `1.5px solid ${C.border}`, background: C.bgWarm,
                fontSize: 15, color: C.textMain, boxSizing: "border-box",
                outline: "none",
              }}
            />

            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "2px 4px 0" }}>
              <input
                type="checkbox"
                id="privacy-agree"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{
                  marginTop: 3, width: 16, height: 16,
                  cursor: "pointer", accentColor: C.accent, flexShrink: 0,
                }}
              />
              <label htmlFor="privacy-agree" style={{
                fontSize: 12, color: C.textSub, lineHeight: 1.7, cursor: "pointer",
              }}>
                <a
                  href="https://www.1planet.jp/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: C.accent, textDecoration: "underline" }}
                >プライバシーポリシー</a>
                を確認し、診断結果と情報提供を受けることに同意します。
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting || !agreed}
              style={{
                width: "100%", padding: "16px", borderRadius: 60,
                background: (submitting || !agreed) ? C.accentSoft : C.accent,
                color: "#fff", fontSize: 15, fontWeight: 600,
                border: "none", cursor: (submitting || !agreed) ? "default" : "pointer",
                letterSpacing: "0.05em",
                boxShadow: (submitting || !agreed) ? "none" : `0 4px 16px ${C.accent}50`,
              }}
            >
              {submitting ? "AIヒントを作成しています…" : "無料でヒントを見る"}
            </button>
            {submitting && (
              <p style={{ fontSize: 12, color: C.textLight, textAlign: "center", marginTop: 4, lineHeight: 1.8 }}>
                あなたのスコアをもとに、AIが分析しています。<br />少々お待ちください。
              </p>
            )}
          </form>
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <p style={{ fontSize: 11, color: C.textLight, lineHeight: 1.9 }}>
              ※ 後継者向けの無料相談のご案内も含まれます。<br />
              ※ 解除はいつでも可能です。
            </p>
          </div>
        </div>
      ) : (
        <>
          {(() => {
            const content = aiSuggestions.length >= 6 ? aiSuggestions : SUGGESTIONS[topAxis.id]
            const [analysis, question, act1, act2, act3, message] = content
            const actions = [act1, act2, act3]
            return (
              <>
                <div style={{
                  background: C.bgWhite, borderRadius: 16, padding: "24px 20px",
                  border: `1px solid ${C.border}`, marginBottom: 16,
                  boxShadow: `0 2px 16px rgba(58,50,38,0.08)`,
                }}>
                  <p style={{ fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: 1, marginBottom: 12 }}>
                    客観的な分析
                  </p>
                  <p style={{ fontSize: 14, color: C.textSub, lineHeight: 2, margin: 0 }}>{analysis}</p>
                </div>

                <div style={{
                  background: C.bgCream, borderRadius: 16, padding: "24px 20px",
                  border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.accent}`,
                  marginBottom: 16,
                }}>
                  <p style={{ fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: 1, marginBottom: 12 }}>
                    コーチからの問い
                  </p>
                  <p style={{
                    fontFamily: "'Noto Serif JP', serif", fontSize: 15,
                    color: C.textMain, lineHeight: 1.9, margin: 0, fontWeight: 600,
                  }}>{question}</p>
                </div>

                <div style={{
                  background: C.bgWhite, borderRadius: 16, padding: "24px 20px",
                  border: `1px solid ${C.border}`, marginBottom: 16,
                }}>
                  <p style={{ fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: 1, marginBottom: 16 }}>
                    明日から試せるアクション
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {actions.map((act, i) => {
                      const colonIdx = act.indexOf("：")
                      const title = colonIdx > -1 ? act.slice(0, colonIdx) : `アクション${i + 1}`
                      const body  = colonIdx > -1 ? act.slice(colonIdx + 1) : act
                      return (
                        <div key={i} style={{
                          padding: "16px", borderRadius: 12,
                          background: C.bgCream, border: `1px solid ${C.border}`,
                        }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                            <span style={{
                              minWidth: 22, height: 22, borderRadius: "50%",
                              background: C.accent, color: "#fff",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 11, fontWeight: 700, flexShrink: 0,
                            }}>{i + 1}</span>
                            <p style={{ margin: 0, fontSize: 14, color: C.textMain, fontWeight: 600, lineHeight: 1.5 }}>{title}</p>
                          </div>
                          <p style={{ margin: 0, fontSize: 13, color: C.textSub, lineHeight: 1.9, paddingLeft: 32 }}>{body}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div style={{
                  background: C.bgWhite, borderRadius: 16, padding: "24px 20px",
                  border: `1px solid ${C.border}`, marginBottom: 16,
                }}>
                  <p style={{ fontSize: 11, color: C.accent, fontWeight: 600, letterSpacing: 1, marginBottom: 12 }}>
                    専門家からのメッセージ
                  </p>
                  <p style={{ fontSize: 14, color: C.textSub, lineHeight: 2, margin: 0 }}>{message}</p>
                </div>
              </>
            )
          })()}

          {NOTE_ARTICLES[stage.id] && NOTE_ARTICLES[stage.id].url !== "#" && (
            <div style={{
              background: C.bgCream, borderRadius: 12, padding: "16px 18px",
              border: `1px solid ${C.border}`, marginBottom: 16,
            }}>
              <p style={{ fontSize: 11, color: C.textLight, marginBottom: 8 }}>
                あなたのステージに合ったnote記事
              </p>
              <a
                href={NOTE_ARTICLES[stage.id].url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: 14, color: C.accent, fontWeight: 600, textDecoration: "underline", lineHeight: 1.8 }}
              >
                {NOTE_ARTICLES[stage.id].title}
              </a>
            </div>
          )}

          <div className="no-print" style={{ marginBottom: 16 }}>
            <button
              onClick={() => window.print()}
              style={{
                width: "100%", padding: "14px", borderRadius: 60,
                border: `1.5px solid ${C.accent}`, background: C.bgWhite,
                color: C.accent, fontSize: 14, fontWeight: 600,
                cursor: "pointer", letterSpacing: "0.03em",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <span>↓</span> 結果をPDFで保存する
            </button>
            <p style={{ fontSize: 11, color: C.textLight, textAlign: "center", marginTop: 8 }}>
              ブラウザの印刷メニューから「PDFに保存」を選んでください
            </p>
          </div>

          <div className="no-print" style={{
            background: C.textMain, borderRadius: 16, padding: "28px 20px",
            textAlign: "center", marginBottom: 16,
          }}>
            <p style={{
              fontFamily: "'Noto Serif JP', serif", fontSize: 15,
              color: "#F5EDE0", lineHeight: 2, marginBottom: 20,
            }}>
              一人で考えるのは、<br />もうやめにしませんか。
            </p>
            <a
              href="https://www.1planet.jp/contact"
              style={{
                display: "block", padding: "14px", borderRadius: 60,
                background: C.accent, color: "#fff",
                fontSize: 15, fontWeight: 600, textDecoration: "none",
                boxShadow: `0 4px 16px ${C.accent}50`,
              }}
            >
              無料相談に申し込む
            </a>
            <p style={{ fontSize: 11, color: "#9B8E7E", marginTop: 12, lineHeight: 1.8 }}>
              ※ Zoom または対面。日程は個別調整します。<br />
              ※ 相談後の営業は一切しません。
            </p>
          </div>
        </>
      )}

      <div style={{
        background: C.bgCream, borderRadius: 12, padding: "16px",
        border: `1px solid ${C.border}`, marginBottom: 16,
      }}>
        <p style={{ fontSize: 11, color: C.textLight, lineHeight: 1.9, margin: 0 }}>
          <strong style={{ color: C.textSub }}>ご利用にあたって</strong><br />
          本診断は株式会社ONE PLANETが独自に作成したセルフチェックツールです。医療機関による診断・心理検査またはそれらに代わるものではありません。診断結果はあくまで参考情報としてご活用ください。心身の不調が続く場合は、専門の医療機関にご相談されることをおすすめします。
        </p>
      </div>

      <button className="no-print" onClick={onRestart} style={{
        width: "100%", padding: "10px",
        border: `1px solid ${C.border}`, borderRadius: 10,
        background: "transparent", color: C.textLight,
        fontSize: 13, cursor: "pointer",
      }}>
        もう一度診断する
      </button>
    </div>
  )
}
