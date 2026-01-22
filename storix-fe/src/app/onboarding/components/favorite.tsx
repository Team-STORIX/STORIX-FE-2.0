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

  const count = value.length
  const isUnderMin = count < MIN_SELECT
  const isAtMax = count >= MAX_SELECT

  return (
    <div>
      <h1 className="heading-1" style={{ color: 'var(--color-black)' }}>
        좋아하는 작품을 선택하세요
      </h1>

      <p className="body-1 mt-[5px]" style={{ color: 'var(--color-gray-500)' }}>
        좋아하는 작품을 기반으로 피드를 구성해드려요
      </p>

      {/* ✅ 선택 개수 표시 문구 */}
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

      {/* 작품 선택 그리드 */}
      <div className="mt-16 grid grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pb-20">
        {Array.from({ length: 20 }, (_, index) => {
          const selected = value.includes(index)

          return (
            <div
              key={index}
              role="button"
              tabIndex={0}
              className={[
                'w-[108px] h-[191px] cursor-pointer transition-opacity hover:opacity-80',
                selected ? 'border-2' : 'border',
              ].join(' ')}
              style={{
                borderColor: selected
                  ? 'var(--color-magenta-300)'
                  : 'var(--color-gray-900)',
              }}
              onClick={() => handleSelect(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleSelect(index)
                }
              }}
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
