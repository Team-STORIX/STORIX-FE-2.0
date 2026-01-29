// src/app/library/works/[id]/page.tsx
'use client'

import { useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { findTopicRoomIdByWorksName } from '@/lib/api/topicroom/topicroom.api'
import { useWorksDetail } from '@/hooks/works/useWorksDetail'
import { useFavoriteWork } from '@/hooks/favorite/useFavoriteWork'

import TopicRoomCreateModal from '@/components/topicroom/TopicRoomCreateModal'
import WorkTopBar from '@/components/library/works/WorkTopBar'
import WorkHeaderCover from '@/components/library/works/WorkHeaderCover'
import WorkTabContent from '@/components/library/works/WorkTapContent'

type TabKey = 'info' | 'review'

export default function LibraryWorkHomePage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const worksId = Number(params?.id)

  const [tab, setTab] = useState<TabKey>('info')
  const { isFavorite, toggleFavorite } = useFavoriteWork(worksId)

  const { data: work, isLoading: loading } = useWorksDetail(worksId)

  const [isCheckingRoom, setIsCheckingRoom] = useState(false)
  const [topicModalOpen, setTopicModalOpen] = useState(false)

  //작품 상세 조회는 React Query 훅으로 통일

  const ui = useMemo(() => {
    if (!work) {
      return {
        id: worksId,
        title: '',
        metaAuthor: '',
        metaWorks: '',
        thumb: '',
        rating: 0,
        reviewCount: 0,
        description: '',
        keywords: [] as string[],
        platform: '',
        worksName: '',
        worksType: '',
      }
    }

    const metaAuthorParts: string[] = []
    if (work.author) metaAuthorParts.push(`P. ${work.author}`)
    if (work.illustrator) metaAuthorParts.push(`I. ${work.illustrator}`)
    const metaAuthor = metaAuthorParts.join(' , ')

    const metaWorksParts: string[] = []
    if (work.worksType) metaWorksParts.push(`${work.worksType}`)
    if (work.genre) metaWorksParts.push(`${work.genre}`)
    const metaWorks = metaWorksParts.join(' · ')

    return {
      id: work.worksId,
      title: work.worksName ?? '',
      metaAuthor,
      metaWorks,
      thumb: work.thumbnailUrl ?? '',
      rating: work.avgRating ?? 0,
      reviewCount: work.reviewCount ?? 0,
      description: work.description ?? '',
      keywords: work.hashtags ?? [],
      platform: work.platform ?? '',
      worksName: work.worksName ?? '',
      worksType: work.worksType ?? '',
    }
  }, [work, worksId])

  const handleReviewWrite = () => {
    router.push(`/home/write/review?worksId=${ui.id}`)
  }

  const handleTopicroomEnter = async () => {
    if (!ui.worksName) return
    try {
      setIsCheckingRoom(true)

      const existingRoomId = await findTopicRoomIdByWorksName(ui.worksName)

      if (existingRoomId) {
        router.push(
          `/home/topicroom/${existingRoomId}?worksName=${encodeURIComponent(
            ui.worksName,
          )}`,
        )
        return
      }

      setTopicModalOpen(true)
    } catch (e) {
      alert(e instanceof Error ? e.message : '토픽룸 확인 실패')
    } finally {
      setIsCheckingRoom(false)
    }
  }

  if (loading) {
    return <div className="p-4 body-2 text-gray-400">로딩중...</div>
  }

  if (!work) {
    return (
      <div className="p-4 body-2 text-gray-400">
        작품 정보를 불러오지 못했어요
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-white">
      <WorkTopBar
        onBack={() => router.push('/library/list')}
        isLiked={isFavorite}
        onToggleLike={toggleFavorite}
      />

      <WorkHeaderCover
        ui={{
          id: ui.id,
          title: ui.title,
          metaAuthor: ui.metaAuthor,
          thumb: ui.thumb,
          rating: ui.rating,
          reviewCount: ui.reviewCount,
          worksType: ui.worksType,
        }}
        isCheckingRoom={isCheckingRoom}
        onReviewWrite={handleReviewWrite}
        onTopicroomEnter={handleTopicroomEnter}
      />

      <WorkTabContent
        worksId={ui.id}
        tab={tab}
        onChangeTab={setTab}
        ui={{
          reviewCount: ui.reviewCount,
          title: ui.title,
          description: ui.description,
          keywords: ui.keywords,
          platform: ui.platform,
        }}
        onReviewWrite={handleReviewWrite}
      />

      <TopicRoomCreateModal
        open={topicModalOpen}
        onClose={() => setTopicModalOpen(false)}
        work={{
          id: ui.id,
          title: ui.title,
          meta: ui.worksType ? `${ui.worksType}` : ui.metaAuthor,
          thumb: ui.thumb,
        }}
      />
    </div>
  )
}
