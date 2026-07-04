import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { FlashcardDeck, Flashcard } from '@/types/database'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SM2 } from '@/lib/sm2'

const flashcardSchema = z.object({
  front: z.string().min(1, 'Front content is required'),
  back: z.string().min(1, 'Back content is required'),
})

const deckSchema = z.object({
  name: z.string().min(1, 'Deck name is required'),
  description: z.string().optional(),
  cards: z.array(flashcardSchema).min(1, 'At least one card is required'),
})

type DeckForm = z.infer<typeof deckSchema>

export function FlashcardDeckBuilder() {
  const queryClient = useQueryClient()
  const [isAdding, setIsAdding] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DeckForm>({
    resolver: zodResolver(deckSchema),
    defaultValues: { cards: [{ front: '', back: '' }] },
  })

  const createDeck = useMutation({
    mutationFn: async (data: DeckForm) => {
      const { data: deck, error } = await supabase.from('flashcard_decks').insert({
        name: data.name,
        description: data.description,
        order: 0,
      }).select().single()
      if (error) throw error

      const cards = data.cards.map((c) => ({
        deck_id: deck.id,
        front: c.front,
        back: c.back,
        ease_factor: 2.5,
        interval: 0,
        repetitions: 0,
      }))

      const { error: cError } = await supabase.from('flashcards').insert(cards)
      if (cError) throw cError

      return deck
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcard-decks'] })
      setIsAdding(false)
      reset()
    },
  })

  const onSubmit = async (data: DeckForm) => {
    await createDeck.mutateAsync(data)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Flashcard Decks</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          Create Deck
        </button>
      </div>

      {isAdding && (
        <div className="rounded-lg border p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">New Deck</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input {...register('name')} className="mt-1 w-full rounded-md border px-3 py-2" />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium">Front</label>
              <textarea {...register('cards.0.front')} className="mt-1 w-full rounded-md border px-3 py-2" rows={3} />
            </div>

            <div>
              <label className="text-sm font-medium">Back</label>
              <textarea {...register('cards.0.back')} className="mt-1 w-full rounded-md border px-3 py-2" rows={3} />
            </div>

            <div className="flex gap-2">
              <button type="submit" disabled={isSubmitting} className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
                Create
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="rounded-md border px-4 py-2">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <p className="text-muted-foreground">No decks yet. Create one to get started.</p>
    </div>
  )
}

export function FlashcardReviewer({ deckId }: { deckId: string }) {
  const [showAnswer, setShowAnswer] = useState(false)
  const queryClient = useQueryClient()

  const { data: deck } = useQuery({
    queryKey: ['flashcard-deck', deckId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('flashcard_decks')
        .select('*, flashcards(*)')
        .eq('id', deckId)
        .single()
      if (error) throw error
      return data as FlashcardDeck & { flashcards: Flashcard[] }
    },
  })

  const updateReview = useMutation({
    mutationFn: async ({ cardId, easeFactor, interval, repetitions }: { 
      cardId: string
      easeFactor: number
      interval: number
      repetitions: number 
    }) => {
      const { error } = await supabase.from('flashcards').update({
        ease_factor: easeFactor,
        interval,
        repetitions: repetitions + 1,
      }).eq('id', cardId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flashcard-deck', deckId] })
    },
  })

  if (!deck?.flashcards?.length) return <LoadingSpinner />

  const card = deck.flashcards[0]

  const handleRating = (q: number) => {
    const { easeFactor, interval } = SM2.calculate(
      card.ease_factor,
      card.interval,
      q
    )
    updateReview.mutate({ cardId: card.id, easeFactor, interval, repetitions: card.repetitions })
    setShowAnswer(false)
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="rounded-lg border p-6 min-h-[200px]">
        <p className="text-lg font-medium">
          {showAnswer ? card.back : card.front}
        </p>
      </div>

      <div className="mt-4 flex justify-center gap-2">
        {!showAnswer ? (
          <button
            onClick={() => setShowAnswer(true)}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Show Answer
          </button>
        ) : (
          <>
            {[1, 2, 3, 4, 5].map((q) => (
              <button
                key={q}
                onClick={() => handleRating(q)}
                className="rounded-md border px-3 py-1 hover:bg-accent"
              >
                {q}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  )
}