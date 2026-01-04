// src/components/common/NavBar.tsx
'use client'
import { useRouter } from 'next/navigation'
import IconFeed from '@/public/icons/navbar/Icon-Feed'
import IconHome from '@/public/icons/navbar/Icon-Home'
import IconLibrary from '@/public/icons/navbar/Icon-Library'
import IconProfile from '@/public/icons/navbar/Icon-Profile'
import FloatingNav from '@/public/icons/navbar/Floating-Button'
import NavBarWave from '@/public/icons/navbar/NavBarWave'

type NavKey = 'home' | 'feed' | 'library' | 'profile'

type NavBarProps = {
  active: NavKey
  onChange?: (next: NavKey) => void
  onCenterClick?: () => void
}

const NAV_ITEMS: { key: NavKey; label: string }[] = [
  { key: 'home', label: '홈' },
  { key: 'feed', label: '피드' },
  { key: 'library', label: '서재' },
  { key: 'profile', label: '프로필' },
]

const ROUTES: Record<NavKey, string> = {
  home: '/home',
  feed: '#',
  library: '#',
  profile: '#',
}

export default function NavBar({
  active,
  onChange,
  onCenterClick,
}: NavBarProps) {
  const router = useRouter()

  const handleNavClick = (key: NavKey) => {
    onChange?.(key)

    const href = ROUTES[key]
    if (href !== '#') {
      router.push(href)
    }
  }

  const renderItem = (item: { key: NavKey; label: string }) => {
    const isActive = active === item.key

    return (
      <button
        key={item.key}
        type="button"
        onClick={() => onChange?.(item.key)}
        className="flex flex-col items-center justify-center text-[11px] px-3"
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
    <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[393px] -translate-x-1/2">
      <div className="relative w-full">
        <div className="pointer-events-none absolute left-0 h-14 w-full">
          <NavBarWave />
        </div>
        <nav
          className="
          mt-43
          flex h-25 w-full items-start
          bg-white
          px-5 pt-[15px] pb-3
        "
        >
          {/* 왼쪽 두 개: gap-4 = 16px */}
          <div className="flex items-center gap-5">
            {NAV_ITEMS.slice(0, 2).map(renderItem)}
          </div>

          {/* 가운데는 자동으로 넓게 차지 */}
          <div className="flex-1" />

          {/* 오른쪽 두 개: gap-4 = 16px */}
          <div className="flex items-center gap-5">
            {NAV_ITEMS.slice(2).map(renderItem)}
          </div>
        </nav>

        {/* 가운데 떠 있는 + 버튼 */}
        <button
          type="button"
          onClick={onCenterClick}
          className="
          absolute left-1/2 -top-9 -translate-x-1/2
          flex h-18 w-18 items-center justify-center
          rounded-full bg-black
        "
        >
          <FloatingNav />
        </button>
      </div>
    </div>
  )
}

/** 아이콘 자리 구분용 네이밍 (나중에 SVG로 교체) */
function iconByName(key: NavKey) {
  switch (key) {
    case 'home':
      return <IconHome />
    case 'feed':
      return <IconFeed />
    case 'library':
      return <IconLibrary />
    case 'profile':
      return <IconProfile />
  }
}
