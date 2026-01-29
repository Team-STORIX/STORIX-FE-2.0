// src/app/profile/components/hashtag.tsx
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { getPreferredHashtags } from '@/api/profile/readerHashtags.api'

export default function Hashtag() {
  const router = useRouter()
  const [ranks, setRanks] = useState<Record<number, string>>({})

  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        const data = await getPreferredHashtags()
        const withSharp = Object.fromEntries(
          Object.entries(data).map(([rank, keyword]) => [
            Number(rank),
            keyword ? `#${keyword}` : '',
          ]),
        )
        setRanks(withSharp)
      } catch {
        setRanks({})
      }
    }

    fetchHashtags()
  }, [])

  const hasAnyRank = useMemo(
    () => Object.values(ranks).some((v) => v?.trim().length > 0),
    [ranks],
  )

  return (
    <div className="px-4 py-8">
      <h2 className="heading-3 text-[var(--color-gray-900)] font-semibold">
        선호 해시태그
      </h2>

      <div className="mt-[56px] w-full h-[178px] relative">
        {!hasAnyRank ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="mt-[40px] heading-3 font-semibold text-[var(--color-gray-500)]">
              아직 선호 해시태그가 없어요...
            </p>

            <button
              type="button"
              onClick={() => router.push('/home/search')}
              className="mt-[12px] cursor-pointer hover:opacity-80 transition-opacity"
              aria-label="검색으로 이동"
            >
              <Image
                src="/profile/find-books.svg"
                alt="관심 작품 찾기"
                width={131}
                height={36}
              />
            </button>
          </div>
        ) : (
          <>
            {/* 4위 */}
            <p
              className="absolute body-1 text-[var(--color-gray-500)]"
              style={{ left: 205, top: 0, fontFamily: 'Pretendard' }}
            >
              {ranks[4] || ''}
            </p>

            {/* 3위 */}
            <p
              className="absolute heading-3 text-[var(--color-magenta-200)]"
              style={{ left: 90, top: 22.4, fontFamily: 'Pretendard' }}
            >
              {ranks[3] || ''}
            </p>

            {/* 1위 */}
            <p
              className="absolute heading-1 text-[var(--color-magenta-400)]"
              style={{ left: 138, top: 47.6, fontFamily: 'Pretendard' }}
            >
              {ranks[1] || ''}
            </p>

            {/* 2위 */}
            <p
              className="absolute heading-2 text-[var(--color-primary-main)]"
              style={{ left: 211, top: 81.2, fontFamily: 'Pretendard' }}
            >
              {ranks[2] || ''}
            </p>

            {/* 5위 */}
            <p
              className="absolute body-2 text-[var(--color-gray-400)]"
              style={{ left: 120, top: 109.2, fontFamily: 'Pretendard' }}
            >
              {ranks[5] || ''}
            </p>
          </>
        )}
      </div>
    </div>
  )
}
