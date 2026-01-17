// src/components/common/NavBar.tsx
'use client'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ReviewWriteBottomSheet from '@/components/home/bottomsheet/ReviewWriteBottomSheet'
import WriteBottomSheet from '@/components/home/bottomsheet/WriteBottomSheet'
import IconFeed from '@/public/common/icons/navbar/Icon-Feed'
import IconHome from '@/public/common/icons/navbar/Icon-Home'
import IconLibrary from '@/public/common/icons/navbar/Icon-Library'
import IconProfile from '@/public/common/icons/navbar/Icon-Profile'

type NavKey = 'home' | 'feed' | 'library' | 'profile'

type NavBarProps = {
  active: NavKey
  onChange?: (next: NavKey) => void
}

const NAV_ITEMS: { key: NavKey; label: string }[] = [
  { key: 'home', label: '홈' },
  { key: 'feed', label: '피드' },
  { key: 'library', label: '서재' },
  { key: 'profile', label: '프로필' },
]

const ROUTES: Record<NavKey, string> = {
  home: '/home',
  feed: '/feed',
  library: '/library/list',
  profile: '/profile',
}

export default function NavBar({ active, onChange }: NavBarProps) {
  const router = useRouter()
  const [isPlusOpen, setIsPlusOpen] = useState(false)
  const [showReviewSheet, setShowReviewSheet] = useState(false)
  const [showFeedSheet, setShowFeedSheet] = useState(false) // (피드 바텀시트는 나중)

  const handlePlusClick = () => {
    setIsPlusOpen((prev) => !prev)
  }

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
        onClick={() => handleNavClick(item.key)}
        className="flex flex-col items-center justify-center caption-1 px-3 cursor-pointer"
      >
        <div className="mb-1 flex h-6 w-6 items-center justify-center ">
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
    <>
      <div className="fixed z-50 w-full max-w-[393px] bottom-0 left-1/2 -translate-x-1/2">
        <div className="relative w-full">
          <nav className="relative z-10 flex h-20 w-full items-start px-5 pt-[15px] pb-3">
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
          {/* w-full max-w-[393px] h-20 bottom-0 left-1/2 -translate-x-1/2 */}
          <div className="absolute inset-x-0 bottom-0 h-[80px]  ">
            <Image
              src="/common/icons/navbar/navigationbar-background.svg"
              alt="네비게이션 바 배경"
              width={393}
              height={80}
            />
          </div>
          {/* 플로팅 탭 */}
          {isPlusOpen && (
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                width: 162,
                height: 98,
                bottom: 130,
              }}
            >
              <div className="w-40.5 overflow-hidden rounded-2xl bg-white border-1 border-gray-200 shadow-[0_8px_10px_0_rgba(0,0,0,0.25)]">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlusOpen(false)
                    setShowReviewSheet(true)
                  }}
                  className="flex w-full items-center justify-between px-4 py-3 border-b border-gray-200 hover:opacity-70"
                >
                  <span className="body-1 text-gray-800">리뷰 작성</span>
                  <Image
                    src="/common/icons/navbar/review.svg"
                    alt="리뷰 작성"
                    width={28}
                    height={28}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsPlusOpen(false)
                    setShowFeedSheet(true)
                  }}
                  className="flex w-full items-center justify-between px-4 py-3 hover:opacity-70"
                >
                  <span className="body-1 text-gray-800">피드 작성</span>
                  <Image
                    src="/common/icons/navbar/feed.svg"
                    alt="피드 작성"
                    width={28}
                    height={28}
                  />
                </button>
              </div>
            </div>
          )}

          {/* 플러스 버튼 */}
          <button
            type="button"
            onClick={handlePlusClick}
            className={[
              'absolute z-20 left-1/2 -translate-x-1/2 bottom-18',
              'w-14 h-14',
              'transition-transform duration-200 ease-in-out',
              'hover:opacity-80 cursor-pointer',
              isPlusOpen ? 'rotate-90' : 'rotate-0',
            ].join(' ')}
            style={{ bottom: 50 }} // ✅ NavBar가 20px 줄어든 만큼 + 20px 아래로
            aria-label="추가"
            aria-expanded={isPlusOpen}
          >
            <Image
              src="/common/icons/navbar/plus.svg"
              alt="플러스"
              width={56}
              height={56}
              className="w-[56px] h-[56px]"
              priority
            />
          </button>
        </div>
      </div>
      {showReviewSheet && (
        <ReviewWriteBottomSheet onClose={() => setShowReviewSheet(false)} />
      )}
      {showFeedSheet && (
        <WriteBottomSheet onClose={() => setShowFeedSheet(false)} />
      )}
    </>
  )
}

/** 아이콘 자리 구분용 네이밍 */
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
