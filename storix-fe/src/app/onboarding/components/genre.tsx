// src/app/onboarding/components/genre.tsx
'use client'

// 백엔드 ENUM 값(전송용) 타입
export type GenreKey =
  | 'ROMANCE'
  | 'FANTASY'
  | 'ROFAN'
  | 'HISTORICAL'
  | 'DRAMA'
  | 'THRILLER'
  | 'ACTION'
  | 'BL'
  | 'MODERN_FANTASY'
  | 'DAILY'

interface GenreProps {
  value: GenreKey[]
  onChange: (value: GenreKey[]) => void
}

type GenreOption = {
  key: GenreKey
  label: string
  icon: string
}

// 표시 순서: 판타지, 무협, 현판, 로맨스, 로판, 일상, BL, 스릴러, 드라마
const GENRE_OPTIONS: GenreOption[] = [
  { key: 'FANTASY',       label: '판타지', icon: '/common/onboarding/fantasy.svg'  },
  { key: 'ACTION',        label: '무협',   icon: '/common/onboarding/action.svg'   },
  { key: 'MODERN_FANTASY',label: '현판',   icon: '/common/onboarding/mofan.svg'   },
  { key: 'ROMANCE',       label: '로맨스', icon: '/common/onboarding/romance.svg'  },
  { key: 'ROFAN',         label: '로판',   icon: '/common/onboarding/rofan.svg'   },
  { key: 'DAILY',         label: '일상',   icon: '/common/onboarding/daily.svg'   },
  { key: 'BL',            label: 'BL',     icon: '/common/onboarding/bl.svg'      },
  { key: 'THRILLER',      label: '스릴러', icon: '/common/onboarding/thriller.svg'},
  { key: 'DRAMA',         label: '드라마', icon: '/common/onboarding/drama.svg'   },
]

const MAX_GENRE_SELECTION = 3

export default function Genre({ value, onChange }: GenreProps) {
  const toggle = (k: GenreKey) => {
    if (value.includes(k)) return onChange(value.filter((g) => g !== k))
    if (value.length < MAX_GENRE_SELECTION) onChange([...value, k])
  }

  return (
    <div>
      <h1 className="heading-1 text-black">즐겨보는 장르를 선택하세요</h1>

      <div className="mt-[5px] flex items-center gap-1">
        <p className="body-1 text-[var(--color-gray-500)]">
          {value.length === 0
            ? '선택을 기반으로 웹툰/웹소설을 추천드려요'
            : '최소 1개~최대 3개 선택가능'}
        </p>
        {value.length > 0 && (
          <span className="ml-1 body-1 text-[var(--color-magenta-300)]">
            ({value.length}/{MAX_GENRE_SELECTION})
          </span>
        )}
      </div>

      {/* 3×3 그리드: 부제목 80px 아래, 좌우 중앙 */}
      <div className="mt-[80px] flex justify-center">
        <div className="grid grid-cols-3 gap-[28px]">
          {GENRE_OPTIONS.map(({ key, label, icon }) => {
            const selected = value.includes(key)
            const disabled = !selected && value.length >= MAX_GENRE_SELECTION

            return (
              <button
                key={key}
                type="button"
                disabled={disabled}
                onClick={() => toggle(key)}
                aria-pressed={selected}
                className={[
                  'flex flex-col items-center',
                  disabled
                    ? 'cursor-not-allowed opacity-30'
                    : 'cursor-pointer hover:opacity-80 transition-opacity',
                ].join(' ')}
              >
                {/* 아이콘 80×80, 색상 마스크 */}
                <div
                  className="w-[80px] h-[80px] flex-shrink-0"
                  style={{
                    backgroundColor: selected
                      ? 'var(--color-magenta-300)'
                      : 'var(--color-gray-900)',
                    WebkitMask: `url(${icon}) center / contain no-repeat`,
                    mask: `url(${icon}) center / contain no-repeat`,
                  }}
                  aria-hidden
                />

                {/* 장르 이름: 아이콘 12px 아래 */}
                <p
                  className={[
                    'mt-3 body-1 text-center',
                    selected
                      ? 'text-[var(--color-magenta-300)]'
                      : 'text-[var(--color-gray-900)]',
                  ].join(' ')}
                >
                  {label}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
