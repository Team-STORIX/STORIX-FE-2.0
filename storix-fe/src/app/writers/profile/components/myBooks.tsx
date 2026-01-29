// src/app/writers/profile/components/myBooks.tsx
'use client'

import Image from 'next/image'

type MyWork = {
  id: number
  title: string
  author: string
  image?: string
}

export default function MyBooks() {
  // TODO: API 연동 후 실제 데이터로 대체
  const myWorksCount = 0

  const works: MyWork[] = Array(4)
    .fill(null)
    .map((_, i) => ({
      id: i + 1,
      title: '제목',
      author: '작가',
      image: '',
    }))

  const hasWorks = myWorksCount > 0

  return (
    <div
      className="px-4 py-8 bg-white"
      style={{
        borderBottom: '1px solid var(--gray-200, #E1E0E0)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-[18px] font-semibold leading-[140%] text-[var(--color-gray-900)]">
            내 작품
          </h3>
          <span className="text-[18px] font-semibold leading-[140%] text-[var(--color-gray-300)]">
            {myWorksCount}
          </span>
        </div>

        {/*   arrow는 보여주되, 클릭 비활성(요구사항) */}
        <button
          type="button"
          className="opacity-60 cursor-not-allowed"
          aria-label="더보기"
          disabled
        >
          <Image
            src="/icons/arrow-next.svg"
            alt="더보기"
            width={24}
            height={24}
          />
        </button>
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
          <p className="text-[18px] font-semibold leading-[140%] text-[var(--color-gray-500)]">
            아직 작품이 없습니다
          </p>
        </div>
      )}
    </div>
  )
}
