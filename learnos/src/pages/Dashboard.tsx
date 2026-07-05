import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import type { User } from '@supabase/supabase-js'

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [subjectsCount, setSubjectsCount] = useState(0)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  useEffect(() => {
    if (!user) return
    supabase
      .from('subjects')
      .select('id', { count: 'exact' })
      .eq('user_id', user.id)
      .then(({ count }) => setSubjectsCount(count || 0))
  }, [user])

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900">Study Streak</h2>
        <p className="mt-1 text-sm text-gray-600">
          View your streak and weekly progress on the Progress page.
        </p>
        <a
          href="/progress"
          className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          View Progress
        </a>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900">Your Subjects</h2>
        <p className="mt-2 text-sm text-gray-600">
          {subjectsCount} subjects created
        </p>
        <a
          href="/subjects"
          className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Manage Subjects
        </a>
      </div>
    </div>
  )
}