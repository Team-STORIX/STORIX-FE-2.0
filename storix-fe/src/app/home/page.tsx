// src/app/home/page.tsx
'use client'

import { useState } from 'react'
import HomeHeader from '@/components/home/HomeHeader'
import { CardNav } from '@/components/home/todayTopicRoom/CardNav'
import { TopicRoomCoverSlider } from '@/components/home/todayTopicRoom/TopicRoomCoverSlider'
import HotFeedSlider from '@/components/home/hotFeed/HotFeedSlider'
import MyTasteCard from '@/components/home/myTaste/MyTasteCard'
import HashtagList from '@/components/common/HashtagList'
import NavBar from '@/components/common/NavBar'

export default function Home() {
  const [active, setActive] = useState<'home' | 'feed' | 'library' | 'profile'>(
    'home',
  )

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
            <CardNav header="이 작품, 내 취향일까?" roomName="#" />
            <MyTasteCard />
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
                '무협/사극',
                '액션',
                '로맨스판타지',
                '금발남주',
              ]}
            />
          </div>
        </div>
      </div>
      <NavBar active={active} onChange={setActive} />
    </div>
  )
}
