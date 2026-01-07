// src/components/common/RecentSearchChip.tsx
'use client'

type RecentSearchChipProps = {
  label: string
  onRemove?: () => void
  className?: string
}

export default function RecentSearchChip({
  label,
  onRemove,
  className = '',
}: RecentSearchChipProps) {
  return (
    <div
      className={`inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-2 py-1.5 body-2 ${className}`}
    >
      <span>{label}</span>

      <button
        type="button"
        aria-label="최근 검색어 삭제"
        onClick={onRemove}
        className="ml-1 flex h-4 w-4 items-center justify-center"
      >
        <CloseIcon />
      </button>
    </div>
  )
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="9"
      height="9"
      viewBox="0 0 9 9"
      fill="none"
    >
      <path
        d="M0.993098 8.65771L0 7.67134L3.34736 4.31726L0 0.986373L0.993098 0L4.34045 3.34504L7.66462 0L8.65771 0.986373L5.31036 4.31726L8.65771 7.67134L7.66462 8.65771L4.34045 5.31268L0.993098 8.65771Z"
        fill="#100F0F"
      />
    </svg>
  )
}
