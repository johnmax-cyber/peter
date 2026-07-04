import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useParams, Link } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'

type Quiz = {
  id: number
  topic_id: number
  title: string
}

type QuizQuestion = {
  id: number
  quiz_id: number
  question_text: string
  choices: string[]
  correct_choice_index: number
  explanation: string | null
}

export default function QuizTake() {
  const { subjectId, topicId, quizId } = useParams<{
    subjectId: string
    topicId: string
    quizId: string
  }>()
  const [user, setUser] = useState<User | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const loadQuiz = useCallback(async () => {
    if (!quizId) return
    const { data, error } = await supabase.from('quizzes').select('*').eq('id', Number(quizId)).single()
    if (error) setError(error.message)
    else setQuiz(data)
  }, [quizId])

  const loadQuestions = useCallback(async () => {
    if (!quizId) return
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', Number(quizId))
      .order('id')
    if (error) setError(error.message)
    else setQuestions(data || [])
    setLoading(false)
  }, [quizId])

  useEffect(() => {
    if (!user || !quizId) return
    loadQuiz()
    loadQuestions()
  }, [user, quizId, loadQuiz, loadQuestions])

  const handleAnswer = (index: number) => {
    if (submitted) return
    const q = questions[currentQuestion]
    setAnswers((prev) => ({ ...prev, [q.id]: index }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSubmit = async () => {
    const correct = questions.filter((q) => answers[q.id] === q.correct_choice_index).length
    const total = questions.length
    const calculatedScore = Math.round((correct / total) * 100)
    setScore(calculatedScore)
    setSubmitted(true)

    if (user && quiz) {
      await supabase.from('quiz_attempts').insert({
        quiz_id: quiz.id,
        user_id: user.id,
        score: calculatedScore,
      })
    }
  }

  const retake = () => {
    setAnswers({})
    setSubmitted(false)
    setScore(null)
    setCurrentQuestion(0)
  }

  if (loading) return <p className="text-gray-600">Loading…</p>

  if (!quiz || questions.length === 0) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">{quiz?.title || 'Quiz'}</h1>
        <p className="text-gray-600">No questions in this quiz.</p>
        <Link
          to={`/subjects/${subjectId}/topics/${topicId}/quizzes/${quiz?.id || ''}`}
          className="text-sm text-accent hover:underline"
        >
          Add questions
        </Link>
      </div>
    )
  }

  const q = questions[currentQuestion]
  const selectedIndex = answers[q?.id]

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">{quiz.title}</h1>
        <Link
          to={`/subjects/${subjectId}/topics/${topicId}`}
          className="text-sm text-gray-600 hover:underline"
        >
          Back to lessons
        </Link>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {!submitted ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 text-sm text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </div>

          <h2 className="mb-4 text-lg font-medium text-gray-900">{q.question_text}</h2>

          <div className="space-y-2">
            {q.choices.map((choice, idx) => (
              <label
                key={idx}
                className="flex items-center gap-3 rounded-md border border-gray-200 p-3 hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name={`question-${q.id}`}
                  checked={selectedIndex === idx}
                  onChange={() => handleAnswer(idx)}
                  className="h-4 w-4 text-accent focus:ring-accent"
                />
                <span className="text-sm text-gray-800">{choice}</span>
              </label>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <button
              onClick={handlePrev}
              disabled={currentQuestion === 0}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
              >
                Next
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Score: {score}%</h2>
            <p className="mt-1 text-sm text-gray-600">
              {questions.filter((q) => answers[q.id] === q.correct_choice_index).length} of{' '}
              {questions.length} correct
            </p>
            <button
              onClick={retake}
              className="mt-4 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
            >
              Retake
            </button>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Review</h3>
            <div className="space-y-4">
              {questions.map((q, idx) => {
                const isCorrect = answers[q.id] === q.correct_choice_index
                const selectedChoice = answers[q.id] !== undefined ? q.choices[answers[q.id]] : null
                return (
                  <div key={q.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <p className="font-medium text-gray-900">
                      {idx + 1}. {q.question_text}
                    </p>
                    <p className="mt-2 text-sm">
                      Your answer:{' '}
                      <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {selectedChoice || 'No answer'}
                      </span>
                      {!isCorrect && (
                        <>
                          {' '}
                          | Correct:{' '}
                          <span className="text-green-600">{q.choices[q.correct_choice_index]}</span>
                        </>
                      )}
                    </p>
                    {q.explanation && (
                      <p className="mt-2 text-sm text-gray-600">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}