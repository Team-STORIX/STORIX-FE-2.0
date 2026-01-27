'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

export type TopicRoomUiMessage = {
  key: string
  serverId?: number
  senderId?: number | null
  senderName?: string | null
  senderProfileImageUrl?: string | null
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
      onReachTop() //   UI 변경(상단 도달 → 과거 로드)
    }
  }

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [])

  return (
    <div
      ref={ref}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto px-4 pt-2"
      style={{
        paddingBottom: 'calc(var(--topicroom-inputbar-h, 96px) + 16px)',
      }}
    >
      {isFetchingPrev && (
        <div className="py-2 caption-1 text-gray-400">
          이전 메시지를 불러오는 중...
        </div>
      )}

      {messages.map((m) => (
        <div key={m.key} className="mb-3">
          <div className={m.isMine ? 'flex justify-end' : 'flex justify-start'}>
            {m.isMine ? (
              <div className="flex items-end gap-2 w-full justify-end">
                {!!m.time && (
                  <span className="caption-1 text-gray-400">{m.time}</span>
                )}
                <div
                  className={[
                    'max-w-[70%] rounded-2xl px-3 py-2 body-2',
                    'bg-[var(--color-magenta-300)] text-white',
                    `rounded-b-xl rounded-tl-xl rounded-tr-sm`,
                  ].join(' ')}
                >
                  {m.text}
                </div>
              </div>
            ) : (
              // 상대 메시지에 프로필 + 닉네임 표시
              <div className="flex items-start gap-2">
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-gray-100 flex items-center justify-center">
                  {m.senderProfileImageUrl ? (
                    <Image
                      src={m.senderProfileImageUrl}
                      alt={m.senderName ?? 'profile'}
                      width={36}
                      height={36}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Image
                      src={'/common/icons/reviewProfile.svg'}
                      alt={m.senderName ?? 'profile'}
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="flex flex-col">
                  {!!m.senderName && (
                    <p className="body-2 text-gray-700 mb-1">{m.senderName}</p>
                  )}

                  <div className="flex items-end gap-2">
                    <div
                      className={[
                        `max-w-[70%] rounded-2xl px-3 py-2 body-2`,
                        `border border-gray-300 bg-gray-50 text-gray-900`,
                        `rounded-b-xl rounded-tr-xl rounded-tl-sm`,
                      ].join(' ')}
                    >
                      {m.text}
                    </div>

                    {!!m.time && (
                      <span className="caption-1 text-gray-400">{m.time}</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
