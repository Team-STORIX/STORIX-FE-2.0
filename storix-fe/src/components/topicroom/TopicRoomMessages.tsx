'use client'

import type { TopicRoomUiMsg } from '@/lib/api/topicroom'

type Props = {
  messages: TopicRoomUiMsg[]
}

export default function TopicRoomMessages({ messages }: Props) {
  return (
    <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2">
      {messages.map((m) => (
        <div key={m.id} className="mb-3">
          {m.type === 'me' ? (
            <div className="flex justify-end items-end gap-2">
              <span className="caption-1 text-gray-400">{m.time}</span>
              <div className="max-w-[70%] rounded-2xl px-4 py-3 body-2 bg-[var(--color-magenta-300)] text-white">
                {m.text}
              </div>
            </div>
          ) : (
            <div className="flex justify-start">
              <div className="max-w-[70%] rounded-2xl px-4 py-3 body-2 border border-gray-100 bg-white text-gray-800">
                {m.text}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
