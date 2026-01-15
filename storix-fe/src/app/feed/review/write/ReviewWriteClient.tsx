// ✅ src/app/feed/review/write/ReviewWriteClient.tsx
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import RatingInput from '@/components/common/RatingInput'
import { createReaderReview } from '@/lib/api/plusWrite'

type Work = { id: number; title: string; meta: string; thumb: string }

export default function ReviewWriteClient({ work }: { work: Work | null }) {
  const router = useRouter()
  const [text, setText] = useState('')
  const [spoiler, setSpoiler] = useState(false)
  const [rating, setRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const content = text.trim()
  const canSubmit = useMemo(() => {
    if (!work?.id) return false
    if (content.length === 0) return false
    if (content.length > 500) return false // 리뷰 500자:contentReference[oaicite:9]{index=9}
    if (rating < 0.5) return false
    return true
  }, [work?.id, content.length, rating])

  const onSubmit = async () => {
    if (!work?.id) return
    if (!canSubmit || submitting) return

    try {
      setSubmitting(true)
      await createReaderReview({
        worksId: work.id,
        rating: rating.toFixed(1), // "0.5" ~ "5.0":contentReference[oaicite:10]{index=10}
        isSpoiler: spoiler,
        content,
      })
      router.replace('/feed')
    } catch (e) {
      alert(e instanceof Error ? e.message : '리뷰 등록 실패')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative mx-auto flex h-screen max-w-[393px] flex-col bg-white">
      <div className="flex h-[54px] items-center justify-between px-4">
        <button onClick={() => router.back()}>
          <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </button>
        <span className="text-body-1 font-medium">피드</span>
        <button
          onClick={onSubmit}
          disabled={!canSubmit || submitting}
          className={
            canSubmit ? 'text-[var(--color-magenta-500)]' : 'text-gray-500'
          }
        >
          완료
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <div className="mb-6 flex items-center gap-3">
          {work?.thumb ? (
            <Image
              src={work.thumb}
              alt={work.title}
              width={87}
              height={116}
              className="rounded-md object-cover"
            />
          ) : (
            <div className="h-[56px] w-[56px] rounded-md bg-gray-100" />
          )}

          <div className="flex flex-col">
            <span className="text-body-1">{work?.title ?? '작품 제목'}</span>
            <span className="text-caption text-gray-500">
              {work?.meta ?? ''}
            </span>
            <RatingInput value={rating} onChange={setRating} />
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between border-t border-gray-200">
          <span className="heading-2 mt-6">리뷰 작성</span>
          <div className="mt-6 flex items-center gap-1">
            <span className="caption-1 text-gray-500">스포일러 방지</span>
            <input
              type="checkbox"
              checked={spoiler}
              onChange={(e) => setSpoiler(e.target.checked)}
              className="accent-black"
            />
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
