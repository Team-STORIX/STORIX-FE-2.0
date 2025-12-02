// src/components/common/HashtagList.tsx
'use client'

import HashtagChip from '@/components/common/HashtagChip'

export default function HashtagList() {
  const items = ['#로맨스', '#무협/사극', '#액션', '#로맨스판타지', '#금발남주']

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <HashtagChip key={item} label={item} />
      ))}
    </div>
  )
}
