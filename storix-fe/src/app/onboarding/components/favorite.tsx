// src/app/common/onboarding/components/favorite.tsx
'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  getOnboardingWorks,
  type OnboardingWork,
} from '@/lib/api/onboarding/onboardingWorks.api'

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
  const hasPickedAny = count > 0

  const gridItems = useMemo(() => {
    if (loading) {
      return Array.from({ length: 20 }).map((_, i) => ({
        worksId: -1 * (i + 1),
        worksName: '',
        thumbnailUrl: '',
        artistName: '',
        __loading: true as const,
      }))
    }
    return works.map((w) => ({ ...w, __loading: false as const }))
  }, [loading, works])

  return (
    <div>
      <h1 className="heading-1" style={{ color: 'var(--color-black)' }}>
        관심있는 작품을 선택하세요
      </h1>

      {/*   0개일 땐 두 줄만 / 1개 이상이면 문구+카운트로 변경 */}
      {!hasPickedAny ? (
        <p
          className="body-1 mt-[5px]"
          style={{ color: 'var(--color-gray-500)' }}
        >
          선택 작품을 기반으로 피드를 구성해드려요
        </p>
      ) : (
        <div className="mt-[5px] flex items-center">
          <p className="body-1" style={{ color: 'var(--color-gray-500)' }}>
            최소 {MIN_SELECT}개~최대 {MAX_SELECT}개 선택가능
          </p>
          <span
            className="body-1 ml-1"
            style={{ color: 'var(--magenta-300-main, #FF4093)' }}
          >
            ({count}/{MAX_SELECT})
          </span>
        </div>
      )}

      <div className="mt-16 grid grid-cols-3 gap-4 pb-20">
        {gridItems.map((item) => {
          const id = item.worksId
          const selected = value.includes(id)
          const isLoadingItem = (item as any).__loading

          return (
            <div
              key={id}
              role="button"
              tabIndex={0}
              className="w-[108px] cursor-pointer transition-opacity hover:opacity-80"
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
              {/* 표지 */}
              <div
                className="relative w-[108px] h-[144px] rounded-[8px]"
                style={{
                  backgroundColor: 'var(--color-gray-100)',
                  backgroundImage:
                    !isLoadingItem && item.thumbnailUrl
                      ? `url(${item.thumbnailUrl})`
                      : undefined,
                  backgroundPosition: '50% 50%',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  border: selected
                    ? '2px solid var(--color-magenta-300)'
                    : '2px solid transparent',
                }}
              >
                {/* 선택 핑크 오버레이 */}
                {selected && (
                  <div
                    className="absolute inset-0 rounded-[8px]"
                    style={{ backgroundColor: 'rgba(255, 64, 147, 0.30)' }}
                  />
                )}

                {/* 체크 아이콘: 좌상단 (8,8), 24x24 */}
                {selected && (
                  <img
                    src="/common/icons/check-pink.svg"
                    alt="선택됨"
                    className="absolute left-2 top-2 w-6 h-6"
                    draggable={false}
                  />
                )}
              </div>

              {/* 텍스트 영역: 표지 8px 아래, 좌우 4px 패딩, 100×40 */}
              <div className="mt-2 px-1 w-[108px]">
                <p
                  style={{
                    color: '#000',
                    fontFamily: 'SUIT',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '140%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                  title={!isLoadingItem ? item.worksName : undefined}
                >
                  {isLoadingItem ? '' : item.worksName}
                </p>

                <p
                  style={{
                    marginTop: '3px',
                    color: 'var(--Grayscale-400, #B0A5AA)',
                    fontFamily: 'SUIT',
                    fontSize: '12px',
                    fontWeight: 500,
                    lineHeight: '140%',
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
          )
        })}
      </div>
    </div>
  )
}
