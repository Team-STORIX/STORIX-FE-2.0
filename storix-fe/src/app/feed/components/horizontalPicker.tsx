// src/app/feed/components/horizontalPicker.tsx
'use client'

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

export default function HorizontalPicker({
  items,
  selectedId,
  onSelect,
}: Props) {
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
      {/* ✅ 스크롤 컨테이너 */}
      <div
        className="h-full overflow-x-auto overflow-y-hidden"
        style={{
          WebkitOverflowScrolling: 'touch', // iOS 관성 스크롤
          scrollbarWidth: 'none', // Firefox 스크롤바 숨김
          msOverflowStyle: 'none', // IE/Edge legacy
        }}
      >
        {/* ✅ 스크롤바 숨김 (Chrome/Safari) */}
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* ✅ 가로로 길게 펼쳐지게: inline-flex + whitespace-nowrap */}
        <div className="flex items-start h-full">
          <div className="inline-flex items-start h-full whitespace-nowrap">
            {items.map((item, idx) => {
              const isActive = selectedId === item.id
              const isAll = item.id === 'all'
              const opacity = isActive ? 1 : 0.5

              // ✅ 색은 유지 (요청대로), 활성만 기존 규칙 유지
              const activeText = isAll
                ? {}
                : {
                    color: 'var(--magenta-300-main, #FF4093)',
                    fontWeight: 700,
                  }

              return (
                <div
                  key={item.id}
                  className="flex items-start h-full"
                  style={{ flex: '0 0 auto' }} // ✅ 줄바꿈 방지 + 아이템 폭 고정
                >
                  <button
                    type="button"
                    onClick={() => onSelect(item.id)}
                    className="flex flex-col items-center"
                    style={{ width: 62, opacity, background: 'transparent' }}
                    aria-pressed={isActive}
                  >
                    <div
                      className="relative w-[60px] h-[60px] overflow-hidden rounded-full"
                      style={{ background: 'var(--gray-100, #EEEDED)' }}
                    >
                      {isActive && !isAll && (
                        <div
                          className="absolute inset-0"
                          style={{ background: 'rgba(255, 64, 147, 0.22)' }}
                        />
                      )}
                    </div>

                    {/* ✅ SUIT / 14 / 500 / 140% / center  */}
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

                  {idx === 0 && items.length > 1 && (
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

                  {idx !== 0 && idx !== items.length - 1 && (
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
