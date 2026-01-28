// src/app/library/works/[id]/topicroom/page.tsx
'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react' // ✅
import { useParams, useRouter } from 'next/navigation' // ✅
import { useWorksDetail } from '@/hooks/works/useWorksDetail'

export default function TopicRoomCreateSuccessPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>() // ✅
  const worksId = Number(params?.id) // ✅

  const [topicRoomId, setTopicRoomId] = useState<number>(0) // ✅
  const [topicRoomName, setTopicRoomName] = useState<string>('') // ✅

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search) // ✅
    setTopicRoomId(Number(sp.get('topicRoomId') ?? '')) // ✅
    setTopicRoomName(sp.get('topicRoomName') ?? '') // ✅
  }, []) // ✅

  const { data: work } = useWorksDetail(worksId)

  const ui = useMemo(() => {
    return {
      title: work?.worksName ?? '',
      thumb: work?.thumbnailUrl ?? '/image/sample/topicroom-1.webp',
      worksName: work?.worksName ?? '',
      id: work?.worksId ?? '',
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
      {/*   UI 변경: 모달이 아닌 페이지이므로 상단 뒤로가기 버튼 노출 */}
      <div className="pt-4">
        <button
          type="button"
          onClick={() =>
            router.push(
              `/library/works/${worksId}?returnTo=${encodeURIComponent(
                '/library/list',
              )}`, // ✅
            )
          }
          aria-label="뒤로가기"
          className="flex h-8 w-8 items-center justify-center cursor-pointer"
        >
          <Image src="/icons/back.svg" alt="back" width={24} height={24} />
        </button>
      </div>

      {/*   Step 4 UI(기존 4단계 그대로) */}
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
                  <FireIcon />
                  <p className="ml-0.5">HOT</p>
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

      {/*   Step 4 버튼(기존 그대로) */}
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

const FireIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
  >
    <path
      d="M2 7C2 6.125 2.20833 5.34583 2.625 4.6625C3.04167 3.97917 3.5 3.40417 4 2.9375C4.5 2.47083 4.95833 2.11458 5.375 1.86875L6 1.5V3.15C6 3.45833 6.10417 3.70208 6.3125 3.88125C6.52083 4.06042 6.75417 4.15 7.0125 4.15C7.15417 4.15 7.28958 4.12083 7.41875 4.0625C7.54792 4.00417 7.66667 3.90833 7.775 3.775L8 3.5C8.6 3.85 9.08333 4.33542 9.45 4.95625C9.81667 5.57708 10 6.25833 10 7C10 7.73333 9.82083 8.40208 9.4625 9.00625C9.10417 9.61042 8.63333 10.0875 8.05 10.4375C8.19167 10.2375 8.30208 10.0188 8.38125 9.78125C8.46042 9.54375 8.5 9.29167 8.5 9.025C8.5 8.69167 8.4375 8.37708 8.3125 8.08125C8.1875 7.78542 8.00833 7.52083 7.775 7.2875L6 5.55L4.2375 7.2875C3.99583 7.52917 3.8125 7.79583 3.6875 8.0875C3.5625 8.37917 3.5 8.69167 3.5 9.025C3.5 9.29167 3.53958 9.54375 3.61875 9.78125C3.69792 10.0188 3.80833 10.2375 3.95 10.4375C3.36667 10.0875 2.89583 9.61042 2.5375 9.00625C2.17917 8.40208 2 7.73333 2 7ZM6 6.95L7.0625 7.9875C7.20417 8.12917 7.3125 8.2875 7.3875 8.4625C7.4625 8.6375 7.5 8.825 7.5 9.025C7.5 9.43333 7.35417 9.78125 7.0625 10.0688C6.77083 10.3563 6.41667 10.5 6 10.5C5.58333 10.5 5.22917 10.3563 4.9375 10.0688C4.64583 9.78125 4.5 9.43333 4.5 9.025C4.5 8.83333 4.5375 8.64792 4.6125 8.46875C4.6875 8.28958 4.79583 8.12917 4.9375 7.9875L6 6.95Z"
      fill="white"
    />
  </svg>
)
