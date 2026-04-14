'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  getOnboardingWorks,
  type OnboardingWork,
} from '../../../lib/api/onboarding/onboardingWorks.api'

interface FavoriteProps {
  value: number[]
  onChange: (value: number[]) => void
}

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
      } catch (error) {
        console.error('온보딩 작품 리스트 조회 실패:', error)
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
      return Array.from({ length: 18 }).map((_, i) => ({
        worksId: -(i + 1),
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
      <h1 className="heading-1 text-[var(--color-black)]">
        관심있는 작품을 선택하세요
      </h1>

      {!hasPickedAny ? (
        <p className="body-1-medium mt-[5px] text-[var(--color-gray-500)]">
          선택 작품을 기반으로 피드를 구성해드려요
        </p>
      ) : (
        <div className="mt-[5px] flex items-center">
          <p className="body-1-medium text-[var(--color-gray-500)]">
            최대 {MAX_SELECT}개 선택가능
          </p>
          <span className="body-1-medium ml-1 text-[var(--color-magenta-300)]">
            ({count}/{MAX_SELECT})
          </span>
        </div>
      )}

      <div className="mt-16 grid grid-cols-3 gap-x-2 gap-y-4 pb-20">
        {gridItems.map((item) => {
          const id = item.worksId
          const selected = value.includes(id)
          const isLoadingItem = item.__loading

          return (
            <div
              key={id}
              role="button"
              tabIndex={0}
              className="h-[192px] w-[108px] cursor-pointer transition-opacity hover:opacity-80"
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
              <div
                className="relative h-[144px] w-[108px] rounded-[8px] bg-[var(--color-gray-100)] bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    !isLoadingItem && item.thumbnailUrl
                      ? `url(${item.thumbnailUrl})`
                      : undefined,
                  border: selected
                    ? '2px solid var(--color-magenta-300)'
                    : '2px solid transparent',
                }}
              >
                {selected && (
                  <div className="absolute inset-0 rounded-[8px] bg-[rgba(255,64,147,0.30)]" />
                )}

                {selected && (
                  <img
                    src="/common/icons/check-pink.svg"
                    alt="선택됨"
                    className="absolute left-2 top-2 h-6 w-6"
                    draggable={false}
                  />
                )}
              </div>

              <div className="mt-[8px] h-[40px] w-[100px] px-[4px]">
                <p
                  className="body-2-medium h-[20px] overflow-hidden text-ellipsis whitespace-nowrap text-[var(--color-black)]"
                  title={!isLoadingItem ? item.worksName : undefined}
                >
                  {isLoadingItem ? '' : item.worksName}
                </p>

                <p
                  className="caption-1-medium mt-[3px] h-[17px] overflow-hidden text-ellipsis whitespace-nowrap text-[var(--color-gray-400)]"
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