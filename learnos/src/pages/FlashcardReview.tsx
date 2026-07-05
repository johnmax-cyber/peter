import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import type { User } from '@supabase/supabase-js'
import { useParams, Link } from 'react-router-dom'

type Flashcard = {
  id: number
  subject_id: number
  front_text: string
  back_text: string
  confidence_rating: number
  next_review_date: string | null
  created_at: string
}

type ReviewGrade = 'hard' | 'good' | 'easy'

function calculateNextReview(grade: ReviewGrade, currentRating: number): { rating: number; days: number } {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  switch (grade) {
    case 'hard':
      return { rating: Math.max(0, currentRating - 1), days: 1 }
    case 'good':
      return { rating: currentRating + 1, days: 3 }
    case 'easy':
      return { rating: currentRating + 2, days: 7 }
  }
}

export default function FlashcardReview() {
  const { subjectId } = useParams<{ subjectId: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [dueCards, setDueCards] = useState<Flashcard[]>([])
  const [allCards, setAllCards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)

  const loadCards = async () => {
    if (!subjectId) return
    setLoading(true)
    
    const today = new Date().toISOString().split('T')[0]
    
    const { data, error } = await supabase
      .from('flashcards')
      .select('*')
      .eq('subject_id', Number(subjectId))
      .order('created_at', { ascending: false })
    
    if (error) {
      setError(error.message)
    } else {
      const cards = data || []
      setAllCards(cards)
      
      const due = cards.filter(card => 
        !card.next_review_date || card.next_review_date <= today
      )
      setDueCards(due)
    }
    setLoading(false)
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  useEffect(() => {
    if (!user || !subjectId) return
    loadCards()
  }, [user, subjectId])

  const handleGrade = async (grade: ReviewGrade) => {
    if (!dueCards[currentIndex]) return

    const card = dueCards[currentIndex]
    const { rating, days } = calculateNextReview(grade, card.confidence_rating)

    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + days)

    const { error } = await supabase
      .from('flashcards')
      .update({
        confidence_rating: rating,
        next_review_date: nextReview.toISOString().split('T')[0],
      })
      .eq('id', card.id)

    if (!error && user) {
      const { error: reviewError } = await supabase.from('flashcard_reviews').insert({
        flashcard_id: card.id,
        user_id: user.id,
      })
      if (reviewError) setError(reviewError.message)
    }

    if (error) {
      setError(error.message)
    } else {
      if (currentIndex < dueCards.length - 1) {
        setCurrentIndex(currentIndex + 1)
        setShowBack(false)
      } else {
        setCurrentIndex(-1)
      }
    }
  }

  if (!user) return null

  if (loading) return <p className="text-gray-600">Loading…</p>

  const cardsToShow = dueCards.length > 0 ? dueCards : allCards
  const noCardsDue = dueCards.length === 0 && allCards.length > 0
  const noCardsAtAll = allCards.length === 0

  if (noCardsAtAll) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Flashcard Review</h1>
        <p className="text-gray-600">No flashcards in this subject yet.</p>
        <Link
          to={`/subjects/${subjectId}/flashcards`}
          className="text-sm text-accent hover:underline"
        >
          Add flashcards
        </Link>
      </div>
    )
  }

  if (currentIndex === -1) {
    return (
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">Flashcard Review</h1>
        <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center">
          <p className="text-lg text-green-800">All done for today!</p>
          <Link
            to={`/subjects/${subjectId}/flashcards`}
            className="mt-4 inline-block text-sm text-accent hover:underline"
          >
            Back to flashcards
          </Link>
        </div>
      </div>
    )
  }

  const card = cardsToShow[currentIndex]

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">Flashcard Review</h1>
        {noCardsDue && (
          <span className="text-sm text-gray-600">
            Showing all cards ({allCards.length})
          </span>
        )}
        {!noCardsDue && (
          <span className="text-sm text-gray-600">
            {currentIndex + 1} of {dueCards.length} due
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm min-h-64 flex flex-col">
        <div className="flex-1">
          {!showBack ? (
            <p className="text-lg text-gray-900">{card.front_text}</p>
          ) : (
            <p className="text-lg text-gray-900">{card.back_text}</p>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          {!showBack ? (
            <button
              onClick={() => setShowBack(true)}
              className="rounded-md bg-accent px-6 py-2 text-sm font-medium text-white hover:bg-accent-hover"
            >
              Flip
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => handleGrade('hard')}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Hard
              </button>
              <button
                onClick={() => handleGrade('good')}
                className="rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700"
              >
                Good
              </button>
              <button
                onClick={() => handleGrade('easy')}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Easy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}