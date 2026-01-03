// src/app/onboarding/components/genre.tsx
interface GenreProps {
  value: string[]
  onChange: (value: string[]) => void
}

const genres = [
  '로맨스',
  '로판',
  'BL',
  '판타지',
  '현판',
  '무협',
  '라노벨',
  '드라마',
  '미스터리',
]

const MAX_GENRE_SELECTION = 3

export default function Genre({ value, onChange }: GenreProps) {
  const handleGenreClick = (genre: string) => {
    if (value.includes(genre)) {
      // 이미 선택된 장르 제거
      onChange(value.filter((g) => g !== genre))
    } else {
      // 최대 3개까지만 선택 가능
      if (value.length < MAX_GENRE_SELECTION) {
        onChange([...value, genre])
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
        평소 즐겨보는 장르를 선택하세요
      </h1>

      <p
        className="text-gray-500 mt-[5px]"
        style={{
          fontFamily: 'SUIT',
          fontSize: '16px',
          fontWeight: 500,
          lineHeight: '140%',
        }}
      >
        선택 장르를 기반으로 웹툰/웹소설을 추천드려요
      </p>

      {/* 선택된 장르 개수 표시 */}
      <div className="mt-4">
        <span className="text-sm text-gray-600">
          {value.length}/{MAX_GENRE_SELECTION} 선택됨
        </span>
      </div>

      {/* 장르 선택 그리드 */}
      <div className="mt-16 grid grid-cols-3 gap-x-4 gap-y-7">
        {genres.map((genre) => {
          const isSelected = value.includes(genre)
          const isDisabled = !isSelected && value.length >= MAX_GENRE_SELECTION

          return (
            <div
              key={genre}
              className={`flex flex-col items-center transition-opacity ${
                isDisabled
                  ? 'cursor-not-allowed opacity-30'
                  : 'cursor-pointer hover:opacity-80'
              }`}
              onClick={() => !isDisabled && handleGenreClick(genre)}
            >
              <img
                src="/onboarding/genre-select.svg"
                alt={genre}
                width={80}
                height={80}
                className={isSelected ? 'opacity-100' : 'opacity-50'}
              />
              <p
                className="text-gray-900 text-center mt-3"
                style={{
                  fontFamily: 'SUIT',
                  fontSize: '16px',
                  fontWeight: 500,
                  lineHeight: '140%',
                }}
              >
                {genre}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
