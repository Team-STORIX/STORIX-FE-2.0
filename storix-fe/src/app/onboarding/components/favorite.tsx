// src/app/onboarding/components/favorite.tsx
'use client'

interface FavoriteProps {
  value: number[]
  onChange: (value: number[]) => void
}

const MIN_SELECT = 2
const MAX_SELECT = 18

export default function Favorite({ value, onChange }: FavoriteProps) {
  const handleSelect = (id: number) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id))
      return
    }

    // 최대 18개까지만 선택 가능
    if (value.length >= MAX_SELECT) return

    onChange([...value, id])
  }

  return (
    <div>
      <h1
        className="text-black text-2xl font-bold"
        style={{
          fontFamily: 'SUIT',
          fontSize: '24px',
          fontWeight: 700,
          lineHeight: '140%',
        }}
      >
        좋아하는 작품을 선택하세요
      </h1>

      <p
        className="text-gray-500 mt-[5px]"
        style={{
          fontFamily: 'SUIT',
          fontSize: '16px',
          fontWeight: 500,
          lineHeight: '140%',
        }}
      >
        좋아하는 작품을 기반으로 피드를 구성해드려요
      </p>

      {/* ✅ 선택 개수 표시 문구 */}
      <p
        className="text-gray-500 mt-[5px]"
        style={{
          fontFamily: 'SUIT',
          fontSize: '14px',
          fontWeight: 500,
          lineHeight: '140%',
        }}
      >
        2~18개 선택해주세요{' '}
        <span className="text-gray-400">(현재 {value.length}개 선택됨)</span>
      </p>

      {/* 작품 선택 그리드 */}
      <div className="mt-16 grid grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pb-20">
        {Array.from({ length: 20 }, (_, index) => {
          const selected = value.includes(index)

          return (
            <div
              key={index}
              className={`w-[108px] h-[191px] cursor-pointer transition-opacity
                ${selected ? 'border-2 border-[#FF4093]' : 'border border-black'}
                hover:opacity-80
              `}
              onClick={() => handleSelect(index)}
            >
              <div
                className="w-[108px] h-[144px]"
                style={{ backgroundColor: 'var(--color-gray-100)' }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
