// src/components/preference/PreferenceList.tsx
'use client'

import Image from 'next/image'
import type { PreferenceWork } from './PreferenceProvider'

export default function PreferenceList({ items }: { items: PreferenceWork[] }) {
  return (
    <div className="flex flex-col">
      {items.map((w) => (
        <div key={w.id} className="flex items-start gap-3 py-4">
          <div className="relative w-[44px] h-[60px] rounded-md overflow-hidden shrink-0 bg-black/10">
            <Image
              src={w.imageSrc}
              alt={w.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="body-2 font-semibold text-black truncate w-full">
              {w.title}
            </div>
            <div className="mt-1 text-xs text-black/60 truncate w-full">
              {w.meta}
            </div>
            {w.ratingText ? (
              <div className="mt-1 text-xs text-[var(--color-magenta-300)]">
                {w.ratingText}
              </div>
            ) : null}
          </div>

          {/* 우측 + 아이콘 자리(스샷 동일 위치). 실제 LikesClient가 아이콘 컴포넌트 쓰면 여기 교체 */}
          <button
            type="button"
            className="w-6 h-6 rounded-full border border-black/10 flex items-center justify-center text-black/40"
            aria-label="add"
            onClick={() => {}}
          >
            +
          </button>
        </div>
      ))}
    </div>
  )
}
