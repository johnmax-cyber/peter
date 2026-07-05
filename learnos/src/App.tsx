import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Subjects = lazy(() => import('./pages/Subjects'))
const TopicLessons = lazy(() => import('./pages/TopicLessons'))
const LessonEditor = lazy(() => import('./pages/LessonEditor'))
const QuizBuilder = lazy(() => import('./pages/QuizBuilder'))
const QuizTake = lazy(() => import('./pages/QuizTake'))
const Planner = lazy(() => import('./pages/Planner'))
const Progress = lazy(() => import('./pages/Progress'))
const Flashcards = lazy(() => import('./pages/Flashcards'))
const FlashcardReview = lazy(() => import('./pages/FlashcardReview'))
const Admin = lazy(() => import('./pages/Admin'))

function Fallback() {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-gray-600">Loading…</p>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<Fallback />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path="/subjects"
            element={
              <Suspense fallback={<Fallback />}>
                <Subjects />
              </Suspense>
            }
          />
          <Route
            path="/subjects/:subjectId/flashcards"
            element={
              <Suspense fallback={<Fallback />}>
                <Flashcards />
              </Suspense>
            }
          />
          <Route
            path="/subjects/:subjectId/flashcards/review"
            element={
              <Suspense fallback={<Fallback />}>
                <FlashcardReview />
              </Suspense>
            }
          />
          <Route
            path="/subjects/:subjectId/topics/:topicId"
            element={
              <Suspense fallback={<Fallback />}>
                <TopicLessons />
              </Suspense>
            }
          />
          <Route
            path="/subjects/:subjectId/topics/:topicId/lessons/new"
            element={
              <Suspense fallback={<Fallback />}>
                <LessonEditor />
              </Suspense>
            }
          />
          <Route
            path="/subjects/:subjectId/topics/:topicId/lessons/:lessonId"
            element={
              <Suspense fallback={<Fallback />}>
                <LessonEditor />
              </Suspense>
            }
          />
          <Route
            path="/subjects/:subjectId/topics/:topicId/quizzes/new"
            element={
              <Suspense fallback={<Fallback />}>
                <QuizBuilder />
              </Suspense>
            }
          />
          <Route
            path="/subjects/:subjectId/topics/:topicId/quizzes/:quizId"
            element={
              <Suspense fallback={<Fallback />}>
                <QuizBuilder />
              </Suspense>
            }
          />
          <Route
            path="/subjects/:subjectId/topics/:topicId/quizzes/:quizId/take"
            element={
              <Suspense fallback={<Fallback />}>
                <QuizTake />
              </Suspense>
            }
          />
          <Route
            path="/planner"
            element={
              <Suspense fallback={<Fallback />}>
                <Planner />
              </Suspense>
            }
          />
          <Route
            path="/progress"
            element={
              <Suspense fallback={<Fallback />}>
                <Progress />
              </Suspense>
            }
          />
          <Route element={<AdminRoute />}>
            <Route
              path="/admin"
              element={
                <Suspense fallback={<Fallback />}>
                  <Admin />
                </Suspense>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}