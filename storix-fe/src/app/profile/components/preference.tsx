// src/app/profile/components/preference.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Preference() {
  // TODO: API 연동 후 실제 데이터로 대체
  const favoriteWritersCount = 20
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

  return (
    <div>
      {/* 관심 작가 */}
      <div className="px-4 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-[18px] font-semibold leading-[140%] text-[#100F0F]">
              관심 작가
            </h3>
            <span className="text-[18px] font-semibold leading-[140%] text-[#CECDCD]">
              {favoriteWritersCount}
            </span>
          </div>
          <Link
            href="/profile/writers"
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

        <div className="flex justify-between mt-6">
          {writers.map((writer) => (
            <div key={writer.id} className="flex flex-col items-center">
              <div className="w-[60px] h-[60px] rounded-full bg-[#E1E0E0]" />
              <p className="mt-2 text-[14px] font-medium leading-[140%] text-[#888787]">
                {writer.name}
              </p>
            </div>
          ))}
        </div>
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
            <h3 className="text-[18px] font-semibold leading-[140%] text-[#100F0F]">
              관심 작품
            </h3>
            <span className="text-[18px] font-semibold leading-[140%] text-[#CECDCD]">
              {favoriteWorksCount}
            </span>
          </div>
          <Link
            href="/profile/books"
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

        <div className="flex justify-between mt-6">
          {works.map((work) => (
            <div key={work.id} className="flex flex-col">
              <div
                className="w-[87px] h-[116px] bg-[#E1E0E0] rounded"
                style={{ aspectRatio: '3/4' }}
              />
              <p className="mt-[7px] text-[14px] font-medium leading-[140%] text-[#100F0F] overflow-hidden text-ellipsis whitespace-nowrap w-[87px]">
                {work.title}
              </p>
              <p className="mt-[3px] text-[12px] font-medium leading-[140%] text-[#A9A8A8] overflow-hidden text-ellipsis whitespace-nowrap w-[87px]">
                {work.author}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
