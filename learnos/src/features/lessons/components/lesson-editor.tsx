import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const lessonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  duration: z.number().optional(),
  difficulty: z.number().min(1).max(5).optional(),
})

type LessonForm = z.infer<typeof lessonSchema>

export function LessonEditor() {
  const { register, handleSubmit } = useForm<LessonForm>({
    resolver: zodResolver(lessonSchema),
  })

  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm w-full rounded-md border p-3 min-h-[200px] focus:outline-none',
      },
    },
  })

  const onSubmit = (data: LessonForm) => {
    console.log({ ...data, content: editor?.getHTML() })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Lesson</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <input {...register('title')} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>

        <div>
          <label className="text-sm font-medium">Content (Rich Text)</label>
          <div className="mt-1">
            <EditorContent editor={editor} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Duration (minutes)</label>
            <input {...register('duration', { valueAsNumber: true })} type="number" className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label className="text-sm font-medium">Difficulty (1-5)</label>
            <input {...register('difficulty', { valueAsNumber: true })} type="number" min="1" max="5" className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
        </div>

        <button type="submit" className="rounded-md bg-primary px-4 py-2 text-primary-foreground">
          Save Lesson
        </button>
      </form>
    </div>
  )
}