import { AXES, QUESTIONS, STAGES } from './data'

export function calcAxisScores(answers) {
  const s = { A: 0, B: 0, C: 0, D: 0 }
  QUESTIONS.forEach(q => { s[q.axis] += (answers[q.id] || 0) })
  return s
}

export function calcTotal(answers) {
  return Object.values(answers).reduce((a, b) => a + b, 0)
}

export function getStage(total) {
  return STAGES.find(s => total >= s.range[0] && total <= s.range[1])
}

export function getTopAxis(axisScores) {
  return AXES.reduce((top, ax) => axisScores[ax.id] > axisScores[top.id] ? ax : top, AXES[0])
}
