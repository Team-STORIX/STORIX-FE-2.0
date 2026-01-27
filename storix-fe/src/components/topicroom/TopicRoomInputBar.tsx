// src/components/topicroom/TopicRoomInputBar.tsx
'use client'

import { useEffect, useRef } from 'react'
import TopicRoomSendIcon from '@/components/topicroom/icons/TopicRoomSendIcon'

type Props = {
  status: string
  text: string
  setText: (v: string) => void
  onSend: () => void
  inputRef?: React.RefObject<HTMLTextAreaElement | null>
}

const MAX_LINES = 6 //
const FALLBACK_LINE_HEIGHT = 22

export default function TopicRoomInputBar({
  status,
  text,
  setText,
  onSend,
  inputRef,
}: Props) {
  const internalRef = useRef<HTMLTextAreaElement | null>(null)
  const ref = inputRef ?? internalRef

  const lineHeightRef = useRef<number>(FALLBACK_LINE_HEIGHT)

  const resize = () => {
    const el = ref.current
    if (!el) return

    //   최초 1회 line-height 측정
    const cs = window.getComputedStyle(el)
    const lh = parseFloat(cs.lineHeight)
    if (Number.isFinite(lh) && lh > 0) lineHeightRef.current = lh

    el.style.height = 'auto' //
    const maxHeight = lineHeightRef.current * MAX_LINES

    const next = Math.min(el.scrollHeight, maxHeight)
    el.style.height = `${next}px` //

    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden' //
  }

  useEffect(() => {
    resize() //   text 변경 시 높이 갱신
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    //   Enter: 전송 / Shift+Enter: 줄바꿈
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (text.trim().length === 0) return
      onSend()
    }
  }

  const statusLower = String(status).toLowerCase()
  const isConnected = statusLower === 'open' || statusLower === 'connected'
  const hasText = text.trim().length > 0

  return (
    <div className="fixed bottom-0 left-1/2 w-full max-w-[393px] -translate-x-1/2 bg-white p-4 border-t border-gray-100">
      <div className="flex items-stretch gap-3">
        {/*   input -> textarea (자동 높이) */}
        <div className="flex-1 rounded-[20px] border border-gray-200 bg-gray-50 px-4 min-h-[36px] flex items-center">
          <textarea
            ref={ref}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onInput={resize} //   입력 즉시 반영
            disabled={false}
            rows={1}
            className="w-full resize-none bg-transparent body-2 outline-none overflow-y-hidden py-2" //
            style={{ height: 'auto' }} //   초기값
          />
        </div>

        {/* 전송 버튼 */}
        <button
          type="button"
          onClick={() => {
            if (!isConnected) return // ✅
            if (!hasText) return // ✅
            onSend()
          }}
          disabled={!isConnected || !hasText}
          className={[
            'flex items-center justify-center rounded-full bg-black self-end',
            hasText ? 'text-gray-900 cursor-pointer' : 'text-pink', //
          ].join(' ')}
          onPointerDown={(e) => e.stopPropagation()} //   (드래그 캡처 클릭 씹힘 방지)
        >
          <TopicRoomSendIcon
            className={hasText ? 'text-black' : 'text-gray-300'}
          />
        </button>
      </div>
    </div>
  )
}
