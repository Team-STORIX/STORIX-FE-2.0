// src/app/profile/components/rating.tsx
'use client'

export default function Rating() {
  // TODO: API 연동 후 실제 데이터로 대체
  const ratingData = [
    { rating: 0.5, percentage: 10 },
    { rating: 1, percentage: 0 },
    { rating: 1.5, percentage: 5 },
    { rating: 2, percentage: 5 },
    { rating: 2.5, percentage: 0 },
    { rating: 3, percentage: 0 },
    { rating: 3.5, percentage: 45 },
    { rating: 4, percentage: 15 },
    { rating: 4.5, percentage: 20 },
    { rating: 5, percentage: 0 },
  ]

  // 최대 percentage 찾기
  const maxPercentage = Math.max(...ratingData.map((item) => item.percentage))
  const maxHeight = 120 // 최대 높이 120px

  // 높이 계산 함수
  const getBarHeight = (percentage: number) => {
    if (percentage === 0) return 1 // 0일 때는 1px
    return (percentage / maxPercentage) * maxHeight
  }

  // 통계 데이터
  const averageRating = 4.5
  const totalReviews = 21
  const mostGivenRating = 3.5

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
        별점 분포
      </h2>

      {/* 그래프 영역 */}
      <div className="mt-6 flex justify-center">
        <div className="flex items-end h-[150px] gap-1">
          {ratingData.map((item) => {
            const isMaxValue =
              item.percentage === maxPercentage && maxPercentage > 0
            const barOpacity = 0.4
            const textOpacity = item.percentage === 0 ? 0 : isMaxValue ? 1 : 0.4

            return (
              <div
                key={item.rating}
                className="flex flex-col items-center gap-2"
              >
                {/* 별점 숫자 */}
                <span
                  className="text-[16px] font-medium leading-[140%]"
                  style={{
                    color: 'var(--color-gray-900)',
                    opacity: textOpacity,
                  }}
                >
                  {item.rating}
                </span>

                {/* 막대 그래프 */}
                <div
                  className="w-7"
                  style={{
                    height: `${getBarHeight(item.percentage)}px`,
                    backgroundColor: 'var(--color-main)',
                    borderRadius: item.percentage === 0 ? '0' : '4px 4px 0 0',
                    opacity: isMaxValue ? 1 : barOpacity,
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* 통계 */}
      <div className="mt-8 flex justify-center gap-[60px]">
        {/* 별점 평균 */}
        <div className="text-center">
          <p
            className="text-[16px] font-medium leading-[140%]"
            style={{ color: 'var(--color-gray-900)' }}
          >
            {averageRating}
          </p>
          <p
            className="mt-2 text-[14px] font-medium leading-[140%]"
            style={{ color: 'var(--color-gray-500)' }}
          >
            별점 평균
          </p>
        </div>

        {/* 리뷰 수 */}
        <div className="text-center">
          <p
            className="text-[16px] font-medium leading-[140%]"
            style={{ color: 'var(--color-gray-900)' }}
          >
            {totalReviews}
          </p>
          <p
            className="mt-2 text-[14px] font-medium leading-[140%]"
            style={{ color: 'var(--color-gray-500)' }}
          >
            리뷰 수
          </p>
        </div>

        {/* 많이 준 별점 */}
        <div className="text-center">
          <p
            className="text-[16px] font-medium leading-[140%]"
            style={{ color: 'var(--color-gray-900)' }}
          >
            {mostGivenRating}
          </p>
          <p
            className="mt-2 text-[14px] font-medium leading-[140%]"
            style={{ color: 'var(--color-gray-500)' }}
          >
            많이 준 별점
          </p>
        </div>
      </div>
    </div>
  )
}
