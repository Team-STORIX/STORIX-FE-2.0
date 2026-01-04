// src/app/profile/fix/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

export default function ProfileFixPage() {
  const [isChanged, setIsChanged] = useState(false)

  return (
    <div>
      {/* 상단 54px 공백 */}
      <div className="h-[54px]" />

      {/* 헤더 */}
      <div className="flex items-center justify-between p-4">
        {/* 왼쪽: 뒤로가기 */}
        <Link href="/profile" className="transition-opacity hover:opacity-70">
          <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </Link>

        {/* 가운데: 프로필 수정 */}
        <h1
          className="absolute left-1/2 -translate-x-1/2 text-[16px] font-medium leading-[140%]"
          style={{ color: 'var(--color-gray-900)' }}
        >
          프로필 수정
        </h1>

        {/* 오른쪽: 완료 */}
        <button
          onClick={() => setIsChanged(true)}
          className="text-[16px] font-medium leading-[140%] transition-colors"
          style={{
            color: isChanged ? 'var(--color-main)' : 'var(--color-gray-500)',
          }}
        >
          완료
        </button>
      </div>

      {/* 프로필 이미지 영역 */}
      <div className="mt-8 flex justify-center">
        <div
          className="w-[100px] h-[100px] rounded-full"
          style={{ backgroundColor: 'var(--color-gray-200)' }}
        />
      </div>
    </div>
  )
}
