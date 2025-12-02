// src/app/home/page.tsx

import HomeHeader from '@/components/home/HomeHeader'
import TopicNav from '@/components/home/todayTopicRoom/TopicNav'
import { TopicRoomCoverSlider } from '@/components/home/todayTopicRoom/TopicRoomCoverSlider'
import { TopicRoomData } from '@/components/home/todayTopicRoom/TopicroomCoverCard'
import HotFeedSlider from '@/components/home/hotFeed/HotFeedSlider'
import MyTypeSlider from '@/components/home/myType/MyTypeSlider'

const MOCK_ROOMS: TopicRoomData[] = [
  {
    id: 'room1',
    imageUrl: '/sample/topicroom-1.jpg', // 일단 public에 더미 이미지 넣어두고 쓰기
    title: '탄서방 시어머니회',
    subtitle: '웹툰 상수리나무 아래',
    memberCount: 13,
  },
  {
    id: 'room2',
    imageUrl: '/sample/topicroom-1.jpg',
    title: '탄서방 시어머니회 2',
    subtitle: '웹툰 상수리나무 아래',
    memberCount: 20,
  },
  {
    id: 'room3',
    imageUrl: '/sample/topicroom-1.jpg',
    title: '탄서방 시어머니회 3',
    subtitle: '웹툰 상수리나무 아래',
    memberCount: 22,
  },
]

const userName = '스토릭스' // 나중에 유저 정보 받아오면 바꾸기

export default function Home() {
  return (
    <div>
      <HomeHeader />
      <div className="w-full h-full flex flex-col justify-center gap-6 px-4">
        <div className="flex flex-col w-full items-center text-center">
          <TopicNav />
          <TopicRoomCoverSlider rooms={MOCK_ROOMS} />
        </div>
        <div className="flex flex-col w-full">
          <p className="flex items-center h-17 text-left heading-1 px-1">
            지금 뜨는 글
          </p>
          <HotFeedSlider />
        </div>
        <div className="flex flex-col w-full">
          <p className="flex items-center h-17 text-left heading-1 px-1">
            {userName}님 취향 저격 작품
          </p>
          <MyTypeSlider />
        </div>
        <div className="flex flex-col w-full">
          <p className="flex items-center h-17 text-left heading-1 px-1">
            이런 해시태그는 어때요?
          </p>
          <MyTypeSlider />
        </div>
      </div>
    </div>
  )
}
