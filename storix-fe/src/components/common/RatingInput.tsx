// ✅ src/components/common/RatingInput.tsx
'use client'

type Props = {
  value: number // 0 ~ 5 (0.5 step)
  onChange: (v: number) => void
  size?: number // px
  className?: string
}

const STAR_URL = '/common/icons/ratingStar.svg'

export default function RatingInput({
  value,
  onChange,
  size = 40,
  className = '',
}: Props) {
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {stars.map((i) => {
        // 각 별의 채움 정도: 0, 0.5, 1
        const raw = value - (i - 1)
        const fill = raw >= 1 ? 1 : raw >= 0.5 ? 0.5 : 0

        return (
          <div
            key={i}
            className="relative"
            style={{ width: size, height: size }}
          >
            {/* base (gray) */}
            <div
              className="absolute inset-0 bg-gray-200 pointer-events-none"
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

            {/* fill (magenta) - width로 0/50/100% 채움 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div
                className="h-full w-full bg-[var(--color-magenta-300)] pointer-events-none"
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

            {/* click area: left half = 0.5, right half = 1.0 */}
            <button
              type="button"
              aria-label={`${i - 0.5}점`}
              className="absolute inset-y-0 left-0 z-10 w-1/2"
              onClick={() => onChange(i - 0.5)}
            />
            <button
              type="button"
              aria-label={`${i}점`}
              className="absolute inset-y-0 right-0 z-10 w-1/2"
              onClick={() => onChange(i)}
            />
          </div>
        )
      })}
    </div>
  )
}
