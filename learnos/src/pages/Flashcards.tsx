import { useEffect, useState, type FormEvent } from 'react'
import { supabase } from '../supabaseClient'
import type { User } from '@supabase/supabase-js'
import { Link, useParams } from 'react-router-dom'

type Flashcard = {
  id: number
  subject_id: number
  front_text: string
  back_text: string
  confidence_rating: number
  next_review_date: string | null
  created_at: string
}

export default function Flashcards() {
  const { subjectId } = useParams<{ subjectId: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null)
  const [frontText, setFrontText] = useState('')
  const [backText, setBackText] = useState('')

  const loadFlashcards = async () => {
    if (!subjectId) return
    setLoading(true)
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('subject_id', Number(subjectId))
      .order('created_at', { ascending: false })
    if (error) setError(error.message)
    else setFlashcards(data || [])
    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  useEffect(() => {
    if (!user || !subjectId) return
    loadFlashcards()
  }, [user, subjectId])

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()
    if (!user || !subjectId || !frontText.trim() || !backText.trim()) return

    const { error } = await supabase.from('flashcards').insert({
      subject_id: Number(subjectId),
      front_text: frontText.trim(),
      back_text: backText.trim(),
    })
    if (error) setError(error.message)
    else {
      setFrontText('')
      setBackText('')
      setShowForm(false)
      loadFlashcards()
    }
  }

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault()
    if (!editingCard || !frontText.trim() || !backText.trim()) return

    const { error } = await supabase
      .from('flashcards')
      .update({
        front_text: frontText.trim(),
        back_text: backText.trim(),
      })
      .eq('id', editingCard.id)

    if (error) setError(error.message)
    else {
      setFrontText('')
      setBackText('')
      setEditingCard(null)
      setShowForm(false)
      loadFlashcards()
    }
  }

  const handleDelete = async (cardId: number) => {
    if (!confirm('Delete this flashcard?')) return
    const { error } = await supabase.from('flashcards').delete().eq('id', cardId)
    if (error) setError(error.message)
    else loadFlashcards()
  }

  const startEdit = (card: Flashcard) => {
    setEditingCard(card)
    setFrontText(card.front_text)
    setBackText(card.back_text)
    setShowForm(true)
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Flashcards</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/subjects/${subjectId}/flashcards/review`}
            className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Review Cards
          </Link>
          <button
            onClick={() => {
              setEditingCard(null)
              setFrontText('')
              setBackText('')
              setShowForm(true)
            }}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
          >
            Add Card
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {showForm && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {editingCard ? 'Edit Flashcard' : 'Add Flashcard'}
          </h2>
          <form onSubmit={editingCard ? handleUpdate : handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Front</label>
              <textarea
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
                placeholder="Front text"
                required
                rows={2}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Back</label>
              <textarea
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
                placeholder="Back text"
                required
                rows={2}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
              >
                {editingCard ? 'Save' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingCard(null)
                  setFrontText('')
                  setBackText('')
                }}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading…</p>
      ) : flashcards.length === 0 ? (
        <p className="text-gray-600">No flashcards yet. Add one above.</p>
      ) : (
        <ul className="space-y-3">
          {flashcards.map((card) => (
            <li
              key={card.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-medium text-gray-900 flex-1">{card.front_text}</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => startEdit(card)}
                    className="rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-600">{card.back_text}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}