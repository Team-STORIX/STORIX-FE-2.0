'use client'

import Image from 'next/image'
import type { RefObject } from 'react'
import type { WorksSearchItem } from '@/api/search/search.schema'

type Props = {
  works: WorksSearchItem[]
  isFetching?: boolean
  loadMoreRef?: RefObject<HTMLDivElement | null>
  emptyText?: string
}

export default function SearchResultWorks({
  works,
  isFetching = false,
  loadMoreRef,
  emptyText = '작품 검색 결과가 없어요.',
}: Props) {
  return (
    <section className="flex w-full flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[14px] font-semibold text-gray-700">작품</p>
        {isFetching && (
          <p className="text-[12px] font-medium text-gray-400">불러오는 중…</p>
        )}
      </div>

      {works.length > 0 ? (
        <div className="flex flex-col">
          {works.map((w) => (
            <div
              key={w.worksId}
              className="flex gap-4 border-b border-gray-100 py-5"
            >
              {/* 썸네일 */}
              <div className="relative h-[96px] w-[96px] shrink-0 overflow-hidden rounded-xl bg-gray-100">
                {w.thumbnailUrl ? (
                  <Image
                    src={w.thumbnailUrl}
                    alt={w.worksName}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : null}
              </div>

              {/* 텍스트 */}
              <div className="flex min-w-0 flex-1 flex-col justify-center gap-2">
                <p className="truncate text-[20px] font-extrabold leading-[28px] text-black">
                  {w.worksName}
                </p>

                <p className="truncate text-[16px] font-semibold leading-[22px] text-gray-500">
                  {w.artistName}
                  <span className="mx-2 text-gray-300">·</span>
                  {w.worksType}
                </p>

                <div className="flex items-center gap-2">
                  <span className="text-[16px] font-extrabold text-pink-500">
                    ✦ {Number(w.avgRating).toFixed(1)}
                    <span className="font-semibold text-pink-500">
                      ({w.reviewsCount})
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-[12px] font-medium text-gray-400">{emptyText}</p>
      )}

      {loadMoreRef ? <div ref={loadMoreRef} className="h-6 w-full" /> : null}
    </section>
  )
}
