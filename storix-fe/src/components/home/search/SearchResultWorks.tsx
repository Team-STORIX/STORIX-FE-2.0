'use client'

import Image from 'next/image'
import type { RefObject } from 'react'
import type { WorksSearchItem } from '@/api/search/search.schema'
import Warning from '@/components/common/Warining'

type Props = {
  works: WorksSearchItem[]
  isFetching?: boolean
  loadMoreRef?: RefObject<HTMLDivElement | null>
}

export default function SearchResultWorks({
  works,
  isFetching = false,
  loadMoreRef,
}: Props) {
  return (
    <section className="flex w-full flex-col gap-3">
      {works.length > 0 ? (
        <div className="flex flex-col">
          {works.map((w) => (
            <div
              key={w.worksId}
              className="flex gap-4 border-b border-gray-100 p-4"
            >
              {/* 썸네일 */}
              <div className="relative h-[116px] w-[87px] shrink-0 overflow-hidden rounded-sm bg-gray-100">
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
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="truncate body-1 text-black">{w.worksName}</p>

                <p className="truncate body-2 text-gray-500">
                  {w.artistName}
                  <span className="mx-2 text-gray-300">·</span>
                  {w.worksType}
                </p>

                <div className="flex items-center gap-2">
                  <span className="caption-1 font-extrabold text-pink-500">
                    <Image
                      src="/search/littleStar.svg"
                      alt="star icon"
                      width={9}
                      height={10}
                      className="w-[9px] h-[10px] inline-block mr-1 mb-0.5"
                      priority
                    />
                    {Number(w.avgRating).toFixed(1)}
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
