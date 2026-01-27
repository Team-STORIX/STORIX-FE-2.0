// src/components/topicroom/TopicRoomInputBar.tsx
'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import TopicRoomSendIcon from '@/components/topicroom/icons/TopicRoomSendIcon'

type BaseProps = {
  status: string
  onSend: () => void
  inputRef?: React.RefObject<HTMLTextAreaElement | null>
}

// ✅ 기존 코드(text/setText) + 혹시 다른 곳에서 쓰던(value/onChange) 둘 다 지원
type Props =
  | (BaseProps & {
      text: string
      setText:
        | React.Dispatch<React.SetStateAction<string>>
        | ((v: string) => void)
    })
  | (BaseProps & {
      value: string
      onChange: (v: string) => void
    })

const MAX_LINES = 6
const FALLBACK_LINE_HEIGHT = 22

export default function TopicRoomInputBar(props: Props) {
  const internalRef = useRef<HTMLTextAreaElement | null>(null)
  const ref =
    'inputRef' in props && props.inputRef ? props.inputRef : internalRef

  // ✅ props normalize
  const text = 'text' in props ? props.text : props.value
  const setText =
    'setText' in props ? props.setText : (v: string) => props.onChange(v)

  const status = props.status
  const onSend = props.onSend

  const lineHeightRef = useRef<number>(FALLBACK_LINE_HEIGHT)
  const barRef = useRef<HTMLDivElement | null>(null)

  // ✅ 키보드 오프셋 (카톡처럼 키보드 위에 붙이기)
  const [keyboardBottomPx, setKeyboardBottomPx] = useState(0)

  const resize = () => {
    const el = ref.current
    if (!el) return

    const cs = window.getComputedStyle(el)
    const lh = parseFloat(cs.lineHeight)
    if (Number.isFinite(lh) && lh > 0) lineHeightRef.current = lh

    el.style.height = 'auto'
    const maxHeight = lineHeightRef.current * MAX_LINES

    const next = Math.min(el.scrollHeight, maxHeight)
    el.style.height = `${next}px`
    el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden'
  }

  useEffect(() => {
    resize()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  // ✅ visualViewport 기반 키보드 높이 감지
  useEffect(() => {
    const vv = window.visualViewport
    if (!vv) return

    const update = () => {
      const bottom = Math.max(
        0,
        window.innerHeight - (vv.height + vv.offsetTop),
      )
      setKeyboardBottomPx(bottom)
    }

    update()
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)

    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [])

  // ✅ InputBar 높이를 CSS 변수로 저장(메시지 padding에 쓰고 싶으면 사용)
  useLayoutEffect(() => {
    const el = barRef.current
    if (!el) return
    const h = el.getBoundingClientRect().height
    document.documentElement.style.setProperty(
      '--topicroom-inputbar-h',
      `${h}px`,
    )
  })

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (text.trim().length === 0) return
      if (!isConnected) return
      onSend()
    }
  }

  const statusLower = String(status).toLowerCase()
  const isConnected = statusLower === 'open' || statusLower === 'connected'
  const hasText = text.trim().length > 0
  const isSendDisabled = !isConnected || !hasText

  return (
    <div
      ref={barRef}
      className="fixed left-0 right-0 z-[60] bg-white border-t border-gray-100" // ✅ UI 변경
      style={{
        bottom: `calc(env(safe-area-inset-bottom) + ${keyboardBottomPx}px)`, // ✅ UI 변경
      }}
    >
      <div className="mx-auto w-full max-w-[393px] p-4">
        <div className="flex items-stretch gap-3">
          <div className="flex-1 rounded-[20px] border border-gray-200 bg-gray-50 px-4 min-h-[36px] flex items-center">
            <textarea
              ref={ref}
              value={text}
              onChange={(e) => (setText as any)(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={resize}
              rows={1}
              className="w-full resize-none bg-transparent body-2 outline-none overflow-y-hidden py-2"
              style={{ height: 'auto' }}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              if (isSendDisabled) return
              onSend()
            }}
            disabled={isSendDisabled}
            className={[
              'flex items-center justify-center rounded-full bg-black self-end',
              hasText ? 'cursor-pointer' : '',
            ].join(' ')}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <TopicRoomSendIcon
              className={hasText ? 'text-black' : 'text-gray-300'}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
