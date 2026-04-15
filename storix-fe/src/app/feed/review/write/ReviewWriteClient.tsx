// src/app/feed/review/write/ReviewWriteClient.tsx
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import RatingInput from '@/components/common/RatingInput'
import SpoilerToggle from '@/components/feed/write/SpoilerToggle'
import { useUpdateMyReview } from '@/hooks/works/useWorksReviews'
import { createReaderReview } from '@/lib/api/plus/plusWrite'

type Work = { id: number; title: string; meta: string; thumb: string }
type Props = {
  worksId: number
}

const STORAGE_KEY_REVIEW = 'storix:selectedWork:review'
const STORAGE_KEY_EDIT_REVIEW = 'storix:editReview'
const MAX_CONTENT_LENGTH = 500

export default function ReviewWriteClient({ worksId }: Props) {
  const router = useRouter()

  const [resolvedWork, setResolvedWork] = useState<Work | null>(null)
  const [text, setText] = useState('')
  const [spoiler, setSpoiler] = useState(false)
  const [spoilerMessage, setSpoilerMessage] = useState('')
  const [rating, setRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const [isEditMode, setIsEditMode] = useState(false)
  const [editReviewId, setEditReviewId] = useState<number | null>(null)

  const updateMutation = useUpdateMyReview({ worksId })

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY_REVIEW)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as Work
      if (parsed?.id === worksId) setResolvedWork(parsed)
    } catch {
      // ignore
    }
  }, [worksId])

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const mode = sp.get('mode')
    const rid = Number(sp.get('reviewId') ?? '')

    if (mode !== 'edit' || !Number.isFinite(rid) || rid <= 0) return

    setIsEditMode(true)
    setEditReviewId(rid)

    const raw = sessionStorage.getItem(STORAGE_KEY_EDIT_REVIEW)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as {
        reviewId: number
        worksId: number
        rating?: number | null
        isSpoiler?: boolean
        spoilerScript?: string
        content?: string
      }

      if (parsed?.reviewId !== rid) return

      if (typeof parsed.rating === 'number') setRating(parsed.rating)
      if (typeof parsed.content === 'string') setText(parsed.content)
      if (typeof parsed.isSpoiler === 'boolean') setSpoiler(parsed.isSpoiler)
      if (typeof parsed.spoilerScript === 'string') {
        setSpoilerMessage(parsed.spoilerScript)
      }
    } catch {
      // ignore
    }
  }, [])

  const content = text.trim()
  const contentLength = text.length

  const canSubmit = useMemo(() => {
    if (!resolvedWork?.id) return false
    if (content.length === 0) return false
    if (content.length > MAX_CONTENT_LENGTH) return false
    if (rating < 0.5) return false
    return true
  }, [resolvedWork?.id, content.length, rating])

  const onSubmit = async () => {
    if (!resolvedWork?.id) return
    if (!canSubmit || submitting) return

    const spoilerScript = spoiler ? spoilerMessage.trim() : ''

    const extractReviewId = (res: any) => {
      return (
        res?.reviewId ??
        res?.id ??
        res?.result?.reviewId ??
        res?.result?.id ??
        res?.result?.result?.reviewId ??
        res?.result?.result?.id
      )
    }

    try {
      setSubmitting(true)

      if (isEditMode && editReviewId) {
        await updateMutation.mutateAsync({
          reviewId: editReviewId,
          payload: {
            rating: rating.toFixed(1),
            isSpoiler: spoiler,
            spoilerScript,
            content,
          },
        })

        sessionStorage.removeItem(STORAGE_KEY_EDIT_REVIEW)
        router.replace(`/library/works/review?id=${editReviewId}`)
        return
      }

      const res = await createReaderReview({
        worksId: resolvedWork.id,
        rating: rating.toFixed(1),
        isSpoiler: spoiler,
        spoilerScript,
        content,
      })

      sessionStorage.removeItem(STORAGE_KEY_REVIEW)

      const newReviewId = extractReviewId(res)
      if (newReviewId) {
        router.replace(
          `/library/works/review?id=${newReviewId}&from=reviewWrite`,
        )
        return
      }

      router.replace(`/library/works?id=${resolvedWork.id}`)
    } catch (e) {
      alert(
        e instanceof Error
          ? e.message
          : isEditMode
            ? '리뷰 수정 실패'
            : '리뷰 등록 실패',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative mx-auto flex h-screen max-w-[393px] flex-col bg-white">
      <div className="flex h-13.5 items-center justify-between px-4">
        <button onClick={() => router.back()} className="cursor-pointer">
          <Image
            src="/common/icons/back.svg"
            alt="뒤로가기"
            width={24}
            height={24}
          />
        </button>
        <span className="body-1-medium">리뷰</span>
        <button
          onClick={onSubmit}
          disabled={!canSubmit || submitting}
          className={
            canSubmit
              ? 'text-[var(--color-magenta-500)] cursor-pointer'
              : 'text-gray-500'
          }
        >
          완료
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <div className="-mx-4 flex items-center gap-3 border-bottom px-4 pb-6">
          {resolvedWork?.thumb ? (
            <Image
              src={resolvedWork.thumb}
              alt={resolvedWork.title}
              width={87}
              height={116}
              className="rounded-md object-cover"
            />
          ) : (
            <div className="h-14 w-14 rounded-md bg-gray-100" />
          )}

          <div className="flex flex-col">
            <span className="body-1-semibold mb-1">
              {resolvedWork?.title ?? '작품 제목'}
            </span>
            <span className="caption-1-medium text-gray-500 mb-4">
              {resolvedWork?.meta ?? ''}
            </span>
            <RatingInput value={rating} onChange={setRating} />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="heading-2 mt-6 pl-1">리뷰 작성</span>
        </div>
        <div className="-mx-4 px-4 border-bottom">
          <textarea
            value={text}
            maxLength={MAX_CONTENT_LENGTH}
            onChange={(e) => {
              const next = e.target.value
              setText(
                next.length > MAX_CONTENT_LENGTH
                  ? next.slice(0, MAX_CONTENT_LENGTH)
                  : next,
              )
            }}
            placeholder="좋아하는 작품에 대해 적어보세요!"
            className="px-1 mt-4 h-60 w-full resize-none body-2-medium text-gray-700 outline-none"
          />
        </div>

        <SpoilerToggle
          enabled={spoiler}
          onToggle={() => setSpoiler((prev) => !prev)}
          message={spoilerMessage}
          onMessageChange={setSpoilerMessage}
          defaultMessage="스포일러가 포함된 리뷰 보기"
        />
      </div>
    </main>
  )
}
