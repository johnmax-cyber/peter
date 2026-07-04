import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import Subjects from './pages/Subjects'
import TopicLessons from './pages/TopicLessons'
import LessonEditor from './pages/LessonEditor'
import QuizBuilder from './pages/QuizBuilder'
import QuizTake from './pages/QuizTake'
import Planner from './pages/Planner'
import Progress from './pages/Progress'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subjects" element={<Subjects />} />
          <Route path="/subjects/:subjectId/topics/:topicId" element={<TopicLessons />} />
          <Route path="/subjects/:subjectId/topics/:topicId/lessons/new" element={<LessonEditor />} />
          <Route path="/subjects/:subjectId/topics/:topicId/lessons/:lessonId" element={<LessonEditor />} />
          <Route path="/subjects/:subjectId/topics/:topicId/quizzes/new" element={<QuizBuilder />} />
          <Route path="/subjects/:subjectId/topics/:topicId/quizzes/:quizId" element={<QuizBuilder />} />
          <Route path="/subjects/:subjectId/topics/:topicId/quizzes/:quizId/take" element={<QuizTake />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/progress" element={<Progress />} />
        </Route>
      </Route>
    </Routes>
  )
}