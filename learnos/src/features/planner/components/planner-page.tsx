import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { StudySession } from '@/types/database'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const sessionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  scheduledStart: z.string().min(1, 'Start time is required'),
  scheduledEnd: z.string().min(1, 'End time is required'),
})

type SessionForm = z.infer<typeof sessionSchema>

export function StudyPlanner() {
  const [isAdding, setIsAdding] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SessionForm>({
    resolver: zodResolver(sessionSchema),
  })

  const { data: sessions, isLoading } = useQuery({
    queryKey: ['study-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .order('scheduled_start', { ascending: true })
      if (error) throw error
      return data as StudySession[]
    },
  })

  const createSession = useMutation({
    mutationFn: async (data: SessionForm) => {
      const { error } = await supabase.from('study_sessions').insert({
        title: data.title,
        description: data.description,
        scheduled_start: data.scheduledStart,
        scheduled_end: data.scheduledEnd,
        status: 'scheduled',
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['study-sessions'] })
      setIsAdding(false)
      reset()
    },
  })

  const queryClient = useQueryClient()

  const onSubmit = async (data: SessionForm) => {
    await createSession.mutateAsync(data)
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Study Planner</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground"
        >
          <Plus className="h-4 w-4" />
          Schedule Session
        </button>
      </div>

      {isAdding && (
        <div className="rounded-lg border p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">New Study Session</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input {...register('title')} className="mt-1 w-full rounded-md border px-3 py-2" />
              {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Time</label>
                <input {...register('scheduledStart')} type="datetime-local" className="mt-1 w-full rounded-md border px-3 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium">End Time</label>
                <input {...register('scheduledEnd')} type="datetime-local" className="mt-1 w-full rounded-md border px-3 py-2" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea {...register('description')} className="mt-1 w-full rounded-md border px-3 py-2" />
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

      <div className="space-y-4">
        {sessions?.map((session) => (
          <div key={session.id} className="rounded-lg border p-4">
            <h3 className="font-medium">{session.title}</h3>
            <p className="text-sm text-muted-foreground">
              {new Date(session.scheduled_start).toLocaleString()} - {new Date(session.scheduled_end).toLocaleString()}
            </p>
            {session.description && <p className="mt-2">{session.description}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}