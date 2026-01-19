// ✅ src/app/feed/write/WriteClient.tsx
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import ImagePicker from '@/components/feed/ImagePicker'
import { createReaderBoard } from '@/lib/api/plus/plusWrite'
import {
  getBoardPresignedUrls,
  putToPresignedUrl,
  validateImages,
} from '@/lib/api/imageUpload'

type Work = { id: number; title: string; meta: string; thumb: string }

export default function WriteClient({ work }: { work: Work | null }) {
  const router = useRouter()
  const [text, setText] = useState('')
  const [spoiler, setSpoiler] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [submitting, setSubmitting] = useState(false)

  const content = text.trim()
  const canSubmit = useMemo(() => {
    if (content.length === 0) return false
    if (content.length > 300) return false // 게시글 300자:contentReference[oaicite:11]{index=11}
    if (images.length > 3) return false // 최대 3장:contentReference[oaicite:12]{index=12}
    return true
  }, [content.length, images.length])

  const onSubmit = async () => {
    if (!canSubmit || submitting) return

    try {
      setSubmitting(true)

      // ✅ 이미지가 있으면: presigned 발급 → PUT 업로드 → objectKey 모아서 files로
      let filesPayload: { objectKey: string }[] | undefined

      if (images.length > 0) {
        validateImages(images, 3)
        const presigned = await getBoardPresignedUrls(images)
        await Promise.all(
          presigned.map((p, i) => putToPresignedUrl(p.url, images[i])),
        )
        filesPayload = presigned.map((p) => ({ objectKey: p.objectKey }))
      }

      // ✅ works 선택 여부 규칙: isWorksSelected true일 때만 worksId 포함:contentReference[oaicite:13]{index=13}
      const isWorksSelected = !!work?.id

      const body: any = {
        isWorksSelected,
        isSpoiler: spoiler,
        content,
      }
      if (isWorksSelected) body.worksId = work!.id
      if (filesPayload && filesPayload.length > 0) body.files = filesPayload // 없으면 아예 생략:contentReference[oaicite:14]{index=14}

      await createReaderBoard(body)
      router.replace('/feed')
    } catch (e) {
      alert(e instanceof Error ? e.message : '게시글 등록 실패')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="relative mx-auto flex h-screen max-w-[393px] flex-col bg-white">
      <div className="flex h-[54px] items-center justify-between px-4">
        <button onClick={() => router.back()} className="cursor-pointer">
          <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </button>
        <span className="text-body-1 font-medium">피드</span>
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

      <div className="flex-1 overflow-y-auto px-6 pb-32">
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
            <span className="text-body-1">
              {work?.title ?? '작품 선택 안함'}
            </span>
            <span className="text-caption text-gray-500">
              {work?.meta ?? ''}
            </span>
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between border-t border-gray-200">
          <span className="heading-2 mt-6">게시글 작성</span>
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
          className="mt-4 h-60 w-full resize-none body-1 border-b border-gray-300 text-gray-700 outline-none"
        />

        <div className="mt-2 flex items-center justify-between px-1 text-caption text-gray-400">
          <ImagePicker files={images} onChange={setImages} max={3} />
          <span>{content.length}/300</span>
        </div>
      </div>
    </main>
  )
}
