import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../supabaseClient'
import { useParams, Link } from 'react-router-dom'
import { marked } from 'marked'
import type { User } from '@supabase/supabase-js'

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

export default function LessonEditor() {
  const { subjectId, topicId, lessonId } = useParams<{
    subjectId: string
    topicId: string
    lessonId?: string
  }>()
  const [user, setUser] = useState<User | null>(null)
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(!!lessonId)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [duration, setDuration] = useState<string>('')
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | ''>('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  useEffect(() => {
    if (lessonId && user) {
      supabase
        .from('lessons')
        .select('*')
        .eq('id', Number(lessonId))
        .single()
        .then(({ data, error }) => {
          if (error) setError(error.message)
          else if (data) {
            setLesson(data)
            setTitle(data.title || '')
            setContent(data.content_markdown || '')
            setDuration(data.duration_minutes ? String(data.duration_minutes) : '')
            setDifficulty(data.difficulty || '')
          }
          setLoading(false)
        })
    }
  }, [lessonId, user])

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)
    const lessonData = {
      topic_id: Number(topicId),
      title: title.trim() || 'Untitled',
      content_markdown: content,
      duration_minutes: duration ? Number(duration) : null,
      difficulty: difficulty || null,
    }

    if (lesson) {
      const { error } = await supabase.from('lessons').update(lessonData).eq('id', lesson.id)
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.from('lessons').insert(lessonData)
      if (error) setError(error.message)
    }
    setSaving(false)
  }

  const toggleCompleted = async () => {
    if (!lesson) return
    const { error } = await supabase
      .from('lessons')
      .update({ completed: !lesson.completed })
      .eq('id', lesson.id)
    if (error) setError(error.message)
    else setLesson({ ...lesson, completed: !lesson.completed })
  }

  if (loading) return <p className="text-gray-600">Loading…</p>

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">
          {lesson ? (lesson.title || 'Edit Lesson') : 'New Lesson'}
        </h1>
        <Link
          to={`/subjects/${subjectId}/topics/${topicId}`}
          className="text-sm text-gray-600 hover:underline"
        >
          Back to lessons
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex-1 rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="flex h-full flex-col md:flex-row">
          <div className="flex w-full flex-col border-b border-gray-200 md:w-1/2 md:border-b-0 md:border-r">
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4">
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Lesson title"
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="mb-4 flex gap-4">
                <div className="flex-1">
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                    Duration (min)
                  </label>
                  <input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="30"
                    min="1"
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>

                <div className="flex-1">
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                    Difficulty
                  </label>
                  <select
                    id="difficulty"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard' | '')}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  >
                    <option value="">None</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="mb-4 flex-1">
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Content (Markdown)
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your lesson content in Markdown..."
                  className="mt-1 h-64 w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>

              <div className="flex justify-end gap-2">
                {lesson && (
                  <button
                    type="button"
                    onClick={toggleCompleted}
                    className={`rounded-md px-4 py-2 text-sm font-medium ${
                      lesson.completed
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {lesson.completed ? 'Completed ✓' : 'Mark as Complete'}
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>

          <div className="w-full overflow-y-auto border-t border-gray-200 p-4 md:w-1/2 md:border-t-0">
            <div
              className="prose prose-sm max-w-none text-gray-800"
              dangerouslySetInnerHTML={{ __html: marked(content || 'Nothing to preview yet...') }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}