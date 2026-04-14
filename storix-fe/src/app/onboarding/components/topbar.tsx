// src/app/common/onboarding/components/topbar.tsx
'use client'

import { useRouter } from 'next/navigation'

interface TopbarProps {
  onBack: () => void
  onSkip?: () => void
}

export default function Topbar({ onBack, onSkip }: TopbarProps) {
  const router = useRouter()

  return (
    <div className="w-full h-14 p-4 flex justify-between items-center bg-white">
      {/* 뒤로가기 */}
      <img
        src="/common/icons/back.svg"
        alt="뒤로가기"
        width={24}
        height={24}
        className="cursor-pointer brightness-0"
        onClick={onBack}
      />

      {/* 건너뛰기 (디자인 확인용) */}
      {onSkip && (
        <button
          type="button"
          onClick={onSkip}
          className="text-[14px] font-medium text-[var(--color-gray-500)] cursor-pointer hover:opacity-70"
        >
          건너뛰기
        </button>
      )}
    </div>
  )
}
