'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  getReaderRatings,
  type RatingCountsMap,
} from '@/api/profile/readerRatings.api'

const RATING_STEPS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5] as const
const MAX_HEIGHT = 120

function toRatingKey(r: number) {
  // 백엔드 키가 "3.5" 형태일 가능성이 높아서 기본은 문자열로 매칭
  return String(r)
}

function parseCountsToStepMap(raw: RatingCountsMap): Record<number, number> {
  // raw 키가 "3.5" / "3_5" / "RATING_3_5" 등으로 와도 최대한 숫자로 파싱해서 대응
  const parsed: Record<number, number> = {}

  for (const [k, v] of Object.entries(raw ?? {})) {
    let key = k.trim()

    // "3_5" 같은 형태 대비
    key = key.replace(/_/g, '.')

    // "RATING_3.5" 같은 형태 대비: 숫자만 추출
    const match = key.match(/(\d+(\.\d+)?)/g)
    const numStr = match ? match[match.length - 1] : key

    const rating = Number.parseFloat(numStr)
    if (!Number.isNaN(rating)) {
      parsed[rating] =
        (parsed[rating] ?? 0) + (Number.isFinite(v) ? Number(v) : 0)
    }
  }

  // 우리가 그리는 step에 대해 없는 값은 0
  const stepMap: Record<number, number> = {}
  for (const r of RATING_STEPS) stepMap[r] = parsed[r] ?? 0
  return stepMap
}

function formatRating(r: number) {
  // 1.0 -> "1", 3.5 -> "3.5"
  return Number.isInteger(r) ? String(r) : String(r)
}

export default function Rating() {
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
      } catch (e) {
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

  const totalReviews = useMemo(() => {
    return ratingData.reduce((acc, cur) => acc + cur.count, 0)
  }, [ratingData])

  const averageRating = useMemo(() => {
    if (totalReviews === 0) return 0
    const sum = ratingData.reduce((acc, cur) => acc + cur.rating * cur.count, 0)
    // 소수 1자리로 표기 (원하면 2자리로 바꿔도 됨)
    return Math.round((sum / totalReviews) * 10) / 10
  }, [ratingData, totalReviews])

  const mostGivenRating = useMemo(() => {
    if (totalReviews === 0) return 0
    const max = maxCount
    if (max <= 0) return 0
    // 동률이면 "더 큰 별점"을 우선(원하면 첫번째로 바꿔도 됨)
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
      <h2
        className="text-[18px] font-semibold leading-[140%]"
        style={{ color: 'var(--color-gray-900)' }}
      >
        별점 분포
      </h2>

      {/* 에러가 있어도 UI는 유지하되, 안내만 작게 표시 */}
      {error && (
        <p
          className="mt-2 text-[12px] font-medium leading-[140%]"
          style={{ color: 'var(--color-gray-500)' }}
        >
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-center">
        <div className="flex items-end h-[150px] gap-1">
          {ratingData.map((item) => {
            const barHeight = getBarHeight(item.count)
            const isMaxBar = item.count === maxCount && item.count > 0
            const hasData = item.count > 0
            const opacity = isMaxBar ? 1 : 0.4

            return (
              <div key={item.key} className="flex flex-col items-center gap-2">
                {hasData && (
                  <span
                    className="text-[16px] font-medium leading-[140%]"
                    style={{
                      color: 'var(--color-gray-900)',
                      opacity: opacity,
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
        <div className="text-center">
          <p
            className="text-[16px] font-medium leading-[140%]"
            style={{ color: 'var(--color-gray-900)' }}
          >
            {averageRating}
          </p>
          <p
            className="mt-2 text-[14px] font-medium leading-[140%]"
            style={{ color: 'var(--color-gray-500)' }}
          >
            별점 평균
          </p>
        </div>

        <div className="text-center">
          <p
            className="text-[16px] font-medium leading-[140%]"
            style={{ color: 'var(--color-gray-900)' }}
          >
            {totalReviews}
          </p>
          <p
            className="mt-2 text-[14px] font-medium leading-[140%]"
            style={{ color: 'var(--color-gray-500)' }}
          >
            리뷰 수
          </p>
        </div>

        <div className="text-center">
          <p
            className="text-[16px] font-medium leading-[140%]"
            style={{ color: 'var(--color-gray-900)' }}
          >
            {mostGivenRating}
          </p>
          <p
            className="mt-2 text-[14px] font-medium leading-[140%]"
            style={{ color: 'var(--color-gray-500)' }}
          >
            많이 준 별점
          </p>
        </div>
      </div>
    </div>
  )
}
