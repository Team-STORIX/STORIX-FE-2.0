'use client'

import Image from 'next/image'

type Props = {
  rating?: number | null
  likeCount?: number | null
}

const STAR_URL = '/common/icons/ratingStar.svg'

function StaticRatingStars({
  value,
  size = 18,
}: {
  value: number
  size?: number
}) {
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="flex items-center gap-1">
      {stars.map((i) => {
        const raw = value - (i - 1)
        const fill = raw >= 1 ? 1 : raw >= 0.5 ? 0.5 : 0

        return (
          <div
            key={i}
            className="relative"
            style={{ width: size, height: size }}
          >
            <div
              className="pointer-events-none absolute inset-0 bg-gray-200"
              style={{
                WebkitMaskImage: `url(${STAR_URL})`,
                maskImage: `url(${STAR_URL})`,
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
              }}
            />

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div
                className="h-full w-full bg-[var(--color-magenta-300)]"
                style={{
                  WebkitMaskImage: `url(${STAR_URL})`,
                  maskImage: `url(${STAR_URL})`,
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                  clipPath:
                    fill === 1
                      ? 'inset(0 0 0 0)'
                      : fill === 0.5
                        ? 'inset(0 50% 0 0)'
                        : 'inset(0 100% 0 0)',
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function ReviewMetaBar({ rating, likeCount }: Props) {
  const safeLikeCount = Math.max(0, Number(likeCount ?? 0))

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {typeof rating === 'number' ? (
          <>
            <StaticRatingStars value={rating} />
            <span className="body-2-medium text-gray-500">
              {Number(rating).toFixed(1)}
            </span>
          </>
        ) : null}
      </div>

      <div className="flex items-center justify-center gap-1 rounded-lg bg-white px-4 py-1 shadow-[0_0_4px_0_rgba(19,17,18,0.20)]">
        <Image
          src="/common/icons/icon-like-pink.svg"
          alt="like"
          width={16}
          height={16}
          priority
        />
        <span className="body-2-medium text-gray-500">{safeLikeCount}</span>
      </div>
    </div>
  )
}
