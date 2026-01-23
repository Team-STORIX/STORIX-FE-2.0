'use client'

import { useEffect, useRef } from 'react'

export type TopicRoomUiMessage = {
  key: string
  serverId?: number
  senderId?: number | null
  senderName?: string | null
  text: string
  time?: string
  isMine: boolean
}

type Props = {
  messages: TopicRoomUiMessage[]
  onReachTop?: () => void
  isFetchingPrev?: boolean
  hasPrev?: boolean
  scrollRef?: React.RefObject<HTMLDivElement | null>
}

export default function TopicRoomMessages({
  messages,
  onReachTop,
  isFetchingPrev,
  hasPrev,
  scrollRef,
}: Props) {
  const internalRef = useRef<HTMLDivElement | null>(null)
  const ref = scrollRef ?? internalRef

  const onScroll = () => {
    const el = ref.current
    if (!el) return
    if (!onReachTop) return
    if (!hasPrev) return
    if (isFetchingPrev) return

    if (el.scrollTop <= 24) {
      onReachTop() // ✅ UI 변경(상단 도달 → 과거 로드)
    }
  }

  // ✅ 최초 렌더/새 메시지로 바닥 유지(기존 프로젝트 동작과 충돌 시 제거 가능)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, []) // 최초 1회

  return (
    <div
      ref={ref}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto px-4 pb-24 pt-2"
    >
      {isFetchingPrev && (
        <div className="py-2 caption-1 text-gray-400">
          이전 메시지를 불러오는 중...
        </div>
      )}

      {messages.map((m) => (
        <div key={m.key} className="mb-3">
          <div className={m.isMine ? 'flex justify-end' : 'flex justify-start'}>
            <div className="flex items-end gap-2 max-w-[85%]">
              <div
                className={[
                  'max-w-[70%] rounded-2xl px-4 py-3 body-2',
                  m.isMine
                    ? 'bg-[var(--color-magenta-300)] text-white'
                    : 'border border-gray-100 bg-white text-gray-800',
                ].join(' ')}
              >
                {m.text}
              </div>
              {!!m.time && (
                <span className="caption-1 text-gray-400">{m.time}</span>
              )}{' '}
              {/* ✅ */}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
