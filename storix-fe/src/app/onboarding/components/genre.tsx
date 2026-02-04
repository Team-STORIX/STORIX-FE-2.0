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
  // value는 백엔드로 보낼 ENUM 키 배열
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
  // HISTORICAL은 아직 UI 옵션에 없으면 그대로 두거나 추가해도 됨
]

const MAX_GENRE_SELECTION = 3

export default function Genre({ value, onChange }: GenreProps) {
  const handleGenreClick = (genreKey: GenreKey) => {
    if (value.includes(genreKey)) {
      onChange(value.filter((g) => g !== genreKey))
      return
    }
    if (value.length < MAX_GENRE_SELECTION) {
      onChange([...value, genreKey])
    }
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

      {/* 카드 리스트 */}
      <div className="mt-16 flex flex-col gap-4">
        {GENRE_OPTIONS.map(({ key, label, desc, icon }) => {
          const isSelected = value.includes(key)
          const isDisabled = !isSelected && value.length >= MAX_GENRE_SELECTION

          const borderBgClass = isSelected
            ? 'border-[var(--color-magenta-300)] bg-[var(--color-magenta-20)]'
            : 'border-[var(--color-gray-100)] bg-[var(--color-gray-50)]'

          const textClass = isSelected
            ? 'text-[var(--color-magenta-300)]'
            : 'text-[var(--color-gray-500)]'

          // 아이콘은 mask로 단색 처리 (선택 시 magenta300 / 기본 gray900)
          const iconColor = isSelected
            ? 'var(--color-magenta-300)'
            : 'var(--color-gray-900)'

          const checkIconSrc = isSelected
            ? '/icons/check-pink.svg'
            : '/icons/check-gray.svg'

          return (
            <button
              key={key}
              type="button"
              disabled={isDisabled}
              onClick={() => handleGenreClick(key)}
              className={[
                // layout
                'w-[361px] h-[115px] rounded-[12px] border',
                'px-[20px] py-[17px]',
                'flex items-center justify-between',
                'text-left',
                'transition-opacity',
                // state
                borderBgClass,
                isDisabled
                  ? 'cursor-not-allowed opacity-30'
                  : 'cursor-pointer hover:opacity-80',
              ].join(' ')}
              aria-pressed={isSelected}
            >
              {/* 왼쪽: 아이콘 + 텍스트 */}
              <div className="flex items-center gap-3">
                {/* 80x80 아이콘 */}
                <div
                  className="w-[80px] h-[80px] flex-shrink-0"
                  style={{
                    backgroundColor: iconColor,
                    WebkitMaskImage: `url(${icon})`,
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskPosition: 'center',
                    WebkitMaskSize: 'contain',
                    maskImage: `url(${icon})`,
                    maskRepeat: 'no-repeat',
                    maskPosition: 'center',
                    maskSize: 'contain',
                  }}
                  aria-hidden
                />

                {/* 텍스트 영역 */}
                <div className="flex flex-col">
                  {/* 장르명: Heading3(요구사항: 18/600/140) */}
                  <p
                    className={['heading-3', textClass].join(' ')}
                    style={{ fontWeight: 600 }}
                  >
                    {label}
                  </p>

                  {/* 설명: Body2 + 8px 아래 + 175px 박스 + 2줄 */}
                  <p
                    className={['mt-2 body-2', textClass].join(' ')}
                    style={{
                      fontFamily: 'Pretendard',
                      fontWeight: 500,
                      width: 175,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      whiteSpace: 'normal',
                    }}
                  >
                    {desc}
                  </p>
                </div>
              </div>

              {/* 오른쪽: 체크 아이콘(24x24, 세로 가운데) */}
              <Image
                src={checkIconSrc}
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
