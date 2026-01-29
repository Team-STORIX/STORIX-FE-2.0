// src/app/components/review/ReviewDeleteConfirmModal.tsx
'use client'

type Props = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  confirmDisabled?: boolean
}

export default function ReviewDeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  confirmDisabled = false,
}: Props) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[340px] rounded-2xl bg-white px-5 py-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="heading-2 text-center">리뷰 삭제</p>
        <p className="body-2 mt-2 text-center text-gray-400">
          정말 리뷰를 삭제하시겠습니까?
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            className="flex-1 rounded-xl border border-gray-200 py-3 body-1 text-gray-500 cursor-pointer"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className="flex-1 rounded-xl bg-black py-3 body-1 text-white cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onConfirm}
            disabled={confirmDisabled}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}
