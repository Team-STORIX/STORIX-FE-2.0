'use client'

import { RefObject } from 'react'

type Props = {
  status: 'idle' | 'connecting' | 'open' | 'closed' | 'error'
  text: string
  setText: (v: string) => void
  onSend: () => void
  inputRef: RefObject<HTMLInputElement | null>
}

export default function TopicRoomInputBar({
  status,
  text,
  setText,
  onSend,
  inputRef,
}: Props) {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white px-4 pb-4 pt-2">
      <div className="flex items-center gap-3">
        <div className="flex h-10 flex-1 items-center rounded-full border border-gray-200 bg-gray-50 px-4">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) onSend()
            }}
            placeholder={
              status === 'open' ? '메시지를 입력하세요' : '연결 중...'
            }
            className="w-full bg-transparent body-2 outline-none"
            disabled={status !== 'open'}
          />
        </div>
        <button
          type="button"
          className="h-10 w-10 rounded-full bg-gray-200 cursor-pointer"
          onClick={onSend}
          disabled={status !== 'open' || !text.trim()}
        >
          ➤
        </button>
      </div>
    </div>
  )
}
