export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-gray-600">{title} — coming soon</p>
    </div>
  )
}