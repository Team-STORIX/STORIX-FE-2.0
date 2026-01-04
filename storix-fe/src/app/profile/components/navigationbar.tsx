// src/app/profile/components/navigationbar.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function NavigationBar() {
  const [isPlusOpen, setIsPlusOpen] = useState(false)

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[393px]">
      {/* 41px 공백 */}
      <div className="h-[41px]" />

      {/* 네비게이션 바 이미지 */}
      <div className="relative w-full h-[128px]">
        <Image
          src="/profile/navigation-bar-profile.svg"
          alt="네비게이션 바"
          width={393}
          height={128}
          className="w-full h-full"
          priority
        />

        {/* 클릭 가능한 영역들 */}
        {/* 홈 버튼 - 왼쪽 20px, 위 14.5px */}
        <Link
          href="#"
          className="absolute left-5 top-[14.5px] w-6 h-6 transition-opacity hover:opacity-70"
          aria-label="홈"
        >
          <div className="w-full h-full" />
        </Link>

        {/* 피드 버튼 - 홈에서 오른쪽 16px (20+24+16 = 60px) */}
        <Link
          href="#"
          className="absolute left-[60px] top-[14.5px] w-6 h-6 transition-opacity hover:opacity-70"
          aria-label="피드"
        >
          <div className="w-full h-full" />
        </Link>

        {/* ✅ 플로팅 탭 (플러스 버튼 위 12px) */}
        {isPlusOpen && (
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              // 플러스 버튼 top = 128 - 72 - 56 = 0
              // 플로팅 top = (플러스 버튼 top) - 12 - 98 = -110
              top: -110,
              width: 162,
              height: 98,
            }}
          >
            <Image
              src="/icons/plus-floating-tab.svg"
              alt="플러스 플로팅 탭"
              width={162}
              height={98}
              className="w-[162px] h-[98px]"
              priority
            />
          </div>
        )}

        {/* ✅ 플러스 버튼 - 좌우 중앙, 하단에서 72px 위 */}
        <button
          type="button"
          onClick={() => setIsPlusOpen((prev) => !prev)}
          className={[
            'absolute left-1/2 -translate-x-1/2 bottom-[72px] w-14 h-14',
            'transition-transform duration-200 ease-in-out',
            isPlusOpen ? 'rotate-90' : 'rotate-0',
          ].join(' ')}
          aria-label="추가"
          aria-expanded={isPlusOpen}
        >
          <div className="w-full h-full" />
        </button>

        {/* 서재 버튼 - 오른쪽에서 60px (20+24+16 = 60px) */}
        <Link
          href="#"
          className="absolute right-[60px] top-[14.5px] w-6 h-6 transition-opacity hover:opacity-70"
          aria-label="서재"
        >
          <div className="w-full h-full" />
        </Link>

        {/* 프로필 버튼 - 오른쪽 20px */}
        <Link
          href="/profile"
          className="absolute right-5 top-[14.5px] w-6 h-6 transition-opacity hover:opacity-70"
          aria-label="프로필"
        >
          <div className="w-full h-full" />
        </Link>
      </div>
    </div>
  )
}
