// src/app/onboarding/components/genre.tsx

//   백엔드 ENUM 값(전송용) 타입
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
  //   value는 백엔드로 보낼 ENUM 키 배열
  value: GenreKey[]
  onChange: (value: GenreKey[]) => void
}

//   UI 표시(label)와 API 전송(key)을 분리
const GENRE_OPTIONS: Array<{ key: GenreKey; label: string; icon: string }> = [
  { key: 'ROMANCE', label: '로맨스', icon: '/onboarding/romance.svg' },
  { key: 'ROFAN', label: '로판', icon: '/onboarding/rofan.svg' },
  { key: 'BL', label: 'BL', icon: '/onboarding/bl.svg' },
  { key: 'FANTASY', label: '판타지', icon: '/onboarding/fantasy.svg' },
  { key: 'MODERN_FANTASY', label: '현판', icon: '/onboarding/mofan.svg' },
  { key: 'ACTION', label: '무협', icon: '/onboarding/action.svg' },
  { key: 'DAILY', label: '일상', icon: '/onboarding/daily.svg' },
  { key: 'DRAMA', label: '드라마', icon: '/onboarding/drama.svg' },
  { key: 'THRILLER', label: '스릴러', icon: '/onboarding/thriller.svg' },
]

const MAX_GENRE_SELECTION = 3

export default function Genre({ value, onChange }: GenreProps) {
  const handleGenreClick = (genreKey: GenreKey) => {
    if (value.includes(genreKey)) {
      // 이미 선택된 장르 제거
      onChange(value.filter((g) => g !== genreKey))
    } else {
      // 최대 3개까지만 선택 가능
      if (value.length < MAX_GENRE_SELECTION) {
        onChange([...value, genreKey])
      }
    }
  }

  return (
    <div>
      <h1
        className="text-black text-2xl font-bold"
        style={{
          fontFamily: 'SUIT',
          fontSize: '24px',
          fontWeight: 700,
          lineHeight: '140%',
        }}
      >
        즐겨보는 장르를 선택해 주세요
      </h1>

      {/*   기본 문구 / 선택시 문구 + (n/3) */}
      <div className="mt-[5px] flex items-center gap-1">
        <p
          className="text-gray-500"
          style={{
            fontFamily: 'SUIT',
            fontSize: '16px',
            fontWeight: 500,
            lineHeight: '140%',
          }}
        >
          {value.length === 0
            ? '선택 장르를 기반으로 작품과 키워드를 추천드려요!'
            : '최소 1개~최대 3개 선택가능'}
        </p>

        {value.length > 0 && (
          <span className="ml-1 text-[16px] font-medium leading-[140%] text-[var(--color-magenta-300)]">
            ({value.length}/{MAX_GENRE_SELECTION})
          </span>
        )}
      </div>

      {/* 장르 선택 그리드 */}
      <div className="mt-16 grid grid-cols-3 gap-x-4 gap-y-7">
        {GENRE_OPTIONS.map(({ key, label, icon }) => {
          const isSelected = value.includes(key)
          const isDisabled = !isSelected && value.length >= MAX_GENRE_SELECTION

          return (
            <div
              key={key}
              className={`flex flex-col items-center transition-opacity ${
                isDisabled
                  ? 'cursor-not-allowed opacity-30'
                  : 'cursor-pointer hover:opacity-80'
              }`}
              onClick={() => !isDisabled && handleGenreClick(key)}
            >
              {/*   이미지도 선택 시 magenta300, 기본은 gray900 */}
              <div
                className="w-20 h-20"
                style={{
                  backgroundColor: isSelected
                    ? 'var(--color-magenta-300)'
                    : 'var(--color-gray-900)',
                  WebkitMaskImage: `url(${icon})`,
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskPosition: 'center',
                  WebkitMaskSize: 'contain',
                  maskImage: `url(${icon})`,
                  maskRepeat: 'no-repeat',
                  maskPosition: 'center',
                  maskSize: 'contain',
                }}
                aria-label={label}
              />

              {/*   글자도 선택 시 magenta300, 기본은 gray900 */}
              <p
                className={`text-center mt-3 ${
                  isSelected
                    ? 'text-[var(--color-magenta-300)]'
                    : 'text-[var(--color-gray-900)]'
                }`}
                style={{
                  fontFamily: 'SUIT',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '140%',
                }}
              >
                {label}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
