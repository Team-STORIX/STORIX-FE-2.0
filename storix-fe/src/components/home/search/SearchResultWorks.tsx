// src/components/home/search/SearchResultWorks.tsx
'use client'

import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import type { RefObject } from 'react'
import type { WorksSearchItem } from '@/lib/api/search/search.schema'
import Warning from '@/components/common/Warining'
import SearchFloatingButton from '@/components/home/search/SearchFloatingButton'

type Props = {
  works: WorksSearchItem[]
  isFetching?: boolean
  loadMoreRef?: RefObject<HTMLDivElement | null>
}

export default function SearchResultWorks({ works, loadMoreRef }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()
  const returnTo = encodeURIComponent(
    `${pathname}${sp.toString() ? `?${sp.toString()}` : ''}`,
  )
  const onClickWorks = (worksId: number) => {
    router.push(`/library/works?id=${worksId}&returnTo=${returnTo}`)
  }
  return (
    <section className="flex w-full flex-col gap-3">
      {works.length > 0 ? (
        <div className="flex flex-col">
          {works.map((w) => (
            <button
              key={w.worksId}
              type="button"
              onClick={() => onClickWorks(w.worksId)}
              className="flex w-full gap-4 border-b border-gray-100 p-4 hover:opacity-90 cursor-pointer text-left"
            >
              {/* 썸네일 */}
              <div className="relative h-29 w-[87px] shrink-0 overflow-hidden rounded-sm bg-gray-100 ">
                {w.thumbnailUrl ? (
                  <Image
                    src={w.thumbnailUrl}
                    alt={w.worksName}
                    fill
                    sizes="87px"
                    className="object-cover"
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
                  <span className="caption-1 text-[var(--color-magenta-300)]">
                    <Image
                      src="/common/icons/littleStar.svg"
                      alt="star icon"
                      width={9}
                      height={10}
                      className="inline-block mr-1 mb-0.5"
                    />
                    {Number(w.avgRating).toFixed(1)}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <Warning
          title="검색 결과가 없어요.."
          description="대신 이런 검색어는 어때요?"
          className="mt-48"
        />
      )}

      {loadMoreRef ? <div ref={loadMoreRef} className="h-6 w-full" /> : null}
      <SearchFloatingButton
        onClick={() =>
          window.open(
            'https://truth-gopher-09e.notion.site/2ede81f70948801bb0f4ecc8e76a6015',
          )
        }
      />
    </section>
  )
}
