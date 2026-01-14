// src/app/profile/likes/components/topbar.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function TopBar() {
  return (
    <div className="h-[56px] w-full flex items-center px-5">
      {/* 뒤로가기 -> /profile */}
      <Link href="/profile" className="transition-opacity hover:opacity-70">
        <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
      </Link>

      {/* 텍스트 (아이콘에서 12px) */}
      <h1
        className="ml-3 text-[20px] font-bold leading-[140%]"
        style={{ color: 'var(--color-gray-900)', fontFamily: 'SUIT' }}
      >
        관심
      </h1>
    </div>
  )
}
