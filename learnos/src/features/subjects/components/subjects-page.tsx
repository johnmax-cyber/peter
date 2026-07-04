import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { Subject } from '@/types/database'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'

const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  description: z.string().optional(),
  color: z.string().optional(),
})

type SubjectForm = z.infer<typeof subjectSchema>

function SortableSubject({ subject }: { subject: Subject }) {
  return (
    <div className="rounded-lg border p-4 cursor-move hover:bg-accent">
      <h3 className="font-medium">{subject.name}</h3>
      {subject.description && (
        <p className="text-sm text-muted-foreground mt-1">
          {subject.description}
        </p>
      )}
    </div>
  )
}

export function SubjectsPage() {
  const queryClient = useQueryClient()
  const [isAdding, setIsAdding] = useState(false)

  const { data: subjects, isLoading } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase.from('subjects').select('*').order('order')
      if (error) throw error
      return data as Subject[]
    },
  })

  const createSubject = useMutation({
    mutationFn: async (data: SubjectForm) => {
      const maxOrder = subjects?.reduce((max, s) => Math.max(max, s.order), 0) ?? 0
      const { data: result, error } = await supabase.from('subjects').insert({
        ...data,
        order: maxOrder + 1,
      }).select().single()
      if (error) throw error
      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      setIsAdding(false)
    },
  })

  const updateOrder = useMutation({
    mutationFn: async (updatedSubjects: Subject[]) => {
      const updates = updatedSubjects.map((s, i) => ({
        id: s.id,
        order: i,
      }))
      const { error } = await supabase.from('subjects').upsert(updates)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubjectForm>({
    resolver: zodResolver(subjectSchema),
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = subjects?.findIndex(s => s.id === active.id) ?? -1
      const newIndex = subjects?.findIndex(s => s.id === over.id) ?? -1
      if (subjects && oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(subjects, oldIndex, newIndex)
        updateOrder.mutate(newOrder)
      }
    }
  }

  const onSubmit = async (data: SubjectForm) => {
    await createSubject.mutateAsync(data)
    reset()
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Subjects</h1>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Add Subject
        </button>
      </div>

      {isAdding && (
        <div className="mb-6 rounded-lg border p-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                {...register('name')}
                className="mt-1 w-full rounded-md border px-3 py-2"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                {...register('description')}
                className="mt-1 w-full rounded-md border px-3 py-2"
                disabled={isSubmitting}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="rounded-md border px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={subjects?.map(s => s.id) ?? []}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {subjects?.map((subject) => (
              <SortableSubject key={subject.id} subject={subject} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}