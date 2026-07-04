import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useParams, Link } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'

type Topic = {
  id: number
  subject_id: number
  name: string
  order_index: number
}

type Lesson = {
  id: number
  topic_id: number
  title: string
  content_markdown: string
  duration_minutes: number | null
  difficulty: 'Easy' | 'Medium' | 'Hard' | null
  completed: boolean
  created_at: string
}

type Quiz = {
  id: number
  topic_id: number
  title: string
  created_at: string
}

export default function TopicLessons() {
  const { subjectId, topicId } = useParams<{ subjectId: string; topicId: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [topic, setTopic] = useState<Topic | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const loadTopic = useCallback(async () => {
    const { data, error } = await supabase.from('topics').select('*').eq('id', Number(topicId)).single()
    if (error) setError(error.message)
    else setTopic(data)
  }, [topicId])

  const loadLessons = useCallback(async () => {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('topic_id', Number(topicId))
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setLessons(data || [])
    setLoading(false)
  }, [topicId])

  const loadQuizzes = useCallback(async () => {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('topic_id', Number(topicId))
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setQuizzes(data || [])
  }, [topicId])

  useEffect(() => {
    if (!user || !topicId) return
    loadTopic()
    loadLessons()
    loadQuizzes()
  }, [user, topicId, loadTopic, loadLessons, loadQuizzes])

  const toggleCompleted = async (lesson: Lesson) => {
    const { error } = await supabase
      .from('lessons')
      .update({ completed: !lesson.completed })
      .eq('id', lesson.id)
    if (error) setError(error.message)
    else loadLessons()
  }

  const deleteLesson = async (lessonId: number) => {
    if (!confirm('Delete this lesson?')) return
    const { error } = await supabase.from('lessons').delete().eq('id', lessonId)
    if (error) setError(error.message)
    else loadLessons()
  }

  const deleteQuiz = async (quizId: number) => {
    if (!confirm('Delete this quiz?')) return
    const { error } = await supabase.from('quizzes').delete().eq('id', quizId)
    if (error) setError(error.message)
    else loadQuizzes()
  }

  if (loading) return <p className="text-gray-600">Loading…</p>

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">{topic?.name || 'Topic'}</h1>
        <Link
          to={`/subjects/${subjectId}/topics/${topicId}/lessons/new`}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          + New Lesson
        </Link>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {lessons.length === 0 ? (
        <p className="text-gray-600">No lessons yet. Create one above.</p>
      ) : (
        <ul className="space-y-2">
          {lessons.map((lesson) => (
            <li
              key={lesson.id}
              className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleCompleted(lesson)}
                  className={`flex h-5 w-5 items-center justify-center rounded border ${
                    lesson.completed
                      ? 'border-accent bg-accent text-white'
                      : 'border-gray-300 hover:border-accent'
                  }`}
                  aria-label={lesson.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {lesson.completed && '✓'}
                </button>
                <Link
                  to={`/subjects/${subjectId}/topics/${topicId}/lessons/${lesson.id}`}
                  className="text-sm font-medium text-gray-900 hover:underline"
                >
                  {lesson.title || 'Untitled'}
                </Link>
              </div>
              <div className="flex items-center gap-2">
                {lesson.difficulty && (
                  <span className="text-xs text-gray-500">{lesson.difficulty}</span>
                )}
                {lesson.duration_minutes && (
                  <span className="text-xs text-gray-500">{lesson.duration_minutes} min</span>
                )}
                <button
                  onClick={() => deleteLesson(lesson.id)}
                  className="text-xs text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {quizzes.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quizzes</h2>
          <ul className="space-y-2">
            {quizzes.map((quiz) => (
              <li
                key={quiz.id}
                className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-4"
              >
                <Link
                  to={`/subjects/${subjectId}/topics/${topicId}/quizzes/${quiz.id}/take`}
                  className="text-sm font-medium text-gray-900 hover:underline"
                >
                  {quiz.title}
                </Link>
                <div className="flex items-center gap-2">
                  <Link
                    to={`/subjects/${subjectId}/topics/${topicId}/quizzes/${quiz.id}`}
                    className="text-xs text-accent hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteQuiz(quiz.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!quiz && (
        <Link
          to={`/subjects/${subjectId}/topics/${topicId}/quizzes/new`}
          className="inline-block rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
        >
          + New Quiz
        </Link>
      )}
    </div>
  )
}