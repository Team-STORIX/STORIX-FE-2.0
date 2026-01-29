// src/components/topicroom/report/ReportReasonSelect.tsx
'use client'

type ReasonKey = 'ABUSE' | 'REDIRECT' | 'OTHER'

type Props = {
  reason: ReasonKey
  setReason: (v: ReasonKey) => void
  otherReason: string
  setOtherReason: (v: string) => void
  showError?: boolean
}

export default function ReportReasonSelect({
  reason,
  setReason,
  otherReason,
  setOtherReason,
  showError,
}: Props) {
  const isOther = reason === 'OTHER'
  const otherLen = otherReason.length

  return (
    <div className="mt-8">
      <p className="heading-2 text-black">신고 사유</p>
      <p className="caption-1 mt-2 text-gray-500">
        구체적인 신고 사유를 선택해주세요
      </p>

      <div className="mt-4 space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            checked={reason === 'ABUSE'}
            onChange={() => setReason('ABUSE')}
          />
          <span className="body-2 text-gray-800">
            욕설, 비방, 혐오 표현을 해요
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            checked={reason === 'REDIRECT'}
            onChange={() => setReason('REDIRECT')}
          />
          <span className="body-2 text-gray-800">
            보이스 피싱과 같이 다른 채널로 유도해요
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="radio"
            checked={reason === 'OTHER'}
            onChange={() => setReason('OTHER')}
          />
          <span className="body-2 text-gray-800">기타</span>
        </label>
      </div>

      <div className="mt-4 relative">
        <textarea
          value={otherReason}
          onChange={(e) => setOtherReason(e.target.value.slice(0, 100))} //
          placeholder="신고 사유를 상세히 남겨 주세요"
          className="w-full h-[120px] rounded-xl border border-gray-200 bg-white px-4 py-3 body-2 outline-none resize-none"
          disabled={!isOther} //   UI 변경
        />
        <span className="absolute bottom-3 right-11 caption-1 text-[var(--color-magenta-300)]">
          {otherLen}
        </span>
        <span className="absolute bottom-3 right-4 caption-1 text-gray-300">
          /100
        </span>
      </div>

      {showError && (
        <p className="mt-3 caption-1 text-[var(--color-magenta-300)]">
          신고에 실패했어요. 다시 시도해주세요.
        </p>
      )}
    </div>
  )
}
