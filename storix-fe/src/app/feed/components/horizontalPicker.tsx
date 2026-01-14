// src/app/feed/components/horizontalPicker.tsx

'use client'

export type PickerItem = {
  id: string
  name: string
  thumbnailUrl?: string // 나중에 API 붙이면 사용
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
        // ✅ 디자인: 393*110, 좌우16, 아래20
        height: 110,
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 20,

        // ✅ 요청: 밑줄 + 흰 배경
        borderBottom: '6px solid var(--gray-50, #F8F7F7)',
        background: 'var(--white, #FFF)',
      }}
    >
      <div className="h-full overflow-x-auto">
        <div className="flex items-start h-full">
          {items.map((item, idx) => {
            const isActive = selectedId === item.id
            const isAll = item.id === 'all'
            const opacity = isActive ? 1 : 0.5

            // ✅ 텍스트 기본(Body2)
            const baseText = {
              color: 'var(--gray-900, #100F0F)',
              textAlign: 'center' as const,
              fontFamily: 'Pretendard',
              fontSize: 14,
              fontStyle: 'normal' as const,
              fontWeight: 500,
              lineHeight: '140%',
            }

            // ✅ 활성 텍스트 규칙
            // - 전체 활성: 검정(기본 그대로)
            // - 일반 활성: 핑크 + bold (Body4)
            const activeText = isAll
              ? {}
              : {
                  color: 'var(--magenta-300-main, #FF4093)',
                  fontWeight: 700,
                }

            return (
              <div key={item.id} className="flex items-start h-full">
                <button
                  type="button"
                  onClick={() => onSelect(item.id)}
                  className="flex flex-col items-center"
                  style={{
                    width: 62, // ✅ 텍스트 max 62px에 맞춰 그룹 폭도 맞춤
                    opacity,
                    background: 'transparent',
                  }}
                  aria-pressed={isActive}
                >
                  {/* ✅ 60x60 원형 이미지(지금은 썸네일 없으니 placeholder) */}
                  <div
                    className="relative w-[60px] h-[60px] overflow-hidden rounded-full"
                    style={{
                      background: 'var(--gray-100, #EEEDED)',
                    }}
                  >
                    {/* 썸네일 들어오면 여기서 Image로 교체 */}
                    {/* 활성(전체 제외)일 때 핑크 톤 오버레이 */}
                    {isActive && !isAll && (
                      <div
                        className="absolute inset-0"
                        style={{ background: 'rgba(255, 64, 147, 0.22)' }}
                      />
                    )}
                  </div>

                  {/* ✅ 이미지 아래 8px, max 62px, ... */}
                  <p
                    className="mt-2 w-[62px] truncate"
                    style={{
                      ...baseText,
                      ...(isActive ? activeText : null),
                    }}
                    title={item.name}
                  >
                    {item.name}
                  </p>
                </button>

                {/* ✅ 구분선은 ‘전체’ 옆(= 첫 아이템 뒤)에만 1개 */}
                {idx === 0 && items.length > 1 && (
                  <div className="flex items-start">
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

                {/* ✅ 구분선이 없는 경우엔 아이템 간 간격만(너가 말한 16px) */}
                {idx !== 0 && idx !== items.length - 1 && (
                  <div style={{ width: 16 }} />
                )}
                {idx === 0 &&
                  // 전체 뒤는 구분선이 있으니까 별도 간격 불필요(이미 16+선+16)
                  null}
                {idx === items.length - 1 && null}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
