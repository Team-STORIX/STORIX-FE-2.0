// src/app/writers/profile/components/articles.tsx
'use client'

export default function Articles() {
  const stats = { views: 0, likes: 0, comments: 0, paid: 0 }

  const items = [
    { label: '조회', value: `${stats.views}회` },
    { label: '좋아요', value: `${stats.likes}개` },
    { label: '댓글', value: `${stats.comments}개` },
    { label: '팬 컨텐츠 결제', value: `${stats.paid}건` },
  ]

  return (
    <section className="w-full bg-[var(--color-white)] px-4 py-8 border-bottom">
      {/* 타이틀 */}
      <div className="flex items-center gap-2">
        <h3 className="text-[18px] font-semibold leading-[140%] text-[var(--color-gray-900)]">
          게시글
        </h3>
        <span className="text-[12px] font-bold leading-[140%] text-[var(--color-gray-300)]">
          최근 7일 기준
        </span>
      </div>

      {/* 2x2 고정 그리드 */}
      <div
        className="mt-6 grid gap-4"
        style={{
          gridTemplateColumns: '177px 177px',
        }}
      >
        {items.map((it) => (
          <div
            key={it.label}
            className="rounded-[8px] border bg-[var(--color-white)]"
            style={{
              width: '177px',
              height: '120px',
              borderColor: 'var(--color-gray-200)',
            }}
          >
            <div
              className="flex h-full w-full flex-col items-start"
              style={{ padding: '20px', gap: '8px' }}
            >
              <p
                className="text-[16px] font-semibold leading-[140%] text-[var(--color-gray-400)]"
                style={{ fontFamily: 'Pretendard' }}
              >
                {it.label}
              </p>

              <p
                className="text-[18px] font-semibold leading-[140%] text-[var(--color-black)]"
                style={{ fontFamily: 'Pretendard' }}
              >
                {it.value}
              </p>

              <p
                className="text-[12px] font-medium leading-[140%] text-[var(--color-gray-400)]"
                style={{ fontFamily: 'Pretendard' }}
              >
                지난 7일 대비 변동 없음
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
