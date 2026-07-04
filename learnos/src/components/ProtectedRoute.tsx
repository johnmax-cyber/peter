import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import type { User } from '@supabase/supabase-js'
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setReady(true)
    })
  }, [])

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">Loading…</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return <Outlet />
}