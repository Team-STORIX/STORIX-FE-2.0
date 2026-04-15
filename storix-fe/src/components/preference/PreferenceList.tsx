// src/components/preference/PreferenceList.tsx
'use client'

import Image from 'next/image'
import { useFavoriteWork } from '@/hooks/favorite/useFavoriteWork'
import type { PreferenceWork } from './PreferenceProvider'
import { usePreference } from './PreferenceProvider'

function PreferenceListRow({ w }: { w: PreferenceWork }) {
  const { onFavoriteAdded, onFavoriteRemoved } = usePreference()
  const { isFavorite, isMutating, toggleFavorite } = useFavoriteWork(w.id, {
    onAdded: onFavoriteAdded,
    onRemoved: onFavoriteRemoved,
  })

  const illustrator =
    w.originalAuthor && w.illustrator === w.originalAuthor ? '' : w.illustrator
  const workMeta = [w.originalAuthor, illustrator, w.worksType]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="border-bottom">
      <div className="flex items-start gap-3 py-3 px-4">
        <div className="relative w-15.5 h-21 rounded-md overflow-hidden shrink-0 bg-black/10">
          <Image src={w.imageSrc} alt={w.title} fill className="object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="body-1-semibold text-black truncate w-full">
            {w.title}
          </div>
          <div className="mt-1 body-2-medium text-gray-500 truncate w-full">
            {workMeta}
          </div>
          {w.ratingText ? (
            <div className="mt-1 caption-1-medium text-[var(--color-magenta-300)]">
              {w.ratingText}
            </div>
          ) : null}
        </div>

        <div className="self-stretch flex items-center">
          <button
            type="button"
            className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer"
            aria-label={isFavorite ? '관심 해제' : '관심 추가'}
            onClick={() => toggleFavorite()}
            disabled={isMutating}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <img
              src={
                isFavorite
                  ? '/common/icons/icon-add-active.svg'
                  : '/common/icons/icon-add-deactive.svg'
              }
              alt="추가"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PreferenceList({ items }: { items: PreferenceWork[] }) {
  return (
    <div className="flex flex-col -mx-4">
      {items.map((w) => (
        <PreferenceListRow key={w.id} w={w} />
      ))}
    </div>
  )
}
