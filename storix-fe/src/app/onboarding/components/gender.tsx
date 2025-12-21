// src/app/onboarding/components/gender.tsx
interface GenderProps {
  value: string
  onChange: (value: string) => void
}

export default function Gender({ value, onChange }: GenderProps) {
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
        성별을 선택하세요
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
        해당 정보는 추천에 활용되며, 언제든 변경할 수 있어요
      </p>

      {/* 성별 선택 버튼 */}
      <div className="mt-20 flex gap-4 justify-center">
        <img
          src={
            value === 'male'
              ? '/onboarding/men-pink.svg'
              : '/onboarding/men-gray.svg'
          }
          alt="남성"
          width={174}
          height={28}
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onChange('male')}
        />
        <img
          src={
            value === 'female'
              ? '/onboarding/women-pink.svg'
              : '/onboarding/women-gray.svg'
          }
          alt="여성"
          width={174}
          height={28}
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => onChange('female')}
        />
      </div>
    </div>
  )
}
