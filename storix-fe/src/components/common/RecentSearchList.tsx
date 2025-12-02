// src/components/common/RecentSearchList.tsx
'use client'

import { useState } from 'react'
import RecentSearchChip from '@/components/common/RecentSearchChip'

export default function RecentSearchList() {
  // 1) 최근 검색어를 state로 관리
  const [items, setItems] = useState<string[]>([
    '무림세가',
    '로맨스 판타지',
    '스릴러',
  ])

  // 2) 특정 검색어를 삭제하는 함수
  const handleRemove = (label: string) => {
    setItems((prev) => prev.filter((item) => item !== label))
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <RecentSearchChip
          key={item}
          label={item}
          onRemove={() => handleRemove(item)}
        />
      ))}
    </div>
  )
}
