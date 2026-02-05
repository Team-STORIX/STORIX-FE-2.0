// src/components/preference/PreferenceList.tsx
'use client'

import Image from 'next/image'
import type { PreferenceWork } from './PreferenceProvider'
import { useFavoriteWork } from '@/hooks/favorite/useFavoriteWork'
import { usePreference } from './PreferenceProvider'

function PreferenceListRow({ w }: { w: PreferenceWork }) {
  const { onFavoriteAdded, onFavoriteRemoved } = usePreference()
  const { isFavorite, isMutating, toggleFavorite } = useFavoriteWork(w.id, {
    onAdded: onFavoriteAdded, // addMutation 성공만 카운트
    onRemoved: onFavoriteRemoved, // 취소하면 카운트에서 제외
  })

  return (
    <div className="flex items-start gap-3 py-4">
      <div className="relative w-15.5 h-21 rounded-md overflow-hidden shrink-0 bg-black/10">
        <Image src={w.imageSrc} alt={w.title} fill className="object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="body-1 text-black truncate w-full">{w.title}</div>
        {/* meta는 필요 없다고 했으니, 리스트에서 meta 노출 원치 않으면 이 줄은 지워도 됨 */}
        <div className="mt-1 body-2 text-gray-500 truncate w-full">
          {w.meta}
        </div>
        {w.ratingText ? (
          <div className="mt-1 caption-1 text-[var(--color-magenta-300)]">
            {w.ratingText}
          </div>
        ) : null}
      </div>

      {/* 우측 + 아이콘 (API 연동: 관심 상태에 따라 active/deactive) */}
      <div className="self-stretch flex items-center">
        <button
          type="button"
          className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
          aria-label={isFavorite ? '관심 해제' : '관심 추가'}
          onClick={() => toggleFavorite()}
          disabled={isMutating}
          onPointerDown={(e) => e.stopPropagation()} // (클릭 씹힘/드래그 가드)
        >
          <img
            src={
              isFavorite
                ? '/icons/icon-add-active.svg'
                : '/icons/icon-add-deactive.svg'
            }
            alt="추가"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  )
}

export default function PreferenceList({ items }: { items: PreferenceWork[] }) {
  return (
    <div className="flex flex-col">
      {items.map((w) => (
        <PreferenceListRow key={w.id} w={w} />
      ))}
    </div>
  )
}
