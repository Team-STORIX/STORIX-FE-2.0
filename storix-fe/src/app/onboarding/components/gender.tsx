// src/app/onboarding/components/gender.tsx
import MenIcon from '@/public/onboarding/MenIcon'
import WomenIcon from '@/public/onboarding/WomenIcon'

type GenderValue = 'MALE' | 'FEMALE' | 'NONE' | ''

interface GenderProps {
  value: GenderValue
  onChange: (value: GenderValue) => void
}

export default function Gender({ value, onChange }: GenderProps) {
  return (
    <div>
      <h1 className="text-black text-2xl font-bold leading-[140%]">
        성별을 선택해 주세요
      </h1>

      <p className="text-gray-500 mt-[5px] text-[16px] font-medium leading-[140%]">
        취향에 맞는 추천을 드리기 위해 필요한 정보예요.
      </p>

      {/* 성별 선택 버튼 */}
      <div className="mt-20 flex flex-col gap-3 justify-center">
        <div className={`flex justify-between `}>
          <button
            className={`flex flex-col items-center justify-center py-6.5 px-9.5 rounded-xl border cursor-pointer ${
              value === 'FEMALE'
                ? 'text-[var(--color-magenta-300)] border-[var(--color-magenta-300)] bg-[var(--color-magenta-20)]'
                : 'text-[var(--color-gray-400)] border-[var(--color-gray-200)] bg-gray-50'
            }`}
            onClick={() => onChange('FEMALE')}
          >
            <WomenIcon />
            <p className="w-25 body-1 text-center mt-3">여성</p>
          </button>
          <button
            className={`flex flex-col items-center justify-center py-6.5 px-9.5 rounded-xl border cursor-pointer ${
              value === 'MALE'
                ? 'text-[var(--color-magenta-300)] border-[var(--color-magenta-300)] bg-[var(--color-magenta-20)]'
                : 'text-[var(--color-gray-400)] border-[var(--color-gray-200)] bg-gray-50'
            }`}
            onClick={() => onChange('MALE')}
          >
            <MenIcon />
            <p className="w-25 body-1 text-center mt-3 ">남성</p>
          </button>
        </div>
        <button
          className={`w-full py-3 px-4 rounded-xl border cursor-pointer ${
            value === 'NONE'
              ? 'text-[var(--color-magenta-300)] border-[var(--color-magenta-300)] bg-[var(--color-magenta-20)]'
              : 'text-[var(--color-gray-400)] border-[var(--color-gray-200)] bg-gray-50'
          }`}
          onClick={() => onChange('NONE')}
        >
          <p className="body-1" onClick={() => onChange('NONE')}>
            선택 안 함
          </p>
        </button>
      </div>
    </div>
  )
}
