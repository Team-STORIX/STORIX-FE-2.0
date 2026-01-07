// src/components/common/HashtagList.tsx
'use client'

import HashtagChip from '@/components/common/HashtagChip'

type HashtagListProps = {
  items: string[]
  onSelect?: (keyword: string) => void
  className?: string
}

export default function HashtagList({
  items,
  onSelect,
  className = '',
}: HashtagListProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <HashtagChip key={item} label={item} onClick={() => onSelect?.(item)} />
      ))}
    </div>
  )
}
