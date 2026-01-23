// src/app/onboarding/components/favorite.tsx
'use client'

import { useEffect, useState } from 'react'
import {
  getOnboardingWorks,
  type OnboardingWork,
} from '@/api/onboarding/onboardingWorks.api'

interface FavoriteProps {
  value: number[]
  onChange: (value: number[]) => void
}

const MIN_SELECT = 2
const MAX_SELECT = 18

export default function Favorite({ value, onChange }: FavoriteProps) {
  const [works, setWorks] = useState<OnboardingWork[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const run = async () => {
      setLoading(true)
      try {
        const list = await getOnboardingWorks()
        if (!mounted) return
        setWorks(Array.isArray(list) ? list : [])
      } catch {
        if (!mounted) return
        setWorks([])
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }
    run()
    return () => {
      mounted = false
    }
  }, [])

  const handleSelect = (id: number) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id))
      return
    }
    if (value.length >= MAX_SELECT) return
    onChange([...value, id])
  }

  const count = value.length
  const isUnderMin = count < MIN_SELECT
  const isAtMax = count >= MAX_SELECT

  const gridItems = loading
    ? Array.from({ length: 20 }).map((_, i) => ({
        worksId: -1 * (i + 1),
        worksName: '',
        thumbnailUrl: '',
        artistName: '',
        __loading: true as const,
      }))
    : works.map((w) => ({ ...w, __loading: false as const }))

  return (
    <div>
      <h1 className="heading-1" style={{ color: 'var(--color-black)' }}>
        좋아하는 작품을 선택하세요
      </h1>

      <p className="body-1 mt-[5px]" style={{ color: 'var(--color-gray-500)' }}>
        좋아하는 작품을 기반으로 피드를 구성해드려요
      </p>

      <p
        className="body-2 mt-[5px]"
        style={{
          color: isUnderMin ? 'var(--color-warning)' : 'var(--color-gray-500)',
        }}
      >
        {MIN_SELECT}~{MAX_SELECT}개 선택해주세요{' '}
        <span style={{ color: 'var(--color-gray-400)' }}>
          (현재 {count}개 선택됨{isAtMax ? ', 최대 선택' : ''})
        </span>
      </p>

      <div className="mt-16 grid grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pb-20">
        {gridItems.map((item) => {
          const id = item.worksId
          const selected = value.includes(id)
          const isLoadingItem = (item as any).__loading

          return (
            <div
              key={id}
              role="button"
              tabIndex={0}
              className="w-[108px] h-[191px] cursor-pointer transition-opacity hover:opacity-80"
              onClick={() => {
                if (isLoadingItem) return
                handleSelect(id)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  if (isLoadingItem) return
                  handleSelect(id)
                }
              }}
            >
              {/* ✅ 선택 배경/보더는 “전체 카드”에 적용 (기본 테두리 제거) */}
              <div
                className="w-full h-full rounded-[8px] overflow-hidden"
                style={
                  selected
                    ? {
                        borderRadius: 8,
                        border: '2px solid var(--color-magenta-300)',
                        backgroundColor: 'rgba(255, 64, 147, 0.30)',
                      }
                    : { borderRadius: 8 }
                }
              >
                {/* 표지 */}
                <div
                  className="relative w-[108px] h-[144px] flex items-center gap-[10px] rounded-[8px]"
                  style={{
                    backgroundColor: 'var(--color-gray-100)',
                    backgroundImage:
                      !isLoadingItem && item.thumbnailUrl
                        ? `url(${item.thumbnailUrl})`
                        : undefined,
                    backgroundPosition: '50% 50%',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  {/* ✅ 체크 아이콘: 표지 내 좌상단 (8,8), 24x24 */}
                  {selected && (
                    <img
                      src="/icons/check-pink.svg"
                      alt="선택됨"
                      className="absolute left-2 top-2 w-6 h-6"
                      draggable={false}
                    />
                  )}
                </div>

                {/* 텍스트 영역 (좌우 4px 패딩, 제목+작가 하나의 영역 느낌) */}
                <div className="px-1">
                  <p
                    className="body-2 mt-2"
                    style={{
                      color: '#000',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={!isLoadingItem ? item.worksName : undefined}
                  >
                    {isLoadingItem ? '' : item.worksName}
                  </p>

                  <p
                    className="caption-1 mt-[3px]"
                    style={{
                      color: 'var(--color-gray-400)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={!isLoadingItem ? item.artistName : undefined}
                  >
                    {isLoadingItem ? '' : item.artistName}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
