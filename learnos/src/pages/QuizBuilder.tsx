import { useEffect, useState, type FormEvent, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useParams, Link } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'

type Quiz = {
  id: number
  topic_id: number
  title: string
  created_at: string
}

type QuizQuestion = {
  id: number
  quiz_id: number
  question_text: string
  choices: string[]
  correct_choice_index: number
  explanation: string | null
}

export default function QuizBuilder() {
  const { subjectId, topicId, quizId } = useParams<{
    subjectId: string
    topicId: string
    quizId?: string
  }>()
  const [user, setUser] = useState<User | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(!!quizId)
  const [error, setError] = useState<string | null>(null)

  const [quizTitle, setQuizTitle] = useState('')
  const [questionText, setQuestionText] = useState('')
  const [choices, setChoices] = useState<string[]>(['', '', '', ''])
  const [correctIndex, setCorrectIndex] = useState(0)
  const [explanation, setExplanation] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const loadQuiz = useCallback(async () => {
    if (!quizId) return
    const { data, error } = await supabase.from('quizzes').select('*').eq('id', Number(quizId)).single()
    if (error) setError(error.message)
    else {
      setQuiz(data)
      setQuizTitle(data.title)
    }
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

  const handleCreateQuiz = async (e: FormEvent) => {
    e.preventDefault()
    if (!topicId || !user) return

    const { data, error } = await supabase
      .from('quizzes')
      .insert({ topic_id: Number(topicId), title: quizTitle.trim() })
      .select()
      .single()
    if (error) setError(error.message)
    else {
      setQuiz(data)
      setQuestions([])
    }
  }

  const handleAddQuestion = async (e: FormEvent) => {
    e.preventDefault()
    if (!quiz || !questionText.trim()) return

    const { data, error } = await supabase
      .from('quiz_questions')
      .insert({
        quiz_id: quiz.id,
        question_text: questionText.trim(),
        choices: choices.filter((c) => c.trim()),
        correct_choice_index: correctIndex,
        explanation: explanation.trim() || null,
      })
      .select()
      .single()
    if (error) setError(error.message)
    else {
      setQuestions((prev) => [...prev, data])
      setQuestionText('')
      setChoices(['', '', '', ''])
      setCorrectIndex(0)
      setExplanation('')
    }
  }

  const deleteQuestion = async (questionId: number) => {
    if (!confirm('Delete this question?')) return
    const { error } = await supabase.from('quiz_questions').delete().eq('id', questionId)
    if (error) setError(error.message)
    else setQuestions((prev) => prev.filter((q) => q.id !== questionId))
  }

  if (loading) return <p className="text-gray-600">Loading…</p>

  if (!quiz) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Create Quiz</h1>
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <form onSubmit={handleCreateQuiz} className="space-y-4">
          <div>
            <label htmlFor="quiz-title" className="block text-sm font-medium text-gray-700">
              Quiz Title
            </label>
            <input
              id="quiz-title"
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="e.g. Chapter 1 Review"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Create Quiz
          </button>
        </form>
        <Link
          to={`/subjects/${subjectId}/topics/${topicId}`}
          className="text-sm text-gray-600 hover:underline"
        >
          Back to lessons
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">{quiz.title}</h1>
        <Link
          to={`/subjects/${subjectId}/topics/${topicId}/quizzes/${quiz.id}/take`}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Take Quiz
        </Link>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Add Question</h2>
        <form onSubmit={handleAddQuestion} className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700">
              Question
            </label>
            <input
              id="question"
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder="Enter your question"
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="space-y-2">
            {choices.map((choice, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  checked={correctIndex === idx}
                  onChange={() => setCorrectIndex(idx)}
                  className="h-4 w-4 text-accent focus:ring-accent"
                />
                <input
                  type="text"
                  value={choice}
                  onChange={(e) => setChoices((prev) => prev.map((c, i) => (i === idx ? e.target.value : c)))}
                  placeholder={`Choice ${idx + 1}`}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
            ))}
          </div>

          <div>
            <label htmlFor="explanation" className="block text-sm font-medium text-gray-700">
              Explanation (optional)
            </label>
            <textarea
              id="explanation"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Why is the correct answer correct?"
              rows={2}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
            />
          </div>

          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Add Question
          </button>
        </form>
      </div>

      {questions.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Questions</h2>
          <ul className="space-y-2">
            {questions.map((q, idx) => (
              <li key={q.id} className="flex items-center justify-between rounded-md border border-gray-200 p-3">
                <span className="text-sm text-gray-800">
                  {idx + 1}. {q.question_text}
                </span>
                <button
                  onClick={() => deleteQuestion(q.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}