// src/components/home/HomeHeader.tsx
'use client'

import Link from 'next/link'
import LogoSymbol from '@/public/icons/header/LogoSymbol'
import BellIcon from '@/public/icons/header/BellIcon'
import SearchIcon from '@/public/icons/header/SearchIcon'

/** 상단 로고 + 검색 + 알림 헤더 */
export default function HomeHeader() {
  return (
    <header className="flex h-14 items-center justify-between">
      {/* 왼쪽 로고 버튼 */}
      <div className="flex h-10 w-10 items-center justify-center">
        <LogoSymbol />
      </div>

      {/* 오른쪽 아이콘 그룹 */}
      <div className="flex items-center gap-4">
        {/* 검색 아이콘 */}
        <Link
          href={'/home/search'}
          aria-label="검색"
          className="flex h-6 w-6 items-center justify-center"
        >
          <SearchIcon />
        </Link>

        {/* 알림 아이콘 */}
        <Link
          href={'/home/notify'}
          aria-label="알림"
          className="flex h-6 w-6 items-center justify-center"
        >
          <BellIcon />
        </Link>
      </div>
    </header>
  )
}
