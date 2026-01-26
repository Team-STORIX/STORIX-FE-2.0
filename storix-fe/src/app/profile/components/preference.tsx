// src/app/profile/components/preference.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  getReaderFavoriteArtists,
  getReaderFavoriteWorks,
} from '@/api/profile/readerFavorites.api'

type PreviewWriter = {
  id: number
  name: string
  imageUrl: string | null
}

type PreviewWork = {
  id: number
  title: string
  author: string
  imageUrl: string | null
}

const WRITER_LIMIT = 10
const WORK_LIMIT = 10

export default function Preference() {
  const [favoriteWritersCount, setFavoriteWritersCount] = useState(0)
  const [favoriteWorksCount, setFavoriteWorksCount] = useState(0)

  const [writersPreview, setWritersPreview] = useState<PreviewWriter[]>([])
  const [worksPreview, setWorksPreview] = useState<PreviewWork[]>([])

  const hasWriters = favoriteWritersCount > 0
  const hasWorks = favoriteWorksCount > 0

  useEffect(() => {
    let alive = true

    const run = async () => {
      try {
        const [artistsRes, worksRes] = await Promise.all([
          getReaderFavoriteArtists({ page: 0, sort: 'LATEST' }),
          getReaderFavoriteWorks({ page: 0, sort: 'LATEST' }),
        ])

        if (!alive) return

        setFavoriteWritersCount(artistsRes.totalFavoriteArtistCount ?? 0)
        setFavoriteWorksCount(worksRes.totalFavoriteWorksCount ?? 0)

        setWritersPreview(
          (artistsRes.result.content ?? []).slice(0, WRITER_LIMIT).map((a) => ({
            id: a.artistId,
            name: a.artistName,
            imageUrl: a.profileImageUrl ?? null,
          })),
        )

        setWorksPreview(
          (worksRes.result.content ?? []).slice(0, WORK_LIMIT).map((w) => ({
            id: w.worksId,
            title: w.worksName,
            author: w.artistName,
            imageUrl: w.thumbnailUrl ?? null,
          })),
        )
      } catch (e) {
        //console.error(e)
      }
    }

    run()
    return () => {
      alive = false
    }
  }, [])

  const writers = useMemo(
    () => writersPreview.slice(0, WRITER_LIMIT),
    [writersPreview],
  )
  const works = useMemo(() => worksPreview.slice(0, WORK_LIMIT), [worksPreview])

  // ✅ 작품은 4개만 “칸”에 보여주고, 부족하면 빈칸으로 채워서 간격 규칙 유지
  const worksForGrid = useMemo(() => works.slice(0, 4), [works])
  const emptySlots = useMemo(
    () => Math.max(0, 4 - worksForGrid.length),
    [worksForGrid.length],
  )

  return (
    <div>
      {/* 관심 작가 */}
      <div className="px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-[18px] font-semibold leading-[140%] text-[var(--color-gray-900)]">
              관심 작가
            </h3>
            <span className="text-[18px] font-semibold leading-[140%] text-[var(--color-gray-300)]">
              {favoriteWritersCount}
            </span>
          </div>

          <Link
            href="/profile/likes?tab=writers"
            className="transition-opacity hover:opacity-70 cursor-pointer"
          >
            <Image
              src="/icons/arrow-next.svg"
              alt="더보기"
              width={24}
              height={24}
            />
          </Link>
        </div>

        {hasWriters ? (
          // ✅ 좌우 스크롤 제거: 그냥 영역 안에서 보이는 만큼만
          <div className="flex mt-6 gap-[18px]">
            {writers.slice(0, 5).map((writer) => (
              <div key={writer.id} className="flex flex-col items-center">
                <div className="w-[60px] h-[60px] rounded-full bg-[var(--color-gray-200)] overflow-hidden relative">
                  {writer.imageUrl ? (
                    <Image
                      src={writer.imageUrl}
                      alt={writer.name}
                      fill
                      sizes="60px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <p className="mt-2 body-2 text-[var(--color-gray-500)] max-w-[60px] truncate text-center">
                  {writer.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center">
            <p
              className="text-[18px] font-semibold leading-[140%] text-[var(--color-gray-500)]"
              style={{ fontFamily: 'SUIT' }}
            >
              아직 관심 작가가 없어요...
            </p>
            <Link
              href="/home/search"
              className="mt-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Image
                src="/profile/find-writers.svg"
                alt="작가 찾기"
                width={131}
                height={36}
              />
            </Link>
          </div>
        )}
      </div>

      {/* 관심 작품 */}
      <div
        className="px-4 py-8"
        style={{
          borderBottom: '1px solid var(--color-gray-200)',
          backgroundColor: 'var(--color-white)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-[18px] font-semibold leading-[140%] text-[var(--color-gray-900)]">
              관심 작품
            </h3>
            <span className="text-[18px] font-semibold leading-[140%] text-[var(--color-gray-300)]">
              {favoriteWorksCount}
            </span>
          </div>

          <Link
            href="/profile/likes?tab=works"
            className="transition-opacity hover:opacity-70 cursor-pointer"
          >
            <Image
              src="/icons/arrow-next.svg"
              alt="더보기"
              width={24}
              height={24}
            />
          </Link>
        </div>

        {hasWorks ? (
          // ✅ 좁은 화면이면 가로 스크롤, 넓으면 그냥 4개가 다 보임
          <div className="mt-6 w-full">
            <div className="overflow-x-auto [-webkit-overflow-scrolling:touch]">
              {/* 스크롤바 숨기고 싶으면 아래 스타일 추가(선택) */}
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              {/* ✅ 내부는 '4칸' 기준 최소 너비를 유지 */}
              <div className="min-w-[361px]">
                <div className="flex justify-between w-full">
                  {/* 실제 작품 1~4개 */}
                  {worksForGrid.map((work) => (
                    <div key={work.id} className="flex flex-col shrink-0">
                      <div
                        className="w-[87px] h-[116px] bg-[var(--color-gray-200)] rounded overflow-hidden relative"
                        style={{ aspectRatio: '3/4' }}
                      >
                        {work.imageUrl ? (
                          <Image
                            src={work.imageUrl}
                            alt={work.title}
                            fill
                            sizes="87px"
                            className="object-cover"
                          />
                        ) : null}
                      </div>
                      <p className="mt-[7px] body-2 text-[var(--color-gray-900)] truncate w-[87px]">
                        {work.title}
                      </p>
                      <p className="mt-[3px] caption-1 text-[var(--color-gray-400)] truncate w-[87px]">
                        {work.author}
                      </p>
                    </div>
                  ))}

                  {/* ✅ 빈칸 슬롯(4칸 유지 → 간격 규칙 유지) */}
                  {Array.from({ length: emptySlots }).map((_, idx) => (
                    <div
                      key={`empty-${idx}`}
                      className="flex flex-col opacity-0 shrink-0"
                    >
                      <div className="w-[87px] h-[116px] rounded" />
                      <p className="mt-[7px] w-[87px]">.</p>
                      <p className="mt-[3px] w-[87px]">.</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center">
            <p
              className="text-[18px] font-semibold leading-[140%] text-[var(--color-gray-500)]"
              style={{ fontFamily: 'SUIT' }}
            >
              아직 관심 작품이 없어요...
            </p>
            <Link
              href="/home/search"
              className="mt-3 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <Image
                src="/profile/find-books.svg"
                alt="작품 찾기"
                width={131}
                height={36}
              />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
