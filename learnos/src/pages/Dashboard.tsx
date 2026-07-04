export default function Dashboard() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900">Day 1 streak</h2>
        <p className="mt-1 text-sm text-gray-600">
          Keep it up! Your streak increases each day you study.
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium text-gray-900">Your Subjects</h2>
        <p className="mt-2 text-sm text-gray-600">
          No subjects yet — create one to get started
        </p>
        <a
          href="/subjects"
          className="mt-4 inline-block rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
        >
          Create a subject
        </a>
      </div>
    </div>
  )
}