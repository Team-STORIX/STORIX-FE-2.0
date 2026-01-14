// src/app/profile/components/preference.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Preference() {
  // TODO: API 연동 후 실제 데이터로 대체
  const favoriteWritersCount = 0
  const favoriteWorksCount = 15

  const writers = Array(5)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      name: '작가이름',
      image: '/profile/profile-default.svg',
    }))

  const works = Array(4)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      title: '제목',
      author: '작가',
      image: '',
    }))

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

          {/* ✅ 둘 다 /profile/likes로 연결 */}
          <Link
            href="/profile/likes?tab=writers"
            className="transition-opacity hover:opacity-70"
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
          <div className="flex justify-between mt-6">
            {writers.map((writer) => (
              <div key={writer.id} className="flex flex-col items-center">
                <div className="w-[60px] h-[60px] rounded-full bg-[var(--color-gray-200)]" />
                <p className="mt-2 body-2 text-[var(--color-gray-500)]">
                  {writer.name}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center">
            <p
              className="text-[18px] font-semibold leading-[140%] text-[var(--color-gray-500)]"
              style={{ fontFamily: 'Pretendard' }}
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

          {/* ✅ 둘 다 /profile/likes로 연결 */}
          <Link
            href="/profile/likes?tab=works"
            className="transition-opacity hover:opacity-70"
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
          <div className="flex justify-between mt-6">
            {works.map((work) => (
              <div key={work.id} className="flex flex-col">
                <div
                  className="w-[87px] h-[116px] bg-[var(--color-gray-200)] rounded"
                  style={{ aspectRatio: '3/4' }}
                />
                <p className="mt-[7px] body-2 text-[var(--color-gray-900)] overflow-hidden text-ellipsis whitespace-nowrap w-[87px]">
                  {work.title}
                </p>
                <p className="mt-[3px] caption-1 text-[var(--color-gray-400)] overflow-hidden text-ellipsis whitespace-nowrap w-[87px]">
                  {work.author}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center">
            <p
              className="text-[18px] font-semibold leading-[140%] text-[var(--color-gray-500)]"
              style={{ fontFamily: 'Pretendard' }}
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
