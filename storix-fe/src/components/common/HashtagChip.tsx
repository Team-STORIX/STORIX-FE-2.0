// src/components/common/HashtagChip.tsx
'use client'

type HashtagChipProps = {
  label: string
  onClick?: () => void
  className?: string
}

export default function HashtagChip({
  label,
  onClick,
  className = '',
}: HashtagChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-2 py-[6px] text-sm 
    ${className}`}
    >
      <span>{label}</span>
    </button>
  )
}
