'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import {
  joinTopicRoom,
  leaveTopicRoom,
  findTopicRoomInfoById,
} from '@/lib/api/topicroom/topicroom.api'

type Msg = {
  id: string
  type: 'me' | 'other'
  userName?: string
  text: string
  time: string
}

export default function TopicRoomPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const sp = useSearchParams()

  const roomId = Number(params.id)
  const worksName = sp.get('worksName') ?? '' // 상세에서 넘겨줌

  const [header, setHeader] = useState<{
    title: string
    sub: string
    count: number
  }>({
    title: '채팅룸',
    sub: '',
    count: 0,
  })

  // ✅ 더미 메시지는 유지
  const [messages, setMessages] = useState<Msg[]>(() => [
    {
      id: 'm1',
      type: 'other',
      userName: '나는 유저2',
      text: '자네들 오늘',
      time: '오후 1:20',
    },
    { id: 'm2', type: 'me', text: '나오자마자 봤지~', time: '오후 1:20' },
  ])

  // ✅ 입장 API
  const joinMut = useMutation({ mutationFn: () => joinTopicRoom(roomId) })

  // ✅ 퇴장(삭제로 요청한 기능은 swagger상 leave가 “퇴장”이라 이걸로 구현)
  const leaveMut = useMutation({
    mutationFn: () => leaveTopicRoom(roomId),
    onSuccess: () => router.back(),
  })

  // 1) 입장 호출
  useEffect(() => {
    if (!roomId) return
    joinMut.mutate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId])

  // 2) 헤더(제목/참여자 수) 채우기: search로 roomId 매칭
  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!worksName || !roomId) return
      const info = await findTopicRoomInfoById(worksName, roomId)
      if (!mounted) return

      if (info) {
        setHeader({
          title: `${info.worksType ?? '작품'} <${info.worksName}>`,
          sub: info.topicRoomName,
          count: info.activeUserNumber ?? 0,
        })
      } else {
        // 검색 결과에 안 잡히는 경우(페이지네이션/키워드 미스) 대비 폴백
        setHeader({ title: `작품 <${worksName}>`, sub: '', count: 0 })
      }
    })()
    return () => {
      mounted = false
    }
  }, [worksName, roomId])

  return (
    <div className="relative mx-auto flex h-screen max-w-[393px] flex-col bg-white">
      {/* Top */}
      <div className="flex h-14 items-center justify-between px-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="h-8 w-8 cursor-pointer"
        >
          ‹
        </button>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <span className="body-2">{header.title}</span>
            <span className="caption-1 text-gray-400">{header.count}</span>
          </div>
          <span className="caption-1 text-gray-400">{header.sub}</span>
        </div>

        <button
          type="button"
          onClick={() => leaveMut.mutate()} // “삭제” 요청 = 일단 퇴장(leave)로 구현
          className="caption-1 text-[var(--color-magenta-300)] cursor-pointer"
          disabled={leaveMut.isPending}
        >
          {leaveMut.isPending ? '나가는 중' : '나가기'}
        </button>
      </div>

      {/* Body (더미 채팅) */}
      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-2">
        {messages.map((m) => (
          <div key={m.id} className="mb-3">
            <div
              className={
                m.type === 'me' ? 'flex justify-end' : 'flex justify-start'
              }
            >
              <div
                className={[
                  'max-w-[70%] rounded-2xl px-4 py-3 body-2',
                  m.type === 'me'
                    ? 'bg-[var(--color-magenta-300)] text-white'
                    : 'border border-gray-100 bg-white text-gray-800',
                ].join(' ')}
              >
                {m.text}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Input (더미 유지) */}
      <div className="absolute bottom-0 left-0 right-0 bg-white px-4 pb-4 pt-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 flex-1 items-center rounded-full border border-gray-200 bg-gray-50 px-4">
            <input
              placeholder="메시지를 입력하세요(더미)"
              className="w-full bg-transparent body-2 outline-none"
              disabled
            />
          </div>
          <button
            type="button"
            className="h-10 w-10 rounded-full bg-gray-200 cursor-pointer"
            disabled
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}
