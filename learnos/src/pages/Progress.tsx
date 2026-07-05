import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'
import type { User } from '@supabase/supabase-js'

type Subject = {
  id: number
  name: string
  created_at: string
}

type SubjectProgress = {
  id: number
  name: string
  lessonsCompleted: number
  lessonsTotal: number
  avgQuizScore: number | null
  flashcardsReviewed: number
}

function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-gray-200">
      <div
        className="h-2 rounded-full bg-accent"
        style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
      />
    </div>
  )
}

export default function Progress() {
  const [user, setUser] = useState<User | null>(null)
  const [progress, setProgress] = useState<SubjectProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  const [weeklyStudy, setWeeklyStudy] = useState({ count: 0, subjects: 0 })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  useEffect(() => {
    if (!user) return
    loadData()
  }, [user])

  const loadData = async () => {
    setLoading(true)
    setError(null)

    const { data: subjectsData, error: subjectsError } = await supabase
      .from('subjects')
      .select('*')
      .order('created_at', { ascending: false })

    if (subjectsError) {
      setError(subjectsError.message)
      setLoading(false)
      return
    }

    const subjects = subjectsData || []

    const progressData: SubjectProgress[] = []

    for (const subject of subjects) {
      const { data: topicsData } = await supabase
        .from('topics')
        .select('id')
        .eq('subject_id', subject.id)

      const topicIds = topicsData?.map((t: any) => t.id) || []

      let lessonsTotal = 0
      let completedCount = 0

      if (topicIds.length > 0) {
        const { data: lessonsData, count: lessonsCount } = await supabase
          .from('lessons')
          .select('completed', { count: 'exact' })
          .in('topic_id', topicIds)

        lessonsTotal = lessonsCount || 0
        completedCount = lessonsData?.filter((l: any) => l.completed).length || 0
      }

      const progressEntry: SubjectProgress = {
        id: subject.id,
        name: subject.name,
        lessonsCompleted: completedCount,
        lessonsTotal,
        avgQuizScore: null,
        flashcardsReviewed: 0,
      }
      progressData.push(progressEntry)

      if (topicIds.length > 0 && user) {
        const { data: quizzesData } = await supabase
          .from('quizzes')
          .select('id')
          .in('topic_id', topicIds)

        const quizIds = quizzesData?.map((q: any) => q.id) || []

        if (quizIds.length > 0) {
          const { data: attemptsData } = await supabase
            .from('quiz_attempts')
            .select('score')
            .eq('user_id', user.id)
            .in('quiz_id', quizIds)

          const quizScores = attemptsData?.map((a: any) => a.score) || []
          progressEntry.avgQuizScore = quizScores.length > 0
            ? Math.round(quizScores.reduce((sum: number, s: number) => sum + s, 0) / quizScores.length)
            : null
        }

        const { data: flashcardsData } = await supabase
          .from('flashcards')
          .select('id')
          .eq('subject_id', subject.id)

        const flashcardIds = flashcardsData?.map((f: any) => f.id) || []

        if (flashcardIds.length > 0) {
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)

          const { count: reviewCount } = await supabase
            .from('flashcard_reviews')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id)
            .in('flashcard_id', flashcardIds)
            .gte('reviewed_at', weekAgo.toISOString())

          progressEntry.flashcardsReviewed = reviewCount || 0
        }
      }
    }

    setProgress(progressData)

    await calculateStreakAndWeekly(user!.id, subjects)
    setLoading(false)
  }

  const calculateStreakAndWeekly = async (userId: string, subjects: Subject[]) => {
    const topicIds: number[] = []

    for (const subject of subjects) {
      const { data: topicsData } = await supabase
        .from('topics')
        .select('id')
        .eq('subject_id', subject.id)
      topicIds.push(...(topicsData?.map((t: any) => t.id) || []))
    }

    const { data: attemptsData } = await supabase
      .from('quiz_attempts')
      .select('taken_at')
      .eq('user_id', userId)

    const { data: reviewsData } = await supabase
      .from('flashcard_reviews')
      .select('reviewed_at, flashcard:flashcards(subject_id)')
      .eq('user_id', userId)

    const activityDates = new Set<string>()

    attemptsData?.forEach((a: any) => {
      const d = new Date(a.taken_at).toISOString().split('T')[0]
      activityDates.add(d)
    })

    reviewsData?.forEach((r: any) => {
      const d = new Date(r.reviewed_at).toISOString().split('T')[0]
      activityDates.add(d)
    })

    const sortedDates = Array.from(activityDates).sort().reverse()
    let streak = 0
    const today = new Date().toISOString().split('T')[0]

    if (sortedDates.length > 0 && sortedDates[0] === today) {
      streak = 1
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = new Date(today)
        prevDate.setDate(prevDate.getDate() - i)
        const expectedDate = prevDate.toISOString().split('T')[0]
        if (sortedDates.some(d => d === expectedDate)) {
          streak++
        } else {
          break
        }
      }
    }

    setStreak(streak)

    const weekActivities = new Set<string>()
    const weekSubjects = new Set<number>()

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    attemptsData?.forEach((a: any) => {
      if (new Date(a.taken_at) >= oneWeekAgo) {
        const d = new Date(a.taken_at).toISOString().split('T')[0]
        weekActivities.add(d)
      }
    })

    reviewsData?.forEach((r: any) => {
      if (new Date(r.reviewed_at) >= oneWeekAgo) {
        const d = new Date(r.reviewed_at).toISOString().split('T')[0]
        weekActivities.add(d)
        if (r.flashcard?.subject_id) {
          weekSubjects.add(r.flashcard.subject_id)
        }
      }
    })

    if (topicIds.length > 0) {
      const { data: lessonsCompleted } = await supabase
        .from('lessons')
        .select('id')
        .in('topic_id', topicIds)
        .eq('completed', true)

      if (lessonsCompleted && lessonsCompleted.length > 0) {
        weekActivities.add(today)
      }
    }

    setWeeklyStudy({
      count: weekActivities.size,
      subjects: weekSubjects.size,
    })
  }

  if (!user) return null

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Progress</h1>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {!loading && progress.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Streak</h2>
            <span className="text-3xl font-bold text-accent">{streak}</span>
          </div>
          <p className="text-sm text-gray-600 break-words">
            You studied {weeklyStudy.count} times this week across {weeklyStudy.subjects} subjects.
          </p>
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading…</p>
      ) : progress.length === 0 ? (
        <p className="text-gray-600">No subjects yet. Add some to start tracking progress.</p>
      ) : (
        <div className="space-y-4">
          {progress.map((p) => (
            <div
              key={p.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">{p.name}</h3>

              <div className="mb-4">
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-600">Lessons Completed</span>
                  <span className="text-gray-900">
                    {p.lessonsTotal > 0 ? `${p.lessonsCompleted} / ${p.lessonsTotal}` : '0 / 0'}
                  </span>
                </div>
                <ProgressBar percentage={p.lessonsTotal > 0 ? (p.lessonsCompleted / p.lessonsTotal) * 100 : 0} />
              </div>

              <div className="mb-4">
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-600">Average Quiz Score</span>
                  <span className="text-gray-900">
                    {p.avgQuizScore !== null ? `${p.avgQuizScore}%` : 'No attempts'}
                  </span>
                </div>
                <ProgressBar percentage={p.avgQuizScore ?? 0} />
              </div>

              <div className="mb-4">
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-gray-600">Flashcards Reviewed (This Week)</span>
                  <span className="text-gray-900">{p.flashcardsReviewed}</span>
                </div>
                <ProgressBar percentage={Math.min(100, p.flashcardsReviewed * 10)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}