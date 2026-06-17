import { useState } from 'react'
import { C, QUESTIONS } from './data'
import TopBar from './components/TopBar'
import StartScreen from './components/StartScreen'
import QuizScreen from './components/QuizScreen'
import FreeTextScreen from './components/FreeTextScreen'
import ResultScreen from './components/ResultScreen'

export default function App() {
  const [screen,   setScreen]   = useState("start")
  const [answers,  setAnswers]  = useState({})
  const [history,  setHistory]  = useState([])
  const [freeText, setFreeText] = useState("")

  function handleStart() {
    setScreen("quiz")
    setAnswers({})
    setHistory([])
    setFreeText("")
  }

  function handleAnswer(qId, val) {
    const newAnswers = { ...answers, [qId]: val }
    setAnswers(newAnswers)
    setHistory(prev => [...prev.filter(id => id !== qId), qId])

    setTimeout(() => {
      if (Object.keys(newAnswers).length === QUESTIONS.length) {
        setScreen("freetext")
      }
    }, 350)
  }

  function handleBack() {
    if (history.length === 0) return
    const lastQId = history[history.length - 1]
    setAnswers(prev => { const n = { ...prev }; delete n[lastQId]; return n })
    setHistory(prev => prev.slice(0, -1))
  }

  function handleFreeTextNext(text) {
    setFreeText(text)
    setScreen("result")
  }

  function handleRestart() {
    setScreen("start")
    setAnswers({})
    setHistory([])
    setFreeText("")
  }

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: C.bgWarm }}>
      <TopBar />
      {screen === "start"    && <StartScreen onStart={handleStart} />}
      {screen === "quiz"     && <QuizScreen answers={answers} onAnswer={handleAnswer} onBack={handleBack} />}
      {screen === "freetext" && <FreeTextScreen onNext={handleFreeTextNext} onSkip={() => handleFreeTextNext("")} />}
      {screen === "result"   && <ResultScreen answers={answers} freeText={freeText} onRestart={handleRestart} />}
    </div>
  )
}
