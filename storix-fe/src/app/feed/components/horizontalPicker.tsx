// src/app/feed/components/horizontalPicker.tsx
'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import { useRouter } from 'next/navigation'

export type PickerItem = {
  id: string
  name: string
  thumbnailUrl?: string
}

type Props = {
  items: PickerItem[]
  selectedId: string
  onSelect: (id: string) => void
}

const ADD_ID = '__add_favorites__'
const ADD_ICON_SRC = '/feed/add-favorites.svg'
const ADD_ROUTE = '/home/search'

export default function HorizontalPicker({
  items,
  selectedId,
  onSelect,
}: Props) {
  const router = useRouter()

  const computedItems = useMemo(() => {
    const addItem: PickerItem = { id: ADD_ID, name: '작품 추가' }

    // 'all' 제외하고 하나라도 있으면 관심작품이 있다고 판단
    const hasFavorites = items.some((it) => it.id !== 'all' && it.id !== ADD_ID)

    // 중복 방지
    const base = items.filter((it) => it.id !== ADD_ID)

    // ✅ 관심작품이 없으면: "전체" 바로 옆에 추가 아이콘
    if (!hasFavorites) {
      const allIdx = base.findIndex((it) => it.id === 'all')
      if (allIdx === -1) return [addItem, ...base]
      return [...base.slice(0, allIdx + 1), addItem, ...base.slice(allIdx + 1)]
    }

    // ✅ 관심작품이 있으면: 맨 마지막에 추가 아이콘
    return [...base, addItem]
  }, [items])

  return (
    <section
      className="w-full"
      style={{
        height: 110,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 20,
        borderBottom: '6px solid var(--gray-50, #F8F7F7)',
        background: 'var(--white, #FFF)',
      }}
    >
      <div
        className="h-full overflow-x-auto overflow-y-hidden"
        style={{
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <div className="flex items-start h-full">
          <div className="inline-flex items-start h-full whitespace-nowrap">
            {computedItems.map((item, idx) => {
              const isActive = selectedId === item.id
              const isAll = item.id === 'all'
              const isAdd = item.id === ADD_ID

              // ✅ 기본은 active=1, inactive=0.5
              // ✅ hover 시에는 무조건 1로 복귀
              const opacityClass = isActive ? 'opacity-100' : 'opacity-50'

              const activeText =
                isAll || isAdd
                  ? {}
                  : {
                      color: 'var(--magenta-300-main, #FF4093)',
                      fontWeight: 700,
                    }

              const handleClick = () => {
                if (isAdd) {
                  router.push(ADD_ROUTE)
                  return
                }
                onSelect(item.id)
              }

              return (
                <div
                  key={item.id}
                  className="flex items-start h-full"
                  style={{ flex: '0 0 auto' }}
                >
                  <button
                    type="button"
                    onClick={handleClick}
                    aria-pressed={isActive}
                    className={`group flex flex-col items-center transition-opacity ${opacityClass} hover:opacity-100`}
                    style={{ width: 62, background: 'transparent' }}
                  >
                    <div
                      className="relative w-[60px] h-[60px] overflow-hidden rounded-full"
                      style={{ background: 'var(--gray-100, #EEEDED)' }}
                    >
                      {/* ✅ 전체 아이템 */}
                      {isAll ? (
                        <Image
                          src={
                            isActive
                              ? '/feed/picker-pink.svg'
                              : '/feed/picker-gray.svg'
                          }
                          alt="전체"
                          fill
                          sizes="60px"
                          className="object-contain"
                          priority
                        />
                      ) : isAdd ? (
                        /* ✅ 관심작품 추가 아이콘 */
                        <Image
                          src={ADD_ICON_SRC}
                          alt="작품 추가"
                          fill
                          sizes="60px"
                          className="object-contain"
                          priority={idx < 6}
                        />
                      ) : item.thumbnailUrl ? (
                        <Image
                          src={item.thumbnailUrl}
                          alt={item.name}
                          fill
                          sizes="60px"
                          className="object-cover"
                          priority={idx < 6}
                        />
                      ) : null}

                      {/* ✅ 활성 오버레이 (전체/추가 제외, 기존 규칙 유지) */}
                      {isActive && !isAll && !isAdd && (
                        <div
                          className="absolute inset-0"
                          style={{ background: 'rgba(255, 64, 147, 0.22)' }}
                        />
                      )}
                    </div>

                    <p
                      className="mt-2 w-[62px] truncate body-2 text-center"
                      style={{
                        fontFamily: 'SUIT',
                        ...(isActive ? activeText : null),
                      }}
                      title={item.name}
                    >
                      {item.name}
                    </p>
                  </button>

                  {/* ✅ 전체 뒤 구분선 (computedItems 기준으로 유지) */}
                  {idx === 0 && computedItems.length > 1 && (
                    <div
                      className="flex items-start"
                      style={{ flex: '0 0 auto' }}
                    >
                      <div style={{ width: 16 }} />
                      <svg
                        width="1"
                        height="90"
                        viewBox="0 0 1 90"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <line
                          x1="0.5"
                          y1="0"
                          x2="0.5"
                          y2="90"
                          stroke="var(--gray-100, #EEEDED)"
                          strokeWidth="1"
                        />
                      </svg>
                      <div style={{ width: 16 }} />
                    </div>
                  )}

                  {idx !== 0 && idx !== computedItems.length - 1 && (
                    <div style={{ width: 16, flex: '0 0 auto' }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
