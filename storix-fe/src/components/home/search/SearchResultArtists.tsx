// src/components/search/SearchResultArtists.tsx

'use client'

import Image from 'next/image'
import type { RefObject } from 'react'
import type { ArtistsSearchItem } from '@/api/search/search.schema'
import Warning from '@/components/common/Warining'

type Props = {
  artists: ArtistsSearchItem[]
  isFetching?: boolean
  loadMoreRef?: RefObject<HTMLDivElement | null>
}

export default function SearchResultArtists({
  artists,
  isFetching = false,
  loadMoreRef,
}: Props) {
  return (
    <section className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-semibold text-gray-700">작가</p>
        {isFetching && (
          <p className="text-[12px] font-medium text-gray-400">불러오는 중…</p>
        )}
      </div>

      {artists.length > 0 ? (
        <div className="flex flex-col">
          {artists.map((a) => (
            <div
              key={a.artistId}
              className="flex items-center gap-3 border-b border-gray-100 py-4"
            >
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-100">
                {a.profileUrl ? (
                  <Image
                    src={a.profileUrl}
                    alt={a.artistName}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                ) : null}
              </div>

              <p className="truncate text-[16px] font-semibold text-black">
                {a.artistName}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <Warning
          title="검색 결과가 없습니다"
          description="다른 키워드로 검색해보세요."
          className="mt-48"
        />
      )}

      {loadMoreRef ? <div ref={loadMoreRef} className="h-6 w-full" /> : null}
    </section>
  )
}
