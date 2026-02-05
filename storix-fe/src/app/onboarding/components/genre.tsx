// src/app/onboarding/components/genre.tsx
'use client'

import Image from 'next/image'

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
  desc: string
  icon: string
}

const GENRE_OPTIONS: GenreOption[] = [
  {
    key: 'ROMANCE',
    label: '로맨스',
    desc: '설레는 사랑과 깊은 감정 변화를 아름답게 그려낸 이야기',
    icon: '/onboarding/romance.svg',
  },
  {
    key: 'ROFAN',
    label: '로맨스 판타지',
    desc: '판타지 세계 속 주인공이 사랑과 운명을 개척하는 이야기',
    icon: '/onboarding/rofan.svg',
  },
  {
    key: 'BL',
    label: 'BL',
    desc: '남성 주인공들 사이의 섬세한 관계성과 사랑 이야기',
    icon: '/onboarding/bl.svg',
  },
  {
    key: 'MODERN_FANTASY',
    label: '현대 판타지',
    desc: '현대에 초능력, 특별한 시스템이 나타나는 흥미로운 이야기',
    icon: '/onboarding/mofan.svg',
  },
  {
    key: 'ACTION',
    label: '무협',
    desc: '화려한 무공과 문파 사이의 의리, 강호의 질서를 지키는 모험 이야기',
    icon: '/onboarding/action.svg',
  },
  {
    key: 'FANTASY',
    label: '정통 판타지',
    desc: '마법과 기사가 존재하는 미지의 세계에서 펼쳐지는 거대한 서사시',
    icon: '/onboarding/fantasy.svg',
  },
  {
    key: 'THRILLER',
    label: '스릴러',
    desc: '긴박한 사건과 치밀한 심리전으로 극강의 긴장감을 주는 이야기',
    icon: '/onboarding/thriller.svg',
  },
  {
    key: 'DRAMA',
    label: '드라마',
    desc: '우리 삶의 희로애락과 현실적인 인간관계를 깊이 있게 그린 이야기',
    icon: '/onboarding/drama.svg',
  },
  {
    key: 'DAILY',
    label: '일상',
    desc: '주변의 소소하고 평범한 일상을 통해 따뜻한 힐링을 주는 이야기',
    icon: '/onboarding/daily.svg',
  },
]

const MAX_GENRE_SELECTION = 3

const cx = (...v: Array<string | false | null | undefined>) =>
  v.filter(Boolean).join(' ')

export default function Genre({ value, onChange }: GenreProps) {
  const toggle = (k: GenreKey) => {
    if (value.includes(k)) return onChange(value.filter((g) => g !== k))
    if (value.length < MAX_GENRE_SELECTION) onChange([...value, k])
  }

  return (
    <div>
      <h1 className="heading-1 text-black">즐겨보는 장르를 선택해 주세요</h1>

      <div className="mt-[5px] flex items-center gap-1">
        <p className="body-1 text-[var(--color-gray-500)]">
          {value.length === 0
            ? '선택 장르를 기반으로 작품과 키워드를 추천드려요!'
            : '최소 1개~최대 3개 선택가능'}
        </p>

        {value.length > 0 && (
          <span className="ml-1 body-1 text-[var(--color-magenta-300)]">
            ({value.length}/{MAX_GENRE_SELECTION})
          </span>
        )}
      </div>

      <div className="mt-16 flex flex-col gap-4">
        {GENRE_OPTIONS.map(({ key, label, desc, icon }) => {
          const selected = value.includes(key)
          const disabled = !selected && value.length >= MAX_GENRE_SELECTION

          return (
            <button
              key={key}
              type="button"
              disabled={disabled}
              onClick={() => toggle(key)}
              aria-pressed={selected}
              className={cx(
                'w-[361px] h-[115px] rounded-[12px] border px-[20px] py-[17px]',
                'flex items-center justify-between text-left transition-opacity',
                selected
                  ? 'border-[var(--color-magenta-300)] bg-[var(--color-magenta-20)]'
                  : 'border-[var(--color-gray-100)] bg-[var(--color-gray-50)]',
                disabled
                  ? 'cursor-not-allowed opacity-30'
                  : 'cursor-pointer hover:opacity-80',
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-[80px] h-[80px] flex-shrink-0"
                  style={{
                    backgroundColor: selected
                      ? 'var(--color-magenta-300)'
                      : 'var(--color-gray-500)',
                    WebkitMask: `url(${icon}) center / contain no-repeat`,
                    mask: `url(${icon}) center / contain no-repeat`,
                  }}
                  aria-hidden
                />

                <div className="flex flex-col">
                  <p
                    className={cx(
                      'text-[18px] font-semibold leading-[140%]',
                      selected
                        ? 'text-[var(--color-magenta-300)]'
                        : 'text-[var(--color-gray-500)]',
                    )}
                  >
                    {label}
                  </p>

                  <p
                    className={cx(
                      'mt-2 body-2 w-[185px] line-clamp-2 break-keep whitespace-normal',
                      selected
                        ? 'text-[var(--color-magenta-300)]'
                        : 'text-[var(--color-gray-500)]',
                    )}
                  >
                    {desc}
                  </p>
                </div>
              </div>

              <Image
                src={
                  selected ? '/icons/check-pink.svg' : '/icons/check-gray.svg'
                }
                alt=""
                width={24}
                height={24}
                draggable={false}
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
