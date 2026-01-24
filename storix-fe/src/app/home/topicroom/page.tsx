// src/app/home/topicroom/page.tsx
'use client' // ✅

import { useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SearchBar from '@/components/common/SearchBar'
import ParticipationChat, {
  ParticipationChatItem,
} from '@/components/topicroom/ParticipationChat'
import { formatTopicRoomSubtitle } from '@/lib/api/topicroom/formatTopicRoomSubtitle'
import { CardTopicroomInsideCoverSlider } from '@/components/topicroom/CardTopicroomInsideCoverSlider'
import { TopicRoomData } from '@/components/home/todayTopicRoom/TopicroomCoverCard'
import { useMyTopicRoomsAll } from '@/hooks/topicroom/useMyTopicRoomsAll' // ✅
import { usePopularTopicRooms } from '@/hooks/topicroom/usePopularTopicRooms' // ✅
import { useProfileStore } from '@/store/profile.store'
import { getMyProfile } from '@/lib/api/profile/profile.api'

export default function TopicRoom() {
  const formatTimeAgo = (iso?: string | null) => {
    if (!iso) return ''
    const t = new Date(iso).getTime()
    if (Number.isNaN(t)) return ''
    const diff = Date.now() - t
    if (diff < 60_000) return '방금 전'
    const min = Math.floor(diff / 60_000)
    if (min < 60) return `${min}분 전`
    const hour = Math.floor(min / 60)
    if (hour < 24) return `${hour}시간 전`
    const day = Math.floor(hour / 24)
    return `${day}일 전`
  }

  const router = useRouter() // ✅

  const goSearch = (raw: string) => {
    const k = raw.replace(/^#/, '').trim()
    if (!k) return
    router.push(`/home/topicroom/search?keyword=${encodeURIComponent(k)}`) // ✅
  }
  // ✅ 참여 중 토픽룸: 페이지당 3개
  const { data: myRooms } = useMyTopicRoomsAll({ size: 3 })

  // ✅ HOT 토픽룸
  const { data: popular } = usePopularTopicRooms()

  const participationList = useMemo<ParticipationChatItem[]>(() => {
    const list = myRooms ?? [] // ✅

    return list.map((r) => ({
      id: r.topicRoomId,
      thumbnail: r.thumbnailUrl ?? '/image/sample/topicroom-2.webp',
      title: r.topicRoomName,
      subtitle: formatTopicRoomSubtitle(r.worksType, r.worksName), // ✅
      memberCount: r.activeUserNumber ?? 0,
      timeAgo: formatTimeAgo(r.lastChatTime),
      worksName: r.worksName,
    }))
  }, [myRooms])

  const hotRooms = useMemo<TopicRoomData[]>(() => {
    const list = popular ?? []
    return list.map((r) => ({
      id: String(r.topicRoomId),
      imageUrl: r.thumbnailUrl ?? '/image/sample/topicroom-1.webp',
      title: r.topicRoomName,
      subtitle: formatTopicRoomSubtitle(r.worksType, r.worksName),
      memberCount: r.activeUserNumber ?? 0,
    }))
  }, [popular])

  const me = useProfileStore((s) => s.me)
  const setMe = useProfileStore((s) => s.setMe)

  // ✅ store가 비어있을 때만 1회 보충 fetch
  useEffect(() => {
    let mounted = true

    const hydrate = async () => {
      if (me) return
      try {
        const res = await getMyProfile()
        if (!res.isSuccess) throw new Error(res.message || 'Failed to load me')
        if (!mounted) return
        setMe(res.result)
      } catch (e) {
        console.error('[profile] failed to hydrate me', e)
      }
    }

    hydrate()
    return () => {
      mounted = false
    }
  }, [me, setMe])

  const nickname = me?.nickName ?? ''

  return (
    <div>
      <SearchBar onSearchClick={goSearch} />
      <div className="flex flex-col">
        <div className="px-5 py-4">
          <p className="heading-1">{nickname}님이 참여 중인 토픽룸</p>
        </div>
        <div className="flex flex-col gap-4">
          <ParticipationChat list={participationList} />
        </div>
        <div className="px-5 py-4">
          <p className="heading-1">지금 HOT한 토픽룸</p>
        </div>
        <CardTopicroomInsideCoverSlider rooms={hotRooms} />{' '}
      </div>
    </div>
  )
}
