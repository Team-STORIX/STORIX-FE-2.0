// src/app/onboarding/components/favorite.tsx
interface FavoriteProps {
  value: string[]
  onChange: (value: string[]) => void
}

export default function Favorite({ value, onChange }: FavoriteProps) {
  const handleSelect = (index: number) => {
    const id = `work-${index}`
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id))
    } else {
      onChange([...value, id])
    }
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

      {/* 작품 선택 그리드 */}
      <div className="mt-20 grid grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pb-20">
        {Array.from({ length: 20 }, (_, index) => (
          <div
            key={index}
            className="w-[108px] h-[191px] border border-black cursor-pointer hover:opacity-80 transition-opacity flex items-start justify-center pt-0"
            onClick={() => handleSelect(index)}
          >
            <div
              className="w-[108px] h-[144px] bg-gray-100"
              style={{ backgroundColor: 'var(--color-gray-100)' }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
