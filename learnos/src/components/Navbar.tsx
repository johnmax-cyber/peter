import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null))
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4">
      <Link to="/dashboard" className="text-lg font-semibold text-gray-900">
        LearnOS
      </Link>
      <div className="flex items-center gap-3">
        {email && (
          <span className="hidden text-sm text-gray-600 sm:inline">{email}</span>
        )}
        <button
          onClick={handleLogout}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
        >
          Log out
        </button>
      </div>
    </header>
  )
}