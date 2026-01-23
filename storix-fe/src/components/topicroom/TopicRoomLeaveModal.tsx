'use client'

type Props = {
  open: boolean
  isPending: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function TopicRoomLeaveModal({
  open,
  isPending,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center px-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[353px] rounded-2xl bg-white shadow-lg px-6 py-6"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="heading-2 text-center text-black">토픽룸 나가기</p>
        <p className="body-2 mt-2 whitespace-pre-line text-center text-gray-500">
          정말 토픽룸에서 퇴장하시겠습니까?
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-xl border border-gray-200 bg-white text-body-1 text-gray-800 cursor-pointer"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={[
              'h-12 rounded-xl text-body-1 cursor-pointer',
              isPending ? 'bg-gray-200 text-gray-400' : 'bg-black text-white',
            ].join(' ')}
          >
            {isPending ? '나가는 중' : '나가기'}
          </button>
        </div>
      </div>
    </div>
  )
}
