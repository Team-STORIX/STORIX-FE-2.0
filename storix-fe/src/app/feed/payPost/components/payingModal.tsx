// src/app/feed/payPost/components/payingModal.tsx
'use client'

type PayingModalProps = {
  open: boolean
  onClose: () => void
  onPay: () => void
}

export default function PayingModal({
  open,
  onClose,
  onPay,
}: PayingModalProps) {
  if (!open) return null

  // ✅ API 연동 전 예시 값
  const n = 1000
  const m = 200

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'var(--bottomsheet_background, rgba(0, 0, 0, 0.50))',
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* 바깥 클릭 시 닫힘 */}
      <button
        type="button"
        className="absolute inset-0 cursor-pointer"
        aria-label="모달 닫기"
        onClick={onClose}
      />

      <div
        className="relative w-[306px] h-[193px] rounded-[12px] bg-white"
        style={{ background: 'var(--white, #FFF)' }}
      >
        <div className="flex flex-col items-center">
          {/* 타이틀 */}
          <h2 className="heading-2 mt-[28px] text-[var(--color-gray-900)]">
            포인트 사용하기
          </h2>

          {/* 보유 포인트 */}
          <p className="body-2 mt-[4px] text-center text-[var(--color-gray-500)]">
            보유 포인트: {n}P
          </p>

          {/* 차감 포인트 */}
          <p className="body-2 text-[var(--color-magenta-300)]">
            차감 포인트: {m}P
          </p>

          {/* 버튼 영역 */}
          <div className="mt-[28px] flex items-center">
            {/* 취소 */}
            <button
              type="button"
              onClick={onClose}
              className="flex w-[135px] h-[49px] px-4 py-2 justify-center items-center gap-[10px] rounded-[8px] border border-[var(--color-gray-200)] bg-[var(--color-gray-50)] cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="body-1 text-[var(--color-gray-700)]">취소</span>
            </button>

            {/* 8px gap */}
            <div className="w-[8px]" />

            {/* 결제하기 */}
            <button
              type="button"
              onClick={onPay}
              className="flex w-[135px] h-[49px] px-4 py-2 justify-center items-center gap-[10px] rounded-[8px] border border-[var(--color-gray-900)] bg-[var(--color-gray-900)] cursor-pointer hover:opacity-80 transition-opacity"
            >
              <span className="body-1 text-white">결제하기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
