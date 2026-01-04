// src/app/profile/components/genre.tsx
'use client'

export default function Genre() {
  const genres = [
    '로맨스',
    '판타지',
    'BL',
    '로판',
    '라노벨',
    '드라마',
    '현판',
    '무협',
    '미스터리',
  ]

  // TODO: API 연동 후 실제 데이터로 대체
  const genreData: { [key: string]: number } = {
    로맨스: 90,
    로판: 70,
    BL: 30,
    판타지: 20,
    현판: 45,
    무협: 0,
    라노벨: 28,
    드라마: 35,
    미스터리: 10,
  }

  const centerX = 116.5
  const centerY = 127.5
  const maxRadius = 90
  const labelRadius = 109
  const levels = [90, 73.8, 57.6, 41.4]

  const angleStep = (2 * Math.PI) / 9
  const startAngle = -Math.PI / 2

  const getPoint = (index: number, radius: number) => {
    const angle = startAngle + index * angleStep
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  }

  const getLevelPath = (radius: number) => {
    const points = genres.map((_, i) => getPoint(i, radius))
    return `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')} Z`
  }

  const getDataPath = () => {
    const points = genres.map((genre, i) => {
      const value = genreData[genre] || 0
      const radius = (value / 100) * maxRadius
      return getPoint(i, radius)
    })
    return `M ${points.map((p) => `${p.x},${p.y}`).join(' L ')} Z`
  }

  return (
    <div
      className="px-4 py-8"
      style={{
        borderBottom: '1px solid var(--color-gray-200)',
        backgroundColor: 'var(--color-white)',
      }}
    >
      {/* 제목 */}
      <h2
        className="text-[18px] font-semibold leading-[140%]"
        style={{ color: 'var(--color-gray-900)' }}
      >
        선호 장르
      </h2>

      {/* 레이더 차트 */}
      <div className="mt-6 flex justify-center">
        <div style={{ width: '233px', height: '255px' }}>
          <svg width="233" height="255" viewBox="0 0 233 255">
            {/* 배경 정구각형들 */}
            {levels.map((radius, i) => (
              <path
                key={i}
                d={getLevelPath(radius)}
                fill="none"
                stroke="#100F0F"
                strokeWidth="1"
              />
            ))}

            {/* 데이터 영역 - magenta-200 */}
            <path d={getDataPath()} fill="#FF80B3" fillOpacity="0.5" />

            {/* 바깥 구각형 꼭지점 포인트 - magenta-300 */}
            {genres.map((_, i) => {
              const point = getPoint(i, maxRadius)
              return (
                <rect
                  key={i}
                  x={point.x - 6}
                  y={point.y - 6}
                  width="12"
                  height="12"
                  fill="#FF4093"
                />
              )
            })}

            {/* 장르 라벨 */}
            {genres.map((genre, i) => {
              const pos = getPoint(i, labelRadius)
              return (
                <text
                  key={i}
                  x={pos.x}
                  y={pos.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    fontFamily: 'SUIT',
                    fill: '#100F0F',
                  }}
                >
                  {genre}
                </text>
              )
            })}
          </svg>
        </div>
      </div>
    </div>
  )
}
