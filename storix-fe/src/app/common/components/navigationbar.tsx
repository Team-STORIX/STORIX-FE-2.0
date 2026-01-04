// src/app/common/components/navigationbar.tsx
'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type NavKey = 'home' | 'feed' | 'library' | 'profile'

export default function NavigationBar() {
  const router = useRouter()
  const [active, setActive] = useState<NavKey>('home')
  const [isPlusOpen, setIsPlusOpen] = useState(false)

  const items = useMemo(
    () =>
      [
        {
          key: 'home' as const,
          label: '홈',
          icon: '/common/icons/navigation-home.svg',
          iconActive: '/common/icons/navigation-home-black.svg',
          pos: 'left-5 top-[14.5px]',
          href: '#',
        },
        {
          key: 'feed' as const,
          label: '피드',
          icon: '/common/icons/navigation-feed.svg',
          iconActive: '/common/icons/navigation-feed-black.svg',
          pos: 'left-[84px] top-[14.5px]',
          href: '/feed',
        },
        {
          key: 'library' as const,
          label: '서재',
          icon: '/common/icons/navigation-library.svg',
          iconActive: '/common/icons/navigation-library-black.svg',
          pos: 'right-[84px] top-[14.5px]',
          href: '#',
        },
        {
          key: 'profile' as const,
          label: '프로필',
          icon: '/common/icons/navigation-profile.svg',
          iconActive: '/common/icons/navigation-profile-black.svg',
          pos: 'right-5 top-[14.5px]',
          href: '/profile',
        },
      ] as const,
    [],
  )

  const handleNavClick = (key: NavKey, href: string) => {
    setActive(key)
    setIsPlusOpen(false)

    if (href !== '#') {
      router.push(href)
    }
  }

  const handlePlusClick = () => {
    setIsPlusOpen((prev) => !prev)
  }

  return (
    <div className="absolute bottom-0 left-0 w-full z-50">
      <div className="relative w-full h-[100px]">
        {/* 배경 */}
        <Image
          src="/common/icons/navigationbar-background.svg"
          alt="네비게이션 바 배경"
          width={393}
          height={100}
          className="w-full h-full"
          priority
        />

        {/* 아이콘들 */}
        {items.map((item) => {
          const isActive = active === item.key
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleNavClick(item.key, item.href)}
              className={[
                'absolute',
                item.pos,
                'w-[48px] h-[48px]',
                'transition-opacity hover:opacity-70',
              ].join(' ')}
              aria-label={item.label}
              aria-pressed={isActive}
            >
              <Image
                src={isActive ? item.iconActive : item.icon}
                alt={item.label}
                width={48}
                height={48}
                className="w-[48px] h-[48px]"
                priority
              />
            </button>
          )
        })}

        {/* 플로팅 탭 */}
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

        {/* 플러스 버튼 */}
        <button
          type="button"
          onClick={handlePlusClick}
          className={[
            'absolute left-1/2 -translate-x-1/2 bottom-[72px]',
            'w-[56px] h-[56px]',
            'transition-transform duration-200 ease-in-out',
            'hover:opacity-70',
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
