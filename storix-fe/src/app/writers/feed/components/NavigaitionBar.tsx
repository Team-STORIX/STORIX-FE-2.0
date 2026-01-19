// src/components/common/NavBar.tsx
'use client'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import IconFeed from '@/public/icons/navbar/Icon-Feed'
import IconProfile from '@/public/icons/navbar/Icon-Profile'

type NavKey = 'feed' | 'profile'

type NavBarProps = {
  active: NavKey
  onChange?: (next: NavKey) => void
}

const NAV_ITEMS: { key: NavKey; label: string }[] = [
  { key: 'feed', label: '피드' },
  { key: 'profile', label: '프로필' },
]

const ROUTES: Record<NavKey, string> = {
  feed: '/writers/feed',
  profile: '/writers/profile',
}

export default function NavBar({ active, onChange }: NavBarProps) {
  const router = useRouter()
  const [isPlusOpen, setIsPlusOpen] = useState(false)

  const handlePlusClick = () => {
    setIsPlusOpen((prev) => !prev)
  }

  const handleNavClick = (key: NavKey) => {
    onChange?.(key)
    router.push(ROUTES[key])
  }

  const renderItem = (item: { key: NavKey; label: string }) => {
    const isActive = active === item.key

    return (
      <button
        key={item.key}
        type="button"
        onClick={() => handleNavClick(item.key)}
        className="flex flex-col items-center justify-center caption-1 px-3 hover:opacity-70 transition-opacity cursor-pointer"
      >
        <div className="mb-1 flex h-6 w-6 items-center justify-center">
          <span className={isActive ? 'text-gray-900' : 'text-gray-300'}>
            {iconByName(item.key)}
          </span>
        </div>
        <span className={isActive ? 'text-gray-900' : 'text-gray-300'}>
          {item.label}
        </span>
      </button>
    )
  }

  return (
    <div className="fixed z-50 w-full max-w-[393px] bottom-0 left-1/2 -translate-x-1/2">
      <div className="relative w-full">
        {/* ✅ 좌/우 2개만, 플러스 기준 중앙 정렬 배치 */}
        <nav className="relative z-10 flex h-24 w-full items-start px-5 pt-[15px] pb-3">
          {/* 왼쪽: 피드(플러스 왼쪽 중앙) */}
          <div className="flex-1 flex justify-center">
            {renderItem(NAV_ITEMS[0])}
          </div>

          {/* 가운데: 플러스 영역 공간 확보 */}
          <div className="w-[56px]" />

          {/* 오른쪽: 프로필(플러스 오른쪽 중앙) */}
          <div className="flex-1 flex justify-center">
            {renderItem(NAV_ITEMS[1])}
          </div>
        </nav>

        <div className="fixed w-full max-w-[393px] bottom-0 left-1/2 -translate-x-1/2">
          <Image
            src="/common/icons/navigationbar-background.svg"
            alt="네비게이션 바 배경"
            width={393}
            height={100}
          />
        </div>

        {/* 플로팅 탭 (기존 유지) */}
        {isPlusOpen && (
          <div
            className="absolute left-1/2 -translate-x-1/2"
            style={{
              width: 162,
              height: 98,
              bottom: 72 + 56 + 12,
            }}
          >
            <Image
              src="/common/icons/plus-floating-tab.svg"
              alt="플러스 플로팅 탭"
              width={162}
              height={98}
              className="w-[162px] h-[98px]"
              priority
            />
          </div>
        )}

        {/* 플러스 버튼 (기존 유지) */}
        <button
          type="button"
          onClick={handlePlusClick}
          className={[
            'absolute left-1/2 -translate-x-1/2 bottom-18',
            'w-14 h-14',
            'transition-transform duration-200 ease-in-out',
            'hover:opacity-70 cursor-pointer',
            isPlusOpen ? 'rotate-90' : 'rotate-0',
          ].join(' ')}
          aria-label="추가"
          aria-expanded={isPlusOpen}
        >
          <Image
            src="/common/icons/plus.svg"
            alt="플러스"
            width={56}
            height={56}
            className="w-[56px] h-[56px]"
            priority
          />
        </button>
      </div>
    </div>
  )
}

/** 아이콘 자리 구분용 네이밍 */
function iconByName(key: NavKey) {
  switch (key) {
    case 'feed':
      return <IconFeed />
    case 'profile':
      return <IconProfile />
  }
}
