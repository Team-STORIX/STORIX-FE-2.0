// src/components/feed/write/SpoilerToggle.tsx
'use client'

const MAX_SPOILER_LENGTH = 50

interface SpoilerToggleProps {
  enabled: boolean
  onToggle: () => void
  message: string
  onMessageChange: (value: string) => void
  defaultMessage?: string
}

export default function SpoilerToggle({
  enabled,
  onToggle,
  message,
  onMessageChange,
  defaultMessage = '스포일러가 포함된 피드 보기',
}: SpoilerToggleProps) {
  const isDefault = message === defaultMessage

  const handleUseDefault = () => {
    if (isDefault) {
      onMessageChange('')
    } else {
      onMessageChange(defaultMessage)
    }
  }

  return (
    <div className="flex flex-col -mx-4 gap-2.5 border-bottom px-4 py-6">
      <div className="flex items-center justify-between">
        <span className="body-1-bold text-gray-900">스포일러 방지 문구</span>
        <div className="flex items-center gap-1">
          <span className="caption-1-medium text-gray-500">스포일러 방지</span>
          <button
            type="button"
            onClick={onToggle}
            aria-pressed={enabled}
            aria-label="스포일러 방지 토글"
            className="cursor-pointer hover:opacity-80"
          >
            <img
              src={
                enabled
                  ? '/common/icons/active.svg'
                  : '/common/icons/deactive.svg'
              }
              alt={enabled ? '활성' : '비활성'}
              className="h-4.5 w-8"
            />
          </button>
        </div>
      </div>

      <input
        type="text"
        value={message}
        maxLength={MAX_SPOILER_LENGTH}
        disabled={!enabled}
        onChange={(e) => {
          const next = e.target.value
          onMessageChange(
            next.length > MAX_SPOILER_LENGTH
              ? next.slice(0, MAX_SPOILER_LENGTH)
              : next,
          )
        }}
        placeholder="스포일러 안내 문구를 입력하세요 (예: 괴출 최신화 포함)"
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 body-2-medium text-gray-900 placeholder:text-gray-500 outline-none disabled:placeholder:text-gray-200"
      />

      {enabled && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleUseDefault}
            className="flex items-center gap-1.5 cursor-pointer"
          >
            <img
              src={
                isDefault
                  ? '/common/icons/check-pink.svg'
                  : '/common/icons/check-gray.svg'
              }
              alt={isDefault ? '선택됨' : '선택안됨'}
              className="h-4.5 w-4.5"
            />
            <span className="caption-1-medium text-gray-500">
              기본 문구 사용하기
            </span>
          </button>
          <span className="caption-1-medium text-gray-500">
            <span
              className={
                message.length === MAX_SPOILER_LENGTH
                  ? 'text-[var(--color-warning)]'
                  : 'text-gray-400'
              }
            >
              {message.length}
            </span>
            /{MAX_SPOILER_LENGTH}
          </span>
        </div>
      )}
    </div>
  )
}
