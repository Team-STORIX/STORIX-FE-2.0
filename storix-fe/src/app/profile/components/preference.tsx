// src/app/profile/components/preference.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import { useFavoritesStore } from '@/store/favorites.store'

export default function Preference() {
  const favoriteArtistIds = useFavoritesStore((s) => s.favoriteArtistIds)
  const favoriteWorkIds = useFavoritesStore((s) => s.favoriteWorkIds)

  // ✅ 더미 메타(나중에 API 붙이면 교체)
  const artistMeta = useMemo(
    () =>
      new Map<number, { id: number; name: string; image: string }>([
        [80, { id: 80, name: 'hi', image: '/profile/profile-default.svg' }],
        [88, { id: 88, name: '아지', image: '/profile/profile-default.svg' }],
        [101, { id: 101, name: '서말', image: '/profile/profile-default.svg' }],
        [102, { id: 102, name: '싱숑', image: '/profile/profile-default.svg' }],
        [
          103,
          { id: 103, name: '히어리', image: '/profile/profile-default.svg' },
        ],
      ]),
    [],
  )

  const workMeta = useMemo(
    () =>
      new Map<
        number,
        { id: number; title: string; author: string; image: string }
      >([
        [1, { id: 1, title: '상수리 나무 아래', author: '서말', image: '' }],
        [2, { id: 2, title: '전지적독자시점', author: '싱숑', image: '' }],
        [3, { id: 3, title: '재혼황후', author: '히어리', image: '' }],
        [4, { id: 4, title: '나 혼자만 레벨업', author: '추공', image: '' }],
        [5, { id: 5, title: '화산귀환', author: '비가', image: '' }],
        [6, { id: 6, title: '나노마신', author: '한중월야', image: '' }],
        [7, { id: 7, title: '여신강림', author: '야옹이', image: '' }],
        [8, { id: 8, title: '외모지상주의', author: '박태준', image: '' }],
        [9, { id: 9, title: '신의 탑', author: 'SIU', image: '' }],
        [10, { id: 10, title: '유미의 세포들', author: '이동건', image: '' }],
        [11, { id: 11, title: '고수', author: '문정후', image: '' }],
        [12, { id: 12, title: '달빛조각사', author: '남희성', image: '' }],
      ]),
    [],
  )

  const favoriteWritersCount = favoriteArtistIds.length
  const favoriteWorksCount = favoriteWorkIds.length

  const writers = useMemo(
    () =>
      favoriteArtistIds
        .map((id) => artistMeta.get(id))
        .filter(Boolean)
        .slice(0, 5),
    [favoriteArtistIds, artistMeta],
  )

  const works = useMemo(
    () =>
      favoriteWorkIds
        .map((id) => workMeta.get(id))
        .filter(Boolean)
        .slice(0, 4),
    [favoriteWorkIds, workMeta],
  )

  const hasWriters = favoriteWritersCount > 0
  const hasWorks = favoriteWorksCount > 0

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
          // ✅ 핵심: 중간 빠져도 왼쪽부터 채워 보이게
          <div className="flex mt-6 gap-[18px]">
            {writers.map((writer) => (
              <div key={writer!.id} className="flex flex-col items-center">
                <div className="w-[60px] h-[60px] rounded-full bg-[var(--color-gray-200)]" />
                <p className="mt-2 body-2 text-[var(--color-gray-500)]">
                  {writer!.name}
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
          // ✅ 핵심: 여기서도 왼쪽부터 채움
          <div className="flex mt-6 gap-[14px]">
            {works.map((work) => (
              <div key={work!.id} className="flex flex-col">
                <div
                  className="w-[87px] h-[116px] bg-[var(--color-gray-200)] rounded"
                  style={{ aspectRatio: '3/4' }}
                />
                <p className="mt-[7px] body-2 text-[var(--color-gray-900)] truncate w-[87px]">
                  {work!.title}
                </p>
                <p className="mt-[3px] caption-1 text-[var(--color-gray-400)] truncate w-[87px]">
                  {work!.author}
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
