import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import type { User } from '@supabase/supabase-js'

type Profile = {
  id: string
  email: string | null
  role: string
  created_at: string
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [counts, setCounts] = useState({
    totalUsers: 0,
    totalSubjects: 0,
    totalQuizAttempts: 0,
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  useEffect(() => {
    if (!user) return
    loadData()
  }, [user])

  const loadData = async () => {
    setLoading(true)

    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (profilesError) {
      setError(profilesError.message)
      setLoading(false)
      return
    }

    setProfiles(profilesData || [])

    const { count: usersCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    const { count: subjectsCount } = await supabase
      .from('subjects')
      .select('*', { count: 'exact', head: true })

    const { count: attemptsCount } = await supabase
      .from('quiz_attempts')
      .select('*', { count: 'exact', head: true })

    setCounts({
      totalUsers: usersCount || 0,
      totalSubjects: subjectsCount || 0,
      totalQuizAttempts: attemptsCount || 0,
    })

    setLoading(false)
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm text-center">
            <p className="text-3xl font-bold text-accent">{counts.totalUsers}</p>
            <p className="text-sm text-gray-600">Total Users</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm text-center">
            <p className="text-3xl font-bold text-accent">{counts.totalSubjects}</p>
            <p className="text-sm text-gray-600">Total Subjects</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm text-center">
            <p className="text-3xl font-bold text-accent">{counts.totalQuizAttempts}</p>
            <p className="text-sm text-gray-600">Quiz Attempts</p>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading…</p>
      ) : profiles.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  Signup Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {profiles.map((profile) => (
                <tr key={profile.id}>
                  <td className="px-6 py-4 text-sm text-gray-900 break-all">{profile.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{profile.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}