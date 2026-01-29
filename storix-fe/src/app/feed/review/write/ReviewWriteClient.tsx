// ✅ src/app/feed/review/write/ReviewWriteClient.tsx
'use client'

import Image from 'next/image'
import { useRouter, useParams } from 'next/navigation'
import { useMemo, useState, useEffect } from 'react'
import RatingInput from '@/components/common/RatingInput'
import { createReaderReview } from '@/lib/api/plus/plusWrite'

type Work = { id: number; title: string; meta: string; thumb: string }
const STORAGE_KEY_REVIEW = 'storix:selectedWork:review'

export default function ReviewWriteClient({ work }: { work: Work | null }) {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const routeId = Number(params?.id)

  const [resolvedWork, setResolvedWork] = useState<Work | null>(work)

  const [text, setText] = useState('')
  const [spoiler, setSpoiler] = useState(false)
  const [rating, setRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  // ✅ work가 null이거나, routeId랑 다르면 sessionStorage에서 복구
  useEffect(() => {
    if (work?.id && work.id === routeId) {
      setResolvedWork(work)
      return
    }

    const raw = sessionStorage.getItem(STORAGE_KEY_REVIEW)
    if (!raw) return

    try {
      const parsed = JSON.parse(raw) as Work
      if (parsed?.id === routeId) {
        setResolvedWork(parsed)
      }
    } catch {
      // ignore
    }
  }, [work?.id, routeId])

  const content = text.trim()

  const canSubmit = useMemo(() => {
    if (!resolvedWork?.id) return false
    if (content.length === 0) return false
    if (content.length > 500) return false
    if (rating < 0.5) return false
    return true
  }, [resolvedWork?.id, content.length, rating])

  const onSubmit = async () => {
    if (!resolvedWork?.id) return
    if (!canSubmit || submitting) return

    try {
      setSubmitting(true)
      await createReaderReview({
        worksId: resolvedWork.id,
        rating: rating.toFixed(1),
        isSpoiler: spoiler,
        content,
      })

      // ✅ 성공하면 저장값 제거(다음 글쓰기 때 헷갈림 방지)
      sessionStorage.removeItem(STORAGE_KEY_REVIEW)

      router.replace(`/library/works/${resolvedWork.id}`)
    } catch (e) {
      alert(e instanceof Error ? e.message : '리뷰 등록 실패')
    } finally {
      setSubmitting(false)
    }
    // console.log('worksId', resolvedWork.id)
    // console.log('rating', rating)
  }

  return (
    <main className="relative mx-auto flex h-screen max-w-[393px] flex-col bg-white">
      <div className="flex h-[54px] items-center justify-between px-4">
        <button onClick={() => router.back()} className="cursor-pointer">
          <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </button>
        <span className="text-body-1 font-medium">리뷰</span>
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
        <div className="mb-6 flex items-center gap-3">
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
            <span className="heading-4">
              {resolvedWork?.title ?? '작품 제목'}
            </span>
            <span className="caption-2 text-gray-500 mb-4">
              {resolvedWork?.meta ?? ''}
            </span>
            <RatingInput value={rating} onChange={setRating} />
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between border-t border-gray-200">
          <span className="heading-2 mt-6">리뷰 작성</span>
          <div className="mt-6 flex items-center gap-1">
            <span className="caption-1 text-gray-500">스포일러 방지</span>
            <button
              type="button"
              onClick={() => setSpoiler((prev) => !prev)}
              aria-pressed={spoiler}
              aria-label="스포일러 방지 토글"
              className="ml-auto cursor-pointer hover:opacity-80"
            >
              <img
                src={
                  spoiler
                    ? '/common/icons/active.svg'
                    : '/common/icons/deactive.svg'
                }
                alt={spoiler ? '활성' : '비활성'}
                className="h-4.5 w-8"
              />
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="좋아하는 작품에 대해 적어보세요!"
          className="mt-4 h-60 w-full resize-none body-1 text-gray-700 outline-none"
        />

        <div className="mt-2 flex justify-end px-1 text-caption text-gray-400">
          {content.length}/500
        </div>
      </div>
    </main>
  )
}
