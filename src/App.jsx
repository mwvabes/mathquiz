import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [question, setQuestion] = useState({ num1: 0, num2: 0, operator: '+' })
  const [nextQuestion, setNextQuestion] = useState({ num1: 0, num2: 0, operator: '+' })
  const [answer, setAnswer] = useState('')
  const [correct, setCorrect] = useState(0)
  const [incorrect, setIncorrect] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedOperators, setSelectedOperators] = useState(['+', '-', '×', '÷'])
  const [vibrateEnabled, setVibrateEnabled] = useState(() => {
    const saved = localStorage.getItem('vibrateEnabled')
    return saved !== null ? JSON.parse(saved) : true
  })

  // Funkcja wibracji
  const vibrate = (duration = 10) => {
    if (vibrateEnabled && navigator.vibrate) {
      navigator.vibrate(duration)
    }
  }

  // Zapisz ustawienie wibracji do localStorage
  useEffect(() => {
    localStorage.setItem('vibrateEnabled', JSON.stringify(vibrateEnabled))
  }, [vibrateEnabled])

  // Generowanie nowego działania
  const generateNewQuestion = () => {
    const operators = selectedOperators.length > 0 ? selectedOperators : ['+', '-', '×', '÷']
    const operator = operators[Math.floor(Math.random() * operators.length)]
    let num1, num2

    switch (operator) {
      case '+':
        num1 = Math.floor(Math.random() * 50) + 1
        num2 = Math.floor(Math.random() * 50) + 1
        break
      case '-':
        num1 = Math.floor(Math.random() * 50) + 10
        num2 = Math.floor(Math.random() * num1) + 1
        break
      case '×':
        num1 = Math.floor(Math.random() * 12) + 1
        num2 = Math.floor(Math.random() * 12) + 1
        break
      case '÷':
        num2 = Math.floor(Math.random() * 12) + 1
        num1 = num2 * (Math.floor(Math.random() * 12) + 1)
        break
      default:
        num1 = 0
        num2 = 0
    }

    return { num1, num2, operator }
  }

  const generateQuestion = () => {
    setQuestion(nextQuestion)
    setNextQuestion(generateNewQuestion())
    setAnswer('')
    setIsError(false)
  }

  // Inicjalizacja pierwszego pytania
  useEffect(() => {
    setQuestion(generateNewQuestion())
    setNextQuestion(generateNewQuestion())
  }, [])

  // Obliczanie poprawnej odpowiedzi
  const getCorrectAnswer = () => {
    const { num1, num2, operator } = question
    switch (operator) {
      case '+':
        return num1 + num2
      case '-':
        return num1 - num2
      case '×':
        return num1 * num2
      case '÷':
        return num1 / num2
      default:
        return 0
    }
  }

  // Pominięcie pytania
  const skipQuestion = () => {
    vibrate(15)
    setIncorrect(prev => prev + 1)
    setStreak(0)
    generateQuestion()
  }

  // Toggle operatora w ustawieniach
  const toggleOperator = (operator) => {
    setSelectedOperators(prev => {
      if (prev.includes(operator)) {
        // Nie pozwól usunąć ostatniego operatora
        if (prev.length === 1) return prev
        return prev.filter(op => op !== operator)
      } else {
        return [...prev, operator]
      }
    })
  }

  // Obsługa kliknięcia cyfry
  const handleNumberClick = (num) => {
    vibrate(10)
    setAnswer(prev => prev + num)
  }

  // Obsługa backspace
  const handleBackspace = () => {
    vibrate(10)
    setAnswer(prev => prev.slice(0, -1))
  }

  // Czyszczenie całej odpowiedzi
  const clearAnswer = () => {
    vibrate(10)
    setAnswer('')
  }

  // Sprawdzanie odpowiedzi
  const checkAnswer = () => {
    if (answer === '') return

    const correctAnswer = getCorrectAnswer()
    const userAnswer = parseInt(answer)
    const isCorrect = userAnswer === correctAnswer

    if (isCorrect) {
      vibrate(30)
      setCorrect(prev => prev + 1)
      const newStreak = streak + 1
      setStreak(newStreak)
      if (newStreak > bestStreak) {
        setBestStreak(newStreak)
      }
      // Pokaż animację sukcesu
      setIsSuccess(true)
      // Natychmiast następne pytanie
      generateQuestion()
      // Usuń animację po jej zakończeniu
      setTimeout(() => {
        setIsSuccess(false)
      }, 400)
    } else {
      vibrate([10, 50, 10])
      setIncorrect(prev => prev + 1)
      setStreak(0)
      // Czerwony border bez czyszczenia odpowiedzi
      setIsError(true)
      // Usuń error po 500ms
      setTimeout(() => {
        setIsError(false)
      }, 500)
    }
  }

  // Obsługa klawiatury fizycznej
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key >= '0' && e.key <= '9') {
        handleNumberClick(e.key)
      } else if (e.key === 'Backspace') {
        handleBackspace()
      } else if (e.key === 'Enter') {
        checkAnswer()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [answer, question])

  return (
    <div className="app">
      <div className="header-box">
        <div className="score-row">
          <div className="score-item score-correct">
            <span>✓</span>
            <span>{correct}</span>
          </div>
          <div className="score-item score-incorrect">
            <span>✗</span>
            <span>{incorrect}</span>
          </div>
          <div className="score-item score-streak">
            <span>⭐</span>
            <span>{bestStreak}</span>
          </div>
        </div>
        <div className="button-row">
          <button className="control-btn" onPointerDown={(e) => {
            e.preventDefault()
            setShowSettings(true)
          }} title="Ustawienia">
            ⚙️
          </button>
          <button className="control-btn" onPointerDown={(e) => {
            e.preventDefault()
            skipQuestion()
          }} title="Pomiń pytanie">
            ⏭
          </button>
        </div>
        <div className="next-question-preview">
          ➜ {nextQuestion.num1} {nextQuestion.operator} {nextQuestion.num2}
        </div>
      </div>

      {showSettings && (
        <div className="settings-overlay" onClick={() => setShowSettings(false)}>
          <div className="settings-popup" onClick={(e) => e.stopPropagation()}>
            <div className="settings-header">
              <h2>Ustawienia</h2>
              <button className="close-btn" onPointerDown={(e) => {
                e.preventDefault()
                setShowSettings(false)
              }}>×</button>
            </div>
            <div className="settings-content">
              <h3>Wybierz operacje:</h3>
              <div className="operators-list">
                <label className="operator-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedOperators.includes('+')}
                    onChange={() => toggleOperator('+')}
                  />
                  <span>Dodawanie (+)</span>
                </label>
                <label className="operator-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedOperators.includes('-')}
                    onChange={() => toggleOperator('-')}
                  />
                  <span>Odejmowanie (−)</span>
                </label>
                <label className="operator-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedOperators.includes('×')}
                    onChange={() => toggleOperator('×')}
                  />
                  <span>Mnożenie (×)</span>
                </label>
                <label className="operator-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedOperators.includes('÷')}
                    onChange={() => toggleOperator('÷')}
                  />
                  <span>Dzielenie (÷)</span>
                </label>
              </div>

              <h3 style={{ marginTop: '1.5rem' }}>Inne ustawienia:</h3>
              <div className="operators-list">
                <label className="operator-checkbox">
                  <input
                    type="checkbox"
                    checked={vibrateEnabled}
                    onChange={() => setVibrateEnabled(!vibrateEnabled)}
                  />
                  <span>Wibracje</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="question-container">
        <div className="question">
          {question.num1} {question.operator} {question.num2}
        </div>
        <div className="answer-box">
          <div className={`answer-display ${isError ? 'error' : ''} ${isSuccess ? 'success' : ''}`}>
            {answer || '='}
          </div>
          {answer && (
            <button className="clear-answer-btn" onPointerDown={(e) => {
              e.preventDefault()
              clearAnswer()
            }} title="Wyczyść">
              ×
            </button>
          )}
        </div>
      </div>

      <div className="keyboard">
        <div className="number-pad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
            <button
              key={num}
              className="number-btn"
              onPointerDown={(e) => {
                e.preventDefault()
                handleNumberClick(num.toString())
              }}
            >
              {num}
            </button>
          ))}
          <button
            className="number-btn backspace-btn"
            onPointerDown={(e) => {
              e.preventDefault()
              handleBackspace()
            }}
          >
            ⌫
          </button>
          <button
            className="number-btn"
            onPointerDown={(e) => {
              e.preventDefault()
              handleNumberClick('0')
            }}
          >
            0
          </button>
          <button
            className="number-btn check-btn"
            onPointerDown={(e) => {
              e.preventDefault()
              checkAnswer()
            }}
          >
            ✓
          </button>
        </div>
      </div>

      <div className="footer">
        Vibe coded by Marcin Wielgos
      </div>
    </div>
  )
}

export default App
