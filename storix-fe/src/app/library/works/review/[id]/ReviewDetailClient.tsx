// src/app/library/works/review/[id]/ReviewDetailClient.tsx
'use client'

import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  useLikeWorksReview,
  useWorksReviewDetail,
} from '@/hooks/works/useWorksReviews'

const FALLBACK_COVER_SRC = '/image/sample/topicroom-1.webp'

const formatKoreanDate = (iso?: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  const day = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
  return `${yyyy}.${mm}.${dd} (${day})`
}

export default function ReviewDetailClient({ reviewId }: { reviewId: number }) {
  const router = useRouter()
  const params = useParams<{ id: string }>()

  // props가 NaN/0이면 params에서 재파싱 (enabled=false 방지)
  const resolvedReviewId =
    Number.isFinite(reviewId) && reviewId > 0
      ? reviewId
      : Number.parseInt(params?.id ?? '', 10)

  const { data, isLoading, isError } = useWorksReviewDetail(resolvedReviewId)

  // reviewId 자체가 유효하지 않으면 API 호출도 못하니 다른 안내
  if (!Number.isFinite(resolvedReviewId) || resolvedReviewId <= 0) {
    return (
      <div className="p-4 body-2 text-gray-400">잘못된 리뷰 접근이에요</div>
    )
  }

  const ui = useMemo(() => {
    const worksMetaParts: string[] = []
    if (data?.artistName) worksMetaParts.push(data.artistName)
    if (data?.worksType) worksMetaParts.push(data.worksType)

    return {
      worksId: data?.worksId ?? 0,
      userName: data?.userName ?? '',
      profileImageUrl: data?.profileImageUrl ?? null,
      worksTitle: data?.worksName ?? '',
      worksMeta: worksMetaParts.join(' · '),
      coverSrc: data?.thumbnailUrl ?? FALLBACK_COVER_SRC,
      rating: typeof data?.rating === 'number' ? data.rating : null,
      dateText: formatKoreanDate(data?.lastCreatedTime ?? data?.createdAt),
      content: data?.content ?? '',
      likeCount: typeof data?.likeCount === 'number' ? data.likeCount : 0,
      isLiked: !!data?.isLiked,
    }
  }, [data])

  // 좋아요 mutation (invalidate는 훅 내부에서 처리)
  const likeMutation = useLikeWorksReview({ worksId: ui.worksId })

  // 즉시 반영용 local state (단건 조회의 likeCount/isLiked로 sync)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    setLiked(ui.isLiked)
    setLikeCount(ui.likeCount)
  }, [ui.isLiked, ui.likeCount])

  const onClickLike = async () => {
    if (likeMutation.isPending) return

    const prevLiked = liked
    const prevCount = likeCount

    // optimistic toggle
    const nextLiked = !prevLiked
    const nextCount = Math.max(0, prevCount + (nextLiked ? 1 : -1))

    setLiked(nextLiked)
    setLikeCount(nextCount)

    try {
      const res = await likeMutation.mutateAsync(resolvedReviewId)

      // 서버가 isLiked/likeCount 내려주면 그 값으로 최종 보정
      const serverLiked =
        (res as any)?.isLiked != null ? !!(res as any).isLiked : undefined
      const serverCount =
        (res as any)?.likeCount != null
          ? Number((res as any).likeCount)
          : undefined

      if (typeof serverLiked === 'boolean') setLiked(serverLiked)
      if (Number.isFinite(serverCount as number))
        setLikeCount(serverCount as number)
    } catch {
      // 실패 시 롤백
      setLiked(prevLiked)
      setLikeCount(prevCount)
    }
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isMenuOpen) return
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (!menuRef.current) return
      if (!menuRef.current.contains(target)) setIsMenuOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [isMenuOpen])

  if (isLoading) {
    return <div className="p-4 body-2 text-gray-400">로딩중...</div>
  }

  if (isError) {
    return (
      <div className="p-4 body-2 text-gray-400">리뷰를 불러오지 못했어요</div>
    )
  }

  if (!data) {
    return (
      <div className="p-4 body-2 text-gray-400">리뷰 데이터가 비어있어요</div>
    )
  }

  const openDeleteModal = () => {
    setIsMenuOpen(false)
    setIsDeleteModalOpen(true)
  }

  return (
    <main className="relative mx-auto flex h-screen max-w-[393px] flex-col bg-white">
      {/* TopBar */}
      <div className="flex h-[54px] items-center justify-between px-4">
        <button onClick={() => router.back()} className="cursor-pointer">
          <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </button>

        <span className="text-body-1 font-medium">리뷰</span>

        <div className="relative flex items-center gap-2" ref={menuRef}>
          <button
            type="button"
            className="caption-1 rounded-full border border-gray-200 px-3 py-1 text-gray-500 cursor-pointer"
          >
            기록카드
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen((p) => !p)}
            className="cursor-pointer p-1"
            aria-label="메뉴"
          >
            <Image
              src="/icons/menu-3dots.svg"
              alt="메뉴"
              width={24}
              height={24}
            />
          </button>

          {/* 상단 케밥 드롭다운 */}
          {isMenuOpen && (
            <div className="absolute right-0 top-10 z-20 w-[120px] overflow-hidden rounded-xl bg-white shadow-[0_8px_24px_rgba(0,0,0,0.12)]">
              <button
                type="button"
                className="w-full px-4 py-3 text-left body-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => {
                  setIsMenuOpen(false)
                  alert('리뷰 수정 (추후 구현)')
                }}
              >
                리뷰 수정
              </button>
              <button
                type="button"
                className="w-full px-4 py-3 text-left body-2 hover:bg-gray-50 cursor-pointer"
                onClick={openDeleteModal}
              >
                리뷰 삭제
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {/* 유저 라인 */}
        <div className="flex items-start gap-3 py-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[var(--color-magenta-300)] flex items-center justify-center">
            {ui.profileImageUrl ? (
              <Image
                src={ui.profileImageUrl}
                alt={ui.userName || 'profile'}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={'/common/icons/reviewProfile.svg'}
                alt={ui.userName || 'profile'}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="body-1 truncate">{ui.userName}</p>
          </div>
        </div>

        {/* 작품 카드 */}
        <div className="flex items-center gap-3 -mx-4 px-4 py-5 border-b border-gray-100">
          <div className="relative h-[121px] w-[87px] shrink-0 overflow-hidden rounded-md bg-gray-100">
            <Image
              src={ui.coverSrc}
              alt={ui.worksTitle}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="heading-3 truncate">{ui.worksTitle}</p>
            <p className="body-2 mt-1 truncate text-gray-400">{ui.worksMeta}</p>

            {/* ratingChip */}
            {ui.rating !== null && (
              <span
                className={`caption-1 mt-3 w-14 h-6 inline-flex items-center gap-1 
                rounded-3xl border border-gray-200 
                px-2.5 py-1 text-[var(--color-magenta-300)] text-center`}
              >
                <Image
                  src="/search/littleStar.svg"
                  alt="star icon"
                  width={14}
                  height={14}
                  className="inline-block mr-1"
                  priority
                />
                {Number(ui.rating ?? 0).toFixed(1)}
              </span>
            )}
          </div>
        </div>

        {/* 날짜 + 본문 */}
        <div className="flex flex-col py-5 px-2.5 gap-5">
          {ui.dateText ? (
            <p className="flex date-text -mx-2.5 px-2.5 border-l-[2px] border-gray-500 ">
              {ui.dateText}
            </p>
          ) : null}

          <p className="flex body-1 whitespace-pre-line text-gray-800 leading-7">
            {ui.content}
          </p>
          {/* 좋아요 */}
          <button
            type="button"
            onClick={onClickLike}
            disabled={likeMutation.isPending}
            className="flex items-center gap-1 text-gray-500 cursor-pointer"
            aria-label="리뷰 좋아요"
          >
            <Image
              src={liked ? '/icons/icon-like-pink.svg' : '/icons/icon-like.svg'}
              alt="좋아요"
              width={20}
              height={20}
            />
            <span className="caption-1">{likeCount}</span>
          </button>
        </div>
      </div>

      {/* 삭제 확인 모달 (UI만, 액션 추후 연동) */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="w-full max-w-[340px] rounded-2xl bg-white px-5 py-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="heading-2 text-center">리뷰 삭제</p>
            <p className="body-2 mt-2 text-center text-gray-400">
              정말 리뷰를 삭제하시겠습니까?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="flex-1 rounded-xl border border-gray-200 py-3 body-1 text-gray-500 cursor-pointer"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                취소
              </button>
              <button
                type="button"
                className="flex-1 rounded-xl bg-black py-3 body-1 text-white cursor-pointer"
                onClick={() => {
                  setIsDeleteModalOpen(false)
                  alert('삭제 (추후 구현)')
                }}
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
