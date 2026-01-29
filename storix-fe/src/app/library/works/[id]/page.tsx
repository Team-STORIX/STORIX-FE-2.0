// src/app/library/works/[id]/page.tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { findTopicRoomIdByWorksName } from '@/lib/api/topicroom/topicroom.api'
import { useWorksDetail } from '@/hooks/works/useWorksDetail'
import { useFavoriteWork } from '@/hooks/favorite/useFavoriteWork'
import { useWorksMyReview } from '@/hooks/works/useWorksReviews'

import TopicRoomCreateModal from '@/components/topicroom/TopicRoomCreateModal'
import WorkTopBar from '@/components/library/works/WorkTopBar'
import WorkHeaderCover from '@/components/library/works/WorkHeaderCover'
import WorkTabContent from '@/components/library/works/WorkTapContent'

type TabKey = 'info' | 'review'

const STORAGE_KEY_REVIEW = 'storix:selectedWork:review'

export default function LibraryWorkHomePage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const worksId = Number(params?.id)

  const handleBack = () => {
    const raw = new URLSearchParams(window.location.search).get('returnTo')
    if (raw) {
      const decoded = decodeURIComponent(raw)
      if (decoded.startsWith('/')) {
        router.push(decoded)
        return
      }
    }

    if (window.history.length > 1) {
      router.back()
      return
    }

    router.push('/library/list')
  }

  const [tab, setTab] = useState<TabKey>('info')
  const { isFavorite, toggleFavorite } = useFavoriteWork(worksId)

  const { data: work, isLoading: loading } = useWorksDetail(worksId)

  // 내 리뷰 존재 여부(이미 작성했는지)
  const { data: myReview } = useWorksMyReview(worksId)

  const [isCheckingRoom, setIsCheckingRoom] = useState(false)
  const [topicModalOpen, setTopicModalOpen] = useState(false)

  // 토스트 (이미 작성 시)
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
    //이미 리뷰가 있으면 작성 대신 토스트
    if (myReview?.reviewId) {
      showToast('이미 작성하였습니다')
      return
    }

    //review/write 페이지에서 작품 정보 복구용(있으면 활용)
    try {
      const meta = [ui.metaAuthor, ui.metaWorks].filter(Boolean).join(' · ')
      sessionStorage.setItem(
        STORAGE_KEY_REVIEW,
        JSON.stringify({
          id: ui.id,
          title: ui.title,
          meta,
          thumb: ui.thumb,
        }),
      )
    } catch {
      // ignore
    }

    //요구 라우팅으로 변경
    router.push(`/feed/review/write/${ui.id}`)
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
        onBack={handleBack}
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
        onReviewWrite={handleReviewWrite} //(라우팅 변경/토스트)
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
        onReviewWrite={handleReviewWrite} // (라우팅 변경/토스트)
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
