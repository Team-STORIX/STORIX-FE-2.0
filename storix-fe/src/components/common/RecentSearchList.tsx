// src/components/common/RecentSearchList.tsx
'use client'

import RecentSearchChip from '@/components/common/RecentSearchChip'

type Props = {
  items: string[]
  onRemove?: (label: string) => void
  onSelect?: (label: string) => void
}

export default function RecentSearchList({ items, onRemove, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <RecentSearchChip
          key={item}
          label={item}
          onClick={() => onSelect?.(item)}
          onRemove={() => onRemove?.(item)}
        />
      ))}
    </div>
  )
}
