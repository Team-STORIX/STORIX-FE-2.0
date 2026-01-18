// src/app/library/works/[id]/page.tsx
'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getWorksDetail, type WorksDetail } from '@/lib/api/works/works.api'
import { findTopicRoomIdByWorksName } from '@/lib/api/topicroom/topicroom.api'

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
  const [isLiked, setIsLiked] = useState(false)

  const [work, setWork] = useState<WorksDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const [isCheckingRoom, setIsCheckingRoom] = useState(false)
  const [topicModalOpen, setTopicModalOpen] = useState(false)

  // 1) 작품 상세 조회 API
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setLoading(true)
        const data = await getWorksDetail(worksId)
        if (mounted) setWork(data)
      } catch (e) {
        if (mounted) setWork(null)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => {
      mounted = false
    }
  }, [worksId])

  // 2) UI용 파생값(백엔드 필드가 없을 수도 있어서 안전하게 처리)
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
      rating: (work as any).avgRating ?? 0,
      reviewCount: (work as any).reviewCount ?? 0,
      description: (work as any).description ?? '',
      keywords: (work as any).hashtags ?? [],
      platform: (work as any).platform ?? '',
      worksName: work.worksName ?? '',
      worksType: work.worksType ?? '',
    }
  }, [work, worksId])

  const handleReviewWrite = () => {
    // 리뷰 write 페이지 라우팅
    router.push(`/home/write/review?worksId=${ui.id}`)
  }

  //토픽룸 입장: 조회 → 있으면 바로 이동 / 없으면 생성 모달
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
        onBack={() => router.back()}
        isLiked={isLiked}
        onToggleLike={() => setIsLiked((v) => !v)}
      />

      <WorkHeaderCover
        ui={{
          id: ui.id,
          title: ui.title,
          metaAuthor: ui.metaAuthor,
          thumb: ui.thumb,
          rating: ui.rating,
          reviewCount: ui.reviewCount,
        }}
        isCheckingRoom={isCheckingRoom}
        onReviewWrite={handleReviewWrite}
        onTopicroomEnter={handleTopicroomEnter}
      />

      <WorkTabContent
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
          // ✅ 모달에 넘어가는 데이터 = 작품 상세 API 기반
          id: ui.id,
          title: ui.title,
          meta: ui.worksType ? `${ui.worksType}` : ui.metaAuthor,
          thumb: ui.thumb,
        }}
      />
    </div>
  )
}
