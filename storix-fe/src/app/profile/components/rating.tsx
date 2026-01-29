'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  getReaderRatings,
  type RatingCountsMap,
} from '@/api/profile/readerRatings.api'

const RATING_STEPS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const
const MAX_HEIGHT = 120

function toRatingKey(r: number) {
  return String(r)
}

function parseCountsToStepMap(raw: RatingCountsMap): Record<number, number> {
  const parsed: Record<number, number> = {}

  for (const [k, v] of Object.entries(raw ?? {})) {
    let key = k.trim()
    key = key.replace(/_/g, '.')

    const match = key.match(/(\d+(\.\d+)?)/g)
    const numStr = match ? match[match.length - 1] : key

    const rating = Number.parseFloat(numStr)
    if (!Number.isNaN(rating)) {
      parsed[rating] =
        (parsed[rating] ?? 0) + (Number.isFinite(v) ? Number(v) : 0)
    }
  }

  const stepMap: Record<number, number> = {}
  for (const r of RATING_STEPS) stepMap[r] = parsed[r] ?? 0
  return stepMap
}

function formatRating(r: number) {
  return Number.isInteger(r) ? String(r) : String(r)
}

export default function Rating() {
  const router = useRouter()
  const [countsRaw, setCountsRaw] = useState<RatingCountsMap | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true

    const run = async () => {
      try {
        setError(null)
        const data = await getReaderRatings()
        if (!alive) return
        setCountsRaw(data?.result?.ratingCounts ?? {})
      } catch {
        if (!alive) return
        setCountsRaw({})
        setError('별점 분포를 불러오지 못했어요.')
      }
    }

    run()
    return () => {
      alive = false
    }
  }, [])

  const stepCounts = useMemo(
    () => parseCountsToStepMap(countsRaw ?? {}),
    [countsRaw],
  )

  const ratingData = useMemo(() => {
    return RATING_STEPS.map((rating) => ({
      rating,
      count: stepCounts[rating] ?? 0,
      key: toRatingKey(rating),
    }))
  }, [stepCounts])

  const maxCount = useMemo(() => {
    const m = Math.max(...ratingData.map((x) => x.count))
    return Number.isFinite(m) ? m : 0
  }, [ratingData])

  const getBarHeight = (count: number) => {
    if (count === 0) return 1
    if (maxCount <= 0) return 1
    return (count / maxCount) * MAX_HEIGHT
  }

  const totalReviews = useMemo(
    () => ratingData.reduce((acc, cur) => acc + cur.count, 0),
    [ratingData],
  )

  const averageRating = useMemo(() => {
    if (totalReviews === 0) return 0
    const sum = ratingData.reduce((acc, cur) => acc + cur.rating * cur.count, 0)
    return Math.round((sum / totalReviews) * 10) / 10
  }, [ratingData, totalReviews])

  const mostGivenRating = useMemo(() => {
    if (totalReviews === 0) return 0
    const max = maxCount
    if (max <= 0) return 0
    const candidates = ratingData
      .filter((x) => x.count === max)
      .map((x) => x.rating)
    return candidates.length ? Math.max(...candidates) : 0
  }, [ratingData, maxCount, totalReviews])

  return (
    <div
      className="px-4 py-8"
      style={{
        borderBottom: '1px solid var(--color-gray-200)',
        backgroundColor: 'var(--color-white)',
      }}
    >
      <h2 className="heading-3 font-semibold text-[var(--color-gray-900)]">
        별점 분포
      </h2>

      {error && (
        <p className="mt-2 caption-1 text-[var(--color-gray-500)]">{error}</p>
      )}

      {/* ✅ 리뷰 0개 */}
      {totalReviews === 0 ? (
        <div className="mt-6 flex flex-col items-center text-center">
          {/* ✅ Heading3 스타일 정확히 적용 */}
          <p
            className="mt-[24px] heading-3 font-semibold"
            style={{
              color: 'var(--color-gray-500)',
              fontFamily: 'SUIT',
            }}
          >
            아직 리뷰가 없어요...
          </p>

          <button
            type="button"
            onClick={() => router.push('/home/search')}
            className="mt-[12px] cursor-pointer hover:opacity-80 transition-opacity"
            aria-label="리뷰 작성"
          >
            <Image
              src="/profile/write-review.svg"
              alt="리뷰 작성"
              width={131}
              height={36}
            />
          </button>
        </div>
      ) : (
        <>
          {/* 기존 그래프 + 요약 UI 그대로 */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-end h-[150px] gap-1">
              {ratingData.map((item) => {
                const barHeight = getBarHeight(item.count)
                const isMaxBar = item.count === maxCount && item.count > 0
                const hasData = item.count > 0
                const opacity = isMaxBar ? 1 : 0.4

                return (
                  <div
                    key={item.key}
                    className="flex flex-col items-center gap-2"
                  >
                    {hasData && (
                      <span
                        className="text-[16px] font-medium leading-[140%]"
                        style={{
                          color: 'var(--color-gray-900)',
                          opacity,
                        }}
                      >
                        {formatRating(item.rating)}
                      </span>
                    )}

                    <div
                      className="w-7"
                      style={{
                        height: `${barHeight}px`,
                        backgroundColor: '#FF4093',
                        borderRadius: '4px 4px 0 0',
                        opacity: hasData ? opacity : 0.4,
                      }}
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-[60px]">
            {/* 평균 / 리뷰 수 / 많이 준 별점 */}
          </div>
        </>
      )}
    </div>
  )
}
