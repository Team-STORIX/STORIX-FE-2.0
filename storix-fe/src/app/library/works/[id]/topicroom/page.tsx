// src/app/library/works/[id]/topicroom/page.tsx
'use client'

import Image from 'next/image'
import { useMemo } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useWorksDetail } from '@/hooks/works/useWorksDetail'

export default function TopicRoomCreateSuccessPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const sp = useSearchParams()

  const worksId = Number(params?.id)
  const topicRoomId = Number(sp.get('topicRoomId') ?? '')
  const topicRoomName = sp.get('topicRoomName') ?? ''

  const { data: work } = useWorksDetail(worksId)

  const ui = useMemo(() => {
    return {
      title: work?.worksName ?? '',
      thumb: work?.thumbnailUrl ?? '/image/sample/topicroom-1.webp',
      worksName: work?.worksName ?? '',
    }
  }, [work])

  const onGoRoom = () => {
    if (!topicRoomId) return
    router.push(
      `/home/topicroom/${topicRoomId}?worksName=${encodeURIComponent(
        ui.worksName,
      )}`,
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-white px-4">
      {/* ✅ UI 변경: 모달이 아닌 페이지이므로 상단 뒤로가기 버튼 노출 */}
      <div className="pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="뒤로가기"
          className="flex h-8 w-8 items-center justify-center cursor-pointer"
        >
          <Image src="/icons/back.svg" alt="back" width={24} height={24} />
        </button>
      </div>

      {/* ✅ Step 4 UI(기존 4단계 그대로) */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <p className="heading-2 text-center text-black">
          첫 토픽룸이 만들어졌어요!
        </p>
        <p className="caption-1 mt-2 text-center text-gray-500">
          이제 토픽룸에서 자유롭게 이야기해 보아요!
        </p>

        <div className="mt-5 flex justify-center">
          <div className="relative w-[210px] overflow-hidden rounded-2xl bg-gray-100">
            <div className="relative h-[280px] w-full">
              <Image
                src={ui.thumb}
                alt={ui.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-black/0 p-3">
              <div className="flex items-center gap-2">
                <span className="caption-1 rounded-md bg-white/90 px-2 py-1 text-black">
                  🔥 HOT
                </span>
                <span className="caption-1 rounded-md bg-[var(--color-magenta-300)] px-2 py-1 text-white">
                  1명
                </span>
              </div>

              <p className="body-2 mt-2 text-white">{ui.title}</p>
              <p className="caption-1 mt-1 text-white/80">{topicRoomName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Step 4 버튼(기존 그대로) */}
      <button
        type="button"
        onClick={onGoRoom}
        disabled={!topicRoomId}
        className="mb-8 h-12 w-full rounded-xl bg-black text-body-1 text-white cursor-pointer"
      >
        토픽룸으로 이동
      </button>
    </div>
  )
}
