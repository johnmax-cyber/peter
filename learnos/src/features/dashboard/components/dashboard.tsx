import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Subject } from '@/types/database'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function Dashboard() {
  const { data: subjects, isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase.from('subjects').select('*').order('order')
      if (error) throw error
      return data as Subject[]
    },
  })

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground mt-2">Your learning overview</p>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Active Subjects</h2>
        {subjects && subjects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {subjects.filter(s => !s.is_archived).map((subject) => (
              <a
                key={subject.id}
                href={`/subjects/${subject.id}/lessons`}
                className="block rounded-lg border p-4 hover:bg-accent"
              >
                <h3 className="font-medium">{subject.name}</h3>
                {subject.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {subject.description}
                  </p>
                )}
              </a>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No subjects yet. Create your first subject to get started.</p>
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <a
            href="/subjects"
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Manage Subjects
          </a>
          <a
            href="/quizzes"
            className="rounded-md border px-4 py-2 hover:bg-accent"
          >
            Take a Quiz
          </a>
          <a
            href="/flashcards"
            className="rounded-md border px-4 py-2 hover:bg-accent"
          >
            Review Flashcards
          </a>
        </div>
      </div>
    </div>
  )
}