// src/app/writers/profile/components/profit.tsx
'use client'

export default function Profit() {
  const profitPoint = 100
  const periodText = '2025.12.1~2026.1.1'

  return (
    <section className="w-full bg-[var(--color-white)] px-4 py-8">
      <h3 className="text-[18px] font-semibold leading-[140%] text-[var(--color-gray-900)]">
        수익
      </h3>

      {/* 테두리 박스 (361 × 98) */}
      <div
        className="mt-6 rounded-[8px] border bg-[var(--color-white)]"
        style={{
          width: '361px',
          height: '98px',
          borderColor: 'var(--color-gray-200)',
        }}
      >
        {/* 패딩 영역 (사방 20px) */}
        <div
          className="flex h-full w-full flex-col items-start"
          style={{ padding: '20px', gap: '11px' }}
        >
          <div className="flex w-full items-center justify-between">
            <span
              className="text-[16px] font-semibold leading-[140%] text-[var(--color-gray-400)]"
              style={{ fontFamily: 'Pretendard' }}
            >
              최근 30일
            </span>

            <span
              className="text-[12px] font-medium leading-[140%] text-[var(--color-gray-400)]"
              style={{ fontFamily: 'SUIT' }}
            >
              {periodText}
            </span>
          </div>

          <span
            className="text-[18px] font-semibold leading-[140%] text-[var(--color-black)]"
            style={{ fontFamily: 'Pretendard' }}
          >
            {profitPoint}P
          </span>
        </div>
      </div>
    </section>
  )
}
