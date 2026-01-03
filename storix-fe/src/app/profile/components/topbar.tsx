// src/app/profile/components/topbar.tsx

'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function TopBar() {
  const [isProfileCardOpen, setIsProfileCardOpen] = useState(false)

  return (
    <>
      <div className="h-[56px] flex items-center justify-between px-5">
        {/* 왼쪽: 프로필 텍스트 */}
        <h1
          className="text-[20px] font-bold leading-[140%]"
          style={{
            color: 'var(--color-gray-900)',
            fontFamily: 'SUIT',
          }}
        >
          프로필
        </h1>

        {/* 오른쪽: 프로필 카드 버튼 + 설정 아이콘 */}
        <div className="flex items-center gap-2">
          {/* 프로필 카드 버튼 */}
          <button
            onClick={() => setIsProfileCardOpen(true)}
            className="flex items-center justify-center gap-1 px-[10px] py-1 rounded-[24px] border transition-all hover:bg-gray-50"
            style={{
              borderColor: 'var(--color-gray-200)',
              backgroundColor: 'var(--color-white)',
              color: 'var(--color-gray-600)',
              fontFamily: 'SUIT',
              fontSize: '12px',
              fontWeight: 700,
              lineHeight: '140%',
            }}
          >
            프로필 카드
          </button>

          {/* 설정 아이콘 */}
          <button
            className="w-6 h-6 flex items-center justify-center transition-opacity hover:opacity-70"
            aria-label="설정"
          >
            <Image
              src="/icons/settings.svg"
              alt="설정"
              width={24}
              height={24}
            />
          </button>
        </div>
      </div>

      {/* TODO: 프로필 카드 모달 */}
      {/* {isProfileCardOpen && (
        <ProfileCardModal onClose={() => setIsProfileCardOpen(false)} />
      )} */}
    </>
  )
}
