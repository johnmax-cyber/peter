import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/subjects', label: 'Subjects' },
  { to: '/planner', label: 'Study Planner' },
  { to: '/progress', label: 'Progress' },
]

export default function Sidebar() {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()
          .then(({ data: profile }) => {
            setIsAdmin(profile?.role === 'admin')
          })
      }
    })
  }, [])

  return (
    <>
      <aside className="hidden w-56 flex-col border-r border-gray-200 bg-white md:flex">
        <nav className="flex-1 space-y-1 p-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm ${
                  isActive
                    ? 'bg-blue-50 text-accent font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm ${
                  isActive
                    ? 'bg-blue-50 text-accent font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              Admin
            </NavLink>
          )}
        </nav>
      </aside>
      <nav className="fixed inset-x-0 bottom-0 flex justify-around border-t border-gray-200 bg-white md:hidden">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex-1 py-2 text-center text-xs ${
                isActive ? 'text-accent font-medium' : 'text-gray-600'
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex-1 py-2 text-center text-xs ${
                isActive ? 'text-accent font-medium' : 'text-gray-600'
              }`
            }
          >
            Admin
          </NavLink>
        )}
      </nav>
    </>
  )
}