// src/app/writers/feed/components/navigationBar.tsx

'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ReviewWriteBottomSheet from '@/components/home/bottomsheet/ReviewWriteBottomSheet'
import WriteBottomSheet from '@/components/home/bottomsheet/WriteBottomSheet'
import IconFeed from '@/public/common/icons/navbar/Icon-Feed'
import IconProfile from '@/public/common/icons/navbar/Icon-Profile'

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
  const [showReviewSheet, setShowReviewSheet] = useState(false)
  const [showFeedSheet, setShowFeedSheet] = useState(false)

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
        className="flex flex-col items-center justify-center caption-1 px-3 cursor-pointer hover:opacity-80 transition-opacity"
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
    <>
      <div className="fixed z-50 w-full max-w-[393px] bottom-0 left-1/2 -translate-x-1/2">
        <div className="relative w-full">
          <nav className="relative z-10 flex h-[80px] w-full items-start px-5 pt-[15px] pb-3">
            {/* ✅ 왼쪽 절반 중앙에 '피드' */}
            <div className="flex flex-1 items-center justify-center">
              {renderItem(NAV_ITEMS[0])}
            </div>

            {/* ✅ 가운데(플러스) 공간 확보 */}
            <div className="w-[56px]" />

            {/* ✅ 오른쪽 절반 중앙에 '프로필' */}
            <div className="flex flex-1 items-center justify-center">
              {renderItem(NAV_ITEMS[1])}
            </div>
          </nav>

          {/* ✅ 배경은 nav 아래에 깔리도록 z-0 */}
          <div className="absolute inset-x-0 bottom-0 z-0 h-[80px]">
            <Image
              src="/common/icons/navbar/navigationbar-background.svg"
              alt="네비게이션 바 배경"
              width={393}
              height={80}
              className="h-full w-full"
            />
          </div>

          {/* 플로팅 탭 그대로 */}
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

          {/* 플러스 버튼 위치 그대로 */}
          <button
            type="button"
            onClick={handlePlusClick}
            className={[
              'absolute z-20 left-1/2 -translate-x-1/2 bottom-18',
              'w-14 h-14',
              'transition-transform duration-200 ease-in-out',
              'hover:opacity-80',
              isPlusOpen ? 'rotate-90' : 'rotate-0',
            ].join(' ')}
            style={{ bottom: 50 }}
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
    </>
  )
}

function iconByName(key: NavKey) {
  switch (key) {
    case 'feed':
      return <IconFeed />
    case 'profile':
      return <IconProfile />
  }
}
