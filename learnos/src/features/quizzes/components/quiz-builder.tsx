import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Quiz, Question } from '@/types/database'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const questionSchema = z.object({
  type: z.enum(['multiple_choice', 'true_false', 'fill_blank', 'ordering']),
  content: z.string().min(1, 'Question content is required'),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
  explanation: z.string().optional(),
})

const quizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required'),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
})

type QuizForm = z.infer<typeof quizSchema>

export function QuizBuilder() {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<QuizForm>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      questions: [{ type: 'multiple_choice', content: '', correctAnswer: '', options: ['', ''] }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  })

  const createQuiz = useMutation({
    mutationFn: async (data: QuizForm) => {
      const { data: quiz, error } = await supabase.from('quizzes').insert({
        title: data.title,
        description: data.description,
      }).select().single()
      if (error) throw error

      const questions = data.questions.map((q, i) => ({
        quiz_id: quiz.id,
        type: q.type,
        content: q.content,
        options: q.options,
        correct_answer: q.correctAnswer,
        explanation: q.explanation,
        order: i,
      }))

      const { error: qError } = await supabase.from('questions').insert(questions)
      if (qError) throw qError

      return quiz
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] })
    },
  })

  const onSubmit = async (data: QuizForm) => {
    await createQuiz.mutateAsync(data)
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create Quiz</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="text-sm font-medium">Quiz Title</label>
          <input {...register('title')} className="mt-1 w-full rounded-md border px-3 py-2" />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea {...register('description')} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Questions</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Question {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-destructive hover:underline"
                >
                  Remove
                </button>
              </div>

              <div>
                <label className="text-sm">Type</label>
                <select
                  {...register(`questions.${index}.type`)}
                  className="mt-1 w-full rounded-md border px-3 py-2"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                  <option value="fill_blank">Fill in the Blank</option>
                  <option value="ordering">Ordering</option>
                </select>
              </div>

              <div>
                <label className="text-sm">Question</label>
                <textarea
                  {...register(`questions.${index}.content`)}
                  className="mt-1 w-full rounded-md border px-3 py-2"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm">Correct Answer</label>
                <input
                  {...register(`questions.${index}.correctAnswer`)}
                  className="mt-1 w-full rounded-md border px-3 py-2"
                />
              </div>

              <div>
                <label className="text-sm">Explanation (optional)</label>
                <textarea
                  {...register(`questions.${index}.explanation`)}
                  className="mt-1 w-full rounded-md border px-3 py-2"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ type: 'multiple_choice', content: '', correctAnswer: '', options: ['', ''] })}
            className="flex items-center gap-2 rounded-md border px-4 py-2"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          Create Quiz
        </button>
      </form>
    </div>
  )
}

export function QuizTaker({ quizId }: { quizId: string }) {
  const queryClient = useQueryClient()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  const { data: quiz } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quizzes')
        .select('*, questions(*)')
        .eq('id', quizId)
        .single()
      if (error) throw error
      return data as Quiz & { questions: Question[] }
    },
  })

  const submitAttempt = useMutation({
    mutationFn: async (finalScore: number) => {
      const { error } = await supabase.from('quiz_attempts').insert({
        quiz_id: quizId,
        score: finalScore,
        completed_at: new Date().toISOString(),
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts'] })
    },
  })

  if (!quiz) return <LoadingSpinner />

  const questions = quiz!.questions.sort((a: Question, b: Question) => a.order - b.order)
  const question = questions[currentQuestion]

  const handleAnswer = () => {
    if (!selectedAnswer) return
    if (selectedAnswer === question.correct_answer) {
      setScore(s => s + 1)
    }
    setShowExplanation(true)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      submitAttempt.mutate(Math.round((score / questions.length) * 100))
      setIsComplete(true)
    }
  }

  if (isComplete) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Quiz Complete!</h1>
        <p className="text-xl">Your score: {Math.round((score / questions.length) * 100)}%</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{quiz.title}</h1>
        <p className="text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <div className="rounded-lg border p-4 space-y-4">
        <p className="text-lg">{question.content}</p>

        <div className="space-y-2">
          {question.options?.map((option: string, i: number) => (
            <label key={i} className="flex items-center gap-2">
              <input
                type="radio"
                name="answer"
                value={option}
                checked={selectedAnswer === option}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={showExplanation}
              />
              <span>{option}</span>
            </label>
          )) ?? (
            <input
              type="text"
              value={selectedAnswer ?? ''}
              onChange={(e) => setSelectedAnswer(e.target.value)}
              disabled={showExplanation}
              className="w-full rounded-md border px-3 py-2"
            />
          )}
        </div>

        {showExplanation && (
          <div className="rounded-md bg-accent p-3">
            <p className="font-medium">Explanation:</p>
            <p>{question.explanation || 'No explanation provided.'}</p>
          </div>
        )}

        <div className="flex justify-end">
          {!showExplanation ? (
            <button
              onClick={handleAnswer}
              disabled={!selectedAnswer}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
              {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}