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

export default function Genre({ value, onChange }: GenreProps) {
  const handleGenreClick = (genre: string) => {
    if (value.includes(genre)) {
      onChange(value.filter((g) => g !== genre))
    } else {
      onChange([...value, genre])
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

      {/* 장르 선택 그리드 */}
      <div className="mt-20 grid grid-cols-3 gap-x-4 gap-y-7">
        {genres.map((genre) => (
          <div
            key={genre}
            className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleGenreClick(genre)}
          >
            <img
              src="/onboarding/genre-select.svg"
              alt={genre}
              width={80}
              height={80}
              className={value.includes(genre) ? 'opacity-100' : 'opacity-50'}
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
        ))}
      </div>
    </div>
  )
}
