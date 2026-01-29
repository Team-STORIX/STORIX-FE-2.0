// src/components/preference/PreferenceList.tsx
'use client'

import Image from 'next/image'
import type { PreferenceWork } from './PreferenceProvider'

export default function PreferenceList({ items }: { items: PreferenceWork[] }) {
  return (
    <div className="flex flex-col">
      {items.map((w) => (
        <div key={w.id} className="flex items-start gap-3 py-4">
          <div className="relative w-15.5 h-21 rounded-md overflow-hidden shrink-0 bg-black/10">
            <Image
              src={w.imageSrc}
              alt={w.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="body-1 text-black truncate w-full">{w.title}</div>
            <div className="mt-1 body-2 text-gray-500 truncate w-full">
              {w.meta}
            </div>
            {w.ratingText ? (
              <div className="mt-1 caption-1 text-[var(--color-magenta-300)]">
                {w.ratingText}
              </div>
            ) : null}
          </div>

          {/* 우측 + 아이콘 자리(스샷 동일 위치). 실제 LikesClient가 아이콘 컴포넌트 쓰면 여기 교체 */}
          <div className="self-stretch flex items-center">
            <button
              type="button"
              className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
              aria-label="add"
              onClick={() => {}}
            >
              <img
                src="/icons/icon-add-deactive.svg"
                alt="추가"
                width={24}
                height={24}
              />
              {/* 선택 api 연동 후 활성화 아이콘으로 교체 
              <img
                src="/icons/icon-add-active.svg"
                alt="추가"
                width={24}
                height={24}
              />
              */}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
