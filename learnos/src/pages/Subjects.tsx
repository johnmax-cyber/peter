import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../supabaseClient'
import type { User } from '@supabase/supabase-js'
import { Link } from 'react-router-dom'

type Subject = {
  id: number
  name: string
  created_at: string
}

type Topic = {
  id: number
  subject_id: number
  name: string
  order_index: number
  created_at: string
}

export default function Subjects() {
  const [user, setUser] = useState<User | null>(null)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Record<number, Topic[]>>({})
  const [expandedSubjectId, setExpandedSubjectId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subjectName, setSubjectName] = useState('')
  const [topicNames, setTopicNames] = useState<Record<number, string>>({})

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!user) return
    loadSubjects()
  }, [user])

  const loadSubjects = async () => {
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setSubjects(data || [])
  }

  const loadTopics = async (subjectId: number) => {
    const { data, error } = await supabase
      .from('topics')
      .select('*')
      .eq('subject_id', subjectId)
      .order('order_index', { ascending: true })
    if (error) setError(error.message)
    else setTopics((prev) => ({ ...prev, [subjectId]: data || [] }))
  }

  const handleCreateSubject = async (e: FormEvent) => {
    e.preventDefault()
    if (!subjectName.trim() || !user) return

    const { error } = await supabase.from('subjects').insert({
      user_id: user.id,
      name: subjectName.trim(),
    })
    if (error) setError(error.message)
    else {
      setSubjectName('')
      loadSubjects()
    }
  }

  const handleCreateTopic = async (subjectId: number) => {
    const name = topicNames[subjectId]?.trim()
    if (!name || !user) return

    const existing = topics[subjectId] || []
    const maxOrder = existing.length > 0 ? Math.max(...existing.map((t) => t.order_index)) : 0

    const { error } = await supabase.from('topics').insert({
      subject_id: subjectId,
      name,
      order_index: maxOrder + 1,
    })
    if (error) setError(error.message)
    else {
      setTopicNames((prev) => ({ ...prev, [subjectId]: '' }))
      loadTopics(subjectId)
    }
  }

  const moveTopic = async (subjectId: number, topic: Topic, direction: 'up' | 'down') => {
    const list = topics[subjectId] || []
    const sorted = [...list].sort((a, b) => a.order_index - b.order_index)
    const idx = sorted.findIndex((t) => t.id === topic.id)

    if (idx === -1) return
    if (direction === 'up' && idx === 0) return
    if (direction === 'down' && idx === sorted.length - 1) return

    const neighbor = direction === 'up' ? sorted[idx - 1] : sorted[idx + 1]

    await supabase
      .from('topics')
      .update({ order_index: neighbor.order_index })
      .eq('id', topic.id)

    await supabase
      .from('topics')
      .update({ order_index: topic.order_index })
      .eq('id', neighbor.id)

    loadTopics(subjectId)
  }

  const deleteSubject = async (subjectId: number) => {
    if (!confirm('Delete this subject? All topics will be removed.')) return
    const { error } = await supabase.from('subjects').delete().eq('id', subjectId)
    if (error) setError(error.message)
    else {
      setExpandedSubjectId(null)
      loadSubjects()
    }
  }

  const deleteTopic = async (subjectId: number, topicId: number) => {
    if (!confirm('Delete this topic?')) return
    const { error } = await supabase.from('topics').delete().eq('id', topicId)
    if (error) setError(error.message)
    else loadTopics(subjectId)
  }

  const toggleExpand = (subjectId: number) => {
    if (expandedSubjectId === subjectId) {
      setExpandedSubjectId(null)
    } else {
      setExpandedSubjectId(subjectId)
      if (!topics[subjectId]) loadTopics(subjectId)
    }
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Subjects</h1>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Create Subject</h2>
        <form onSubmit={handleCreateSubject} className="flex gap-2">
          <input
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="Subject name"
            required
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Add
          </button>
        </form>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading…</p>
      ) : subjects.length === 0 ? (
        <p className="text-gray-600">No subjects yet. Create one above.</p>
      ) : (
        <div className="space-y-4">
          {subjects.map((subject) => (
            <div key={subject.id} className="rounded-lg border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">{subject.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleExpand(subject.id)}
                    className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white hover:bg-accent-hover"
                  >
                    {expandedSubjectId === subject.id ? 'Hide Topics' : '+ Add Topic'}
                  </button>
                  <button
                    onClick={() => deleteSubject(subject.id)}
                    className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {expandedSubjectId === subject.id && (
                <div className="p-4 space-y-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleCreateTopic(subject.id)
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={topicNames[subject.id] || ''}
                      onChange={(e) =>
                        setTopicNames((prev) => ({ ...prev, [subject.id]: e.target.value }))
                      }
                      placeholder="Topic name"
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                    />
                    <button
                      type="submit"
                      className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
                    >
                      Add Topic
                    </button>
                  </form>

                  {(topics[subject.id] || []).length === 0 ? (
                    <p className="text-sm text-gray-600">No topics yet. Add one above.</p>
                  ) : (
                    <ul className="space-y-2">
                      {[...(topics[subject.id] || [])]
                        .sort((a, b) => a.order_index - b.order_index)
                        .map((topic, idx, arr) => (
                          <li
                            key={topic.id}
                            className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 p-3"
                          >
                            <Link
                              to={`/subjects/${subject.id}/topics/${topic.id}`}
                              className="text-sm text-accent hover:underline"
                            >
                              {topic.name}
                            </Link>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => moveTopic(subject.id, topic, 'up')}
                                disabled={idx === 0}
                                className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                              >
                                Move up
                              </button>
                              <button
                                onClick={() => moveTopic(subject.id, topic, 'down')}
                                disabled={idx === arr.length - 1}
                                className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                              >
                                Move down
                              </button>
                              <button
                                onClick={() => deleteTopic(subject.id, topic.id)}
                                className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-100"
                              >
                                Delete
                              </button>
                            </div>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}