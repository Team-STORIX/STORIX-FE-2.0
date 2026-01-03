// src/app/profile/components/preferenceTab.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function PreferenceTab() {
  const pathname = usePathname()
  const isAnalysisTab = pathname === '/profile'

  return (
    <div className="flex py-2">
      <Link href="/profile" className="flex-1 flex flex-col items-center gap-4">
        <span
          className={`text-[16px] font-medium leading-[140%] ${isAnalysisTab ? 'text-[#100F0F]' : 'text-[#A9A8A8]'}`}
        >
          취향 분석
        </span>
        <div
          className={`w-full h-[2px] ${isAnalysisTab ? 'bg-[#100F0F]' : 'bg-[#A9A8A8]'}`}
        />
      </Link>

      <Link
        href="/profile/myActivity"
        className="flex-1 flex flex-col items-center gap-4"
      >
        <span
          className={`text-[16px] font-medium leading-[140%] ${!isAnalysisTab ? 'text-[#100F0F]' : 'text-[#A9A8A8]'}`}
        >
          내 활동
        </span>
        <div
          className={`w-full h-[2px] ${!isAnalysisTab ? 'bg-[#100F0F]' : 'bg-[#A9A8A8]'}`}
        />
      </Link>
    </div>
  )
}
