//src/components/library/works/WorkHeaderCover.tsx
'use client'

import Image from 'next/image'

type UIData = {
  id: number
  title: string
  metaAuthor: string
  thumb: string
  rating: number
  reviewCount: number
}

function Star({ value }: { value: number }) {
  return (
    <span className="caption-1 text-[var(--color-magenta-300)]">
      <Image
        src="/search/littleStar.svg"
        alt="star"
        width={9}
        height={10}
        className="inline-block mb-0.5"
        priority
      />{' '}
      {Number.isFinite(value) ? value.toFixed(1) : '0.0'}
    </span>
  )
}

type Props = {
  ui: UIData
  isCheckingRoom: boolean
  onReviewWrite: () => void
  onTopicroomEnter: () => void
}

export default function WorkHeaderCover({
  ui,
  isCheckingRoom,
  onReviewWrite,
  onTopicroomEnter,
}: Props) {
  return (
    <div className="relative">
      {/* watermark bg */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(0deg, rgba(255,255,255,0) 0%, #fff 100%),
            linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 100%),
            url(${ui.thumb || '/image/watermark.webp'})
          `,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: '50% 50%',
          backgroundSize: 'cover',
        }}
      />

      <div className="relative z-10 px-4 pb-4">
        <div className="mt-2 flex flex-col items-center">
          <div className="relative h-[280px] w-[210px] overflow-hidden rounded-2xl bg-gray-100 shadow-sm">
            {/* 외부 URL 썸네일 안전하게 */}
            <img
              src={ui.thumb}
              alt={ui.title}
              className="h-full w-full object-cover"
            />
          </div>

          <p className="heading-2 mt-4 text-black text-center">{ui.title}</p>
          <p className="caption-1 mt-1 text-gray-500 text-center">
            {ui.metaAuthor}
          </p>

          <div className="mt-2">
            <Star value={ui.rating} />
            <span className="caption-1 text-gray-400"> ({ui.reviewCount})</span>
          </div>

          <div className="mt-4 flex w-full gap-3">
            <button
              type="button"
              onClick={onReviewWrite}
              className="flex h-11 flex-1 items-center justify-center gap-1 rounded-xl bg-[var(--color-magenta-100)] text-[var(--color-magenta-400)] caption-1"
            >
              <span className="text-[var(--color-magenta-400)]">+</span>
              리뷰쓰기
            </button>

            <button
              type="button"
              onClick={onTopicroomEnter}
              disabled={isCheckingRoom}
              className="flex h-11 flex-1 items-center justify-center rounded-xl bg-[var(--color-magenta-300)] text-white caption-1 disabled:opacity-50"
            >
              {isCheckingRoom ? '확인 중...' : '토픽룸 입장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
