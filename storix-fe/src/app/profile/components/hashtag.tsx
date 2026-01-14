// src/app/profile/components/hashtag.tsx
export default function Hashtag() {
  // ✅ 나중에 API 연동 시 빈 문자열이면 자리만 남고 텍스트는 안 보임
  const ranks = {
    1: '#혜린아보드그만타',
    2: '#유진이바보메롱',
    3: '#나는공주야',
    4: '#못생긴거보면죽는병',
    5: '#남자는말라야아름답다',
  }

  return (
    <div className="px-4 py-8">
      <h2 className="text-[18px] font-semibold leading-[140%] text-[var(--color-gray-900)]">
        선호 해시태그
      </h2>

      {/* ✅ 배경색 제거 (영역은 유지) */}
      <div className="mt-[56px] w-full h-[178px] relative">
        {/* 4위 */}
        <p
          className="absolute body-1 text-[var(--color-gray-500)]"
          style={{ left: 205, top: 0, fontFamily: 'Pretendard' }}
        >
          {ranks[4] || ''}
        </p>

        {/* 3위 */}
        <p
          className="absolute text-[18px] font-semibold leading-[140%] text-[var(--color-magenta-200)]"
          style={{ left: 90, top: 22.4, fontFamily: 'Pretendard' }}
        >
          {ranks[3] || ''}
        </p>

        {/* 1위 */}
        <p
          className="absolute heading-1 text-[var(--color-magenta-400)]"
          style={{ left: 138, top: 47.6, fontFamily: 'Pretendard' }}
        >
          {ranks[1] || ''}
        </p>

        {/* 2위 */}
        <p
          className="absolute heading-2 text-[var(--color-primary-main)]"
          style={{ left: 211, top: 81.2, fontFamily: 'Pretendard' }}
        >
          {ranks[2] || ''}
        </p>

        {/* 5위 */}
        <p
          className="absolute body-2 text-[var(--color-gray-400)]"
          style={{ left: 120, top: 109.2, fontFamily: 'Pretendard' }}
        >
          {ranks[5] || ''}
        </p>
      </div>
    </div>
  )
}
