// src/app/home/page.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation' //
import HomeHeader from '@/components/home/HomeHeader'
import { CardNav } from '@/components/home/todayTopicRoom/CardNav'
import { TopicRoomCoverSlider } from '@/components/home/todayTopicRoom/TopicRoomCoverSlider'
import HotFeedSlider from '@/components/home/hotFeed/HotFeedSlider'
import MyTasteCard from '@/components/home/myTaste/MyTasteCard'
import HashtagList from '@/components/common/HashtagList'
import NavBar from '@/components/common/NavBar'
import { usePreferenceExploration } from '@/hooks/preference/usePreferenceExploration'

export default function Home() {
  const router = useRouter() //
  const [active, setActive] = useState<'home' | 'feed' | 'library' | 'profile'>(
    'home',
  )

  const { refetch: refetchExploration, isFetching: checkingExploration } =
    usePreferenceExploration({ enabled: false })

  // 토스트
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const toastTimerRef = useRef<number | null>(null)

  const showToast = (message: string) => {
    setToastMessage(message)
    setToastOpen(true)
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current)
      toastTimerRef.current = null
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastOpen(false)
      toastTimerRef.current = null
    }, 1500)
  }

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current)
        toastTimerRef.current = null
      }
    }
  }, [])

  const handleMyTasteClick = async () => {
    if (checkingExploration) return
    try {
      const r = await refetchExploration()
      const items = r.data?.result ?? []

      // 이미 오늘 참여한 경우: 빈 리스트
      if (items.length === 0) {
        showToast('하루 한번 만 가능합니다.')
        return
      }

      router.push('/home/preference')
    } catch {
      showToast('요청에 실패했어요. 잠시 후 다시 시도해 주세요.')
    }
  }

  const goSearchResult = (raw: string) => {
    const k = raw.replace(/^#/, '').trim()
    if (!k) return
    router.push(`/home/search/result?keyword=${encodeURIComponent(k)}`) //
  }

  return (
    <div className="px-4">
      <HomeHeader />
      <div className="w-full h-full flex flex-col pb-32">
        {/* 위쪽만 스크롤 */}
        <div className="flex-1 flex flex-col gap-[24px] overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col items-center text-center">
            <CardNav header="실시간 작품 이야기!" roomName="/home/topicroom" />
            <TopicRoomCoverSlider />
          </div>

          <div className="flex flex-col w-full">
            <CardNav header="오늘의 피드" roomName="/feed" />
            <HotFeedSlider />
          </div>

          <div className="flex flex-col w-full">
            <CardNav
              header="이 작품, 내 취향일까?"
              roomName="#"
              onNavigate={handleMyTasteClick}
            />
            <div
              role="button"
              tabIndex={0}
              onClick={handleMyTasteClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleMyTasteClick()
              }}
              className="cursor-pointer"
            >
              <MyTasteCard />
            </div>
          </div>

          <div className="flex flex-col w-full mb-8">
            <div className="flex w-full items-center justify-between py-4 px-1">
              <div className="flex items-center justify-center">
                <p className="heading-1">이런 키워드, 좋아하실 것 같아요</p>
              </div>
            </div>
            <HashtagList
              items={[
                '로맨스',
                '공주',
                '이세계',
                '악녀',
                '판타지',
                '환생',
                '청춘',
              ]}
              onSelect={goSearchResult} //
            />
          </div>
        </div>
      </div>
      <NavBar active={active} onChange={setActive} />

      {toastOpen && (
        <div
          className="fixed left-1/2 -translate-x-1/2 z-[130]"
          style={{ bottom: 24 }}
          role="status"
          aria-live="polite"
        >
          <div
            className="relative flex items-center gap-2 px-4 h-[56px] rounded-[12px] shadow-md"
            style={{
              width: 333,
              backgroundColor: 'var(--color-gray-900)',
              color: 'var(--color-white)',
            }}
          >
            <span className="body-2">{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}
