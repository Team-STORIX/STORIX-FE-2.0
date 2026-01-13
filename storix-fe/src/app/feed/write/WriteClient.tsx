// ✅ src/app/feed/write/WriteClient.tsx
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Work = {
  id: number
  title: string
  meta: string
  thumb: string
}

export default function WriteClient({ work }: { work: Work | null }) {
  const router = useRouter()
  const [text, setText] = useState('')
  const [spoiler, setSpoiler] = useState(false)
  console.log('ReviewWriteClient work:', work)

  return (
    <main className="relative mx-auto flex h-screen max-w-[393px] flex-col bg-white">
      <div className="flex h-[54px] items-center justify-between px-4">
        <button onClick={() => router.back()}>
          <Image src="/icons/back.svg" alt="뒤로가기" width={24} height={24} />
        </button>
        <span className="text-body-1 font-medium">피드</span>
        <button
          disabled={!text}
          className={text ? 'text-[var(--color-magenta-500)]' : 'text-gray-500'}
        >
          완료
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-32">
        {/* ✅ props로 받은 title/thumb 표시 */}
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
          </div>
        </div>

        <div className="mb-2 flex items-center justify-between border-t border-gray-200">
          <span className="heading-2 mt-6">게시글 작성</span>
          <div className="flex items-center gap-1 mt-6">
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
          className="h-60 w-full resize-none rounded-xl body-1 text-gray-700 mt-4 outline-none"
        />

        <div className="mt-2 flex justify-between px-1 text-caption text-gray-400">
          <Image
            src="/common/icons/image.svg"
            alt="이미지 추가"
            width={24}
            height={24}
          />
        </div>
      </div>
    </main>
  )
}
