import { Outlet, Link } from '@tanstack/react-router'
import { useAuth } from '@/features/auth/api/auth-api'

export function Layout() {
  const { signOut } = useAuth()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              LearnOS
            </Link>
          </div>
          <nav className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Dashboard
            </Link>
            <Link
              to="/subjects"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Subjects
            </Link>
            <button
              onClick={() => signOut()}
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}