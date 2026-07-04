import {
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from './features/auth/api/auth-api'
import { useEffect } from 'react'
import { LoadingSpinner } from './components/ui/loading-spinner'
import { Layout } from './components/layout'
import { LoginForm } from './features/auth/components/login-form'
import { SignUpForm } from './features/auth/components/signup-form'
import { Dashboard } from './features/dashboard/components/dashboard'
import { SubjectsPage } from './features/subjects/components/subjects-page'
import { QuizBuilder } from './features/quizzes/components/quiz-builder'
import { FlashcardDeckBuilder } from './features/flashcards/components/flashcard-deck'
import { LessonEditor } from './features/lessons/components/lesson-editor'
import { StudyPlanner } from './features/planner/components/planner-page'
import { ProgressDashboard } from './features/progress/components/progress-dashboard'

const queryClient = new QueryClient()

function RootComponent() {
  const { initialize, isLoading } = useAuth()

  useEffect(() => {
    initialize()
  }, [initialize])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return <Outlet />
}

const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <LoginForm />,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: () => <LoginForm />,
})

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/signup',
  component: () => <SignUpForm />,
})

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => <Dashboard />,
})

const subjectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subjects',
  component: () => <SubjectsPage />,
})

const lessonsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/lessons',
  component: () => <LessonEditor />,
})

const quizzesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/quizzes',
  component: () => <QuizBuilder />,
})

const flashcardsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/flashcards',
  component: () => <FlashcardDeckBuilder />,
})

const plannerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/planner',
  component: () => <StudyPlanner />,
})

const progressRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/progress',
  component: () => <ProgressDashboard />,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  signupRoute,
  dashboardRoute,
  subjectsRoute,
  lessonsRoute,
  quizzesRoute,
  flashcardsRoute,
  plannerRoute,
  progressRoute,
])

const router = createRouter({
  routeTree,
  defaultComponent: () => <div className="flex min-h-screen items-center justify-center">Page not found</div>,
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}