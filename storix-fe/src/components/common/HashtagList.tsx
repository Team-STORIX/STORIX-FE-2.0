// src/components/common/HashtagList.tsx
'use client'

import HashtagChip from '@/components/common/HashtagChip'
import { useRecommendedHashtags } from '@/hooks/hashtag/useRecommendedHashtags' // ✅

type HashtagListProps = {
  items?: string[]
  onSelect?: (keyword: string) => void
  className?: string
}

export default function HashtagList({
  items,
  onSelect,
  className = '',
}: HashtagListProps) {
  const { data } = useRecommendedHashtags() // ✅
  const DUMMY_ITEMS = ['#로맨스', '#판타지', '#액션', '#드라마', '#힐링'] // ✅

  const resolvedItems =
    items && items.length > 0
      ? items
      : data && data.length > 0
        ? data.map((h) => h.name) // ✅
        : DUMMY_ITEMS // ✅

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {resolvedItems.map((item) => (
        <HashtagChip key={item} label={item} onClick={() => onSelect?.(item)} />
      ))}
    </div>
  )
}
