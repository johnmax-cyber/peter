import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function ProgressDashboard() {
  const { data: lessons, isLoading: lessonsLoading } = useQuery({
    queryKey: ['completed-lessons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*, topic:topics(*, subject:subjects(*))')
        .eq('is_completed', true)
      if (error) throw error
      return data
    },
  })

  const { data: quizAttempts } = useQuery({
    queryKey: ['quiz-attempts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*, quiz:quizzes(*)')
        .order('completed_at', { ascending: false })
      if (error) throw error
      return data
    },
  })

  if (lessonsLoading) return <LoadingSpinner />

  const completionRate = lessons?.length ? lessons.length : 0
  const avgQuizScore = quizAttempts?.length
    ? quizAttempts.reduce((sum, a) => sum + (a.score ?? 0), 0) / quizAttempts.length
    : 0

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Progress</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold">Lessons Completed</h2>
          <p className="text-3xl font-bold">{completionRate}</p>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold">Avg Quiz Score</h2>
          <p className="text-3xl font-bold">{avgQuizScore.toFixed(1)}%</p>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold">Current Streak</h2>
          <p className="text-3xl font-bold">0 days</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Quiz Attempts</h2>
        <div className="space-y-2">
          {quizAttempts?.slice(0, 5).map((attempt) => (
            <div key={attempt.id} className="rounded-lg border p-4">
              <p className="font-medium">{(attempt as any).quiz?.title ?? 'Quiz'}</p>
              <p className="text-sm text-muted-foreground">
                Score: {attempt.score?.toFixed(1) ?? 'N/A'}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}