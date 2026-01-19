// src/app/home/topicroom/page.tsx

import SearchBar from '@/components/common/SearchBar'
import ParticipationChat from '@/components/topicroom/ParticipationChat'
import { CardTopicroomInsideCoverSlider } from '@/components/topicroom/CardTopicroomInsideCoverSlider'
import { TopicRoomData } from '@/components/home/todayTopicRoom/TopicroomCoverCard'

const userName = '스토릭스' // 나중에 유저 정보 받아오면 바꾸기

const MOCK_LIST = [
  {
    id: 1,
    thumbnail: '/image/sample/topicroom-2.webp',
    title: '금쪽일기',
    subtitle: '웹툰 <육아일기>',
    memberCount: 13,
    timeAgo: '1분 전',
  },
  {
    id: 2,
    thumbnail: '/image/sample/topicroom-2.webp',
    title: '연의 등기우편',
    subtitle: '웹툰 <연의 편지>',
    memberCount: 13,
    timeAgo: '1분 전',
  },
  {
    id: 3,
    thumbnail: '/image/sample/topicroom-3.webp',
    title: '이착헌이 누구야?',
    subtitle: '웹소설 <이세계 착한 헌터>',
    memberCount: 13,
    timeAgo: '1분 전',
  },
  {
    id: 4,
    thumbnail: '/image/sample/topicroom-4.webp',
    title: '이착헌이 누구야?',
    subtitle: '웹소설 <이세계 착한 헌터>',
    memberCount: 13,
    timeAgo: '1분 전',
  },
  {
    id: 5,
    thumbnail: '/image/sample/topicroom-3.webp',
    title: '이착헌이 누구야?',
    subtitle: '웹소설 <이세계 착한 헌터>',
    memberCount: 13,
    timeAgo: '1분 전',
  },
]
const MOCK_ROOMS: TopicRoomData[] = [
  {
    id: 'room1',
    imageUrl: '/image/sample/topicroom-1.webp', // 일단 public에 더미 이미지 넣어두고 쓰기
    title: '탄서방 시어머니회',
    subtitle: '웹툰 <상수리나무 아래>',
    memberCount: 13,
  },
  {
    id: 'room2',
    imageUrl: '/image/sample/topicroom-2.webp',
    title: '연의 등기우편',
    subtitle: '웹툰 <연의 편지>',
    memberCount: 20,
  },
  {
    id: 'room3',
    imageUrl: '/image/sample/topicroom-3.webp',
    title: '전독시 덕후들 모여라',
    subtitle: '웹툰 <전지적 독자 시점>',
    memberCount: 22,
  },
  {
    id: 'room4',
    imageUrl: '/image/sample/topicroom-4.webp',
    title: '손자뻘 무림세가 모임',
    subtitle: '웹툰 <무림세가 천대받는 손녀 딸이 되었다>',
    memberCount: 20,
  },
  {
    id: 'room5',
    imageUrl: '/image/sample/topicroom-1.webp',
    title: '탄서방 시어머니회 5',
    subtitle: '웹툰 <상수리나무 아래>',
    memberCount: 22,
  },
]

export default function TopicRoom() {
  return (
    <div>
      <SearchBar />
      <div className="flex flex-col">
        <div className="px-5 py-4">
          <p className="heading-1">{userName}님이 참여 중인 토픽룸</p>
        </div>
        <div className="flex flex-col gap-4">
          <ParticipationChat list={MOCK_LIST} />
        </div>
        <div className="px-5 py-4">
          <p className="heading-1">지금 HOT한 토픽룸</p>
        </div>
        <CardTopicroomInsideCoverSlider rooms={MOCK_ROOMS} />
      </div>
    </div>
  )
}
