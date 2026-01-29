// src/app/writers/profile/components/preferenceTab.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function PreferenceTab() {
  const pathname = usePathname()

  // ✅ writers 기준 경로 체크
  const isActivityTab = pathname === '/writers/profile'

  return (
    <div className="flex py-2">
      {/* 내 활동 */}
      <Link
        href="/writers/profile"
        className="flex-1 flex flex-col items-center gap-4"
      >
        <span
          className={`text-[16px] font-medium leading-[140%] ${
            isActivityTab ? 'text-[#100F0F]' : 'text-[#A9A8A8]'
          }`}
        >
          내 활동
        </span>
        <div
          className={`w-full h-[2px] ${
            isActivityTab ? 'bg-[#100F0F]' : 'bg-[#A9A8A8]'
          }`}
        />
      </Link>

      {/* 대시보드 */}
      <Link
        href="/writers/profile/dashboard"
        className="flex-1 flex flex-col items-center gap-4"
      >
        <span
          className={`text-[16px] font-medium leading-[140%] ${
            !isActivityTab ? 'text-[#100F0F]' : 'text-[#A9A8A8]'
          }`}
        >
          대시보드
        </span>
        <div
          className={`w-full h-[2px] ${
            !isActivityTab ? 'bg-[#100F0F]' : 'bg-[#A9A8A8]'
          }`}
        />
      </Link>
    </div>
  )
}
