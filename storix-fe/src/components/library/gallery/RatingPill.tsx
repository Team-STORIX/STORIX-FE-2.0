//src/components/library/gallery/RatingPill.tsx
'use client'

export default function RatingPill({ value }: { value: number }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-magenta-300 px-3 py-1">
      <span className="text-magenta-300">+</span>
      <span className="caption-1 text-magenta-300">{value.toFixed(1)}</span>
    </div>
  )
}
