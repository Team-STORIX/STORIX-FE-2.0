// src/app/home/topicroom/[id]/TopicRoomClient.tsx
'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useJoinTopicRoom } from '@/hooks/topicroom/useJoinTopicRoom'
import { useLeaveTopicRoom } from '@/hooks/topicroom/useLeaveTopicRoom'
import { useTopicRoomInfoById } from '@/hooks/topicroom/useTopicRoomInfoById'
import { useTopicRoomStomp } from '@/hooks/topicroom/useTopicRoomStomp'
import { useChatRoomMessagesInfinite } from '@/hooks/topicroom/useChatRoomMessagesInfinite' // ✅
import { useAuthStore } from '@/store/auth.store' // ✅
import { getUserIdFromJwt } from '@/lib/api/utils/jwt' // ✅

import TopicRoomMessages, {
  TopicRoomUiMessage,
} from '@/components/topicroom/TopicRoomMessages' // ✅
import TopicRoomInputBar from '@/components/topicroom/TopicRoomInputBar'
import TopicRoomLeaveModal from '@/components/topicroom/TopicRoomLeaveModal'
import TopicRoomTopBar from '@/components/topicroom/TopicRoomTopBar'

const formatKoreanTime = (value?: string | null) => {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(d)
}

export default function TopicRoomPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const sp = useSearchParams()

  const roomId = Number(params.id)
  const worksName = sp.get('worksName') ?? ''

  const accessToken = useAuthStore((s) => s.accessToken) // ✅
  const myUserId = useMemo(() => getUserIdFromJwt(accessToken), [accessToken]) // ✅

  // ✅ 입장/퇴장: 컴포넌트에서 API 직접 호출 금지 -> 훅만
  const joinMut = useJoinTopicRoom()
  const leaveMut = useLeaveTopicRoom()

  // ✅ 헤더: query 훅으로
  const infoQuery = useTopicRoomInfoById({
    keyword: worksName,
    topicRoomId: roomId,
  })
  // ✅ infoQuery(=findTopicRoomInfoById 기반)에서 isJoined를 확인할 수 있어야 함
  const info = infoQuery.data

  const chatRoomId = useMemo(() => {
    // ✅ 백엔드가 info에 chatRoomId/roomId 같은 필드로 내려주는 경우를 우선 사용
    const candidate =
      (info as any)?.chatRoomId ?? (info as any)?.roomId ?? roomId

    const n = Number(candidate)
    return Number.isFinite(n) && n > 0 ? n : roomId
  }, [info, roomId]) // ✅

  // ✅ STOMP(Native WebSocket) 연결
  const {
    status,
    messages: stompMessages,
    sendMessage,
    disconnect,
  } = useTopicRoomStomp({
    roomId: chatRoomId,
  })

  const historyQuery = useChatRoomMessagesInfinite({
    roomId: chatRoomId,
    size: 20,
    sort: 'createdAt,DESC',
  })

  const [text, setText] = useState('')
  const inputRef = useRef<HTMLTextAreaElement | null>(null)

  const [leaveModalOpen, setLeaveModalOpen] = useState(false)

  const didJoinRef = useRef(false) // ✅ StrictMode(DEV) 이중 호출 가드

  // ✅ 과거 로드 시 스크롤 점프 방지용
  const scrollRef = useRef<HTMLDivElement | null>(null) // ✅
  const prevScrollHeightRef = useRef(0) // ✅
  const prevScrollTopRef = useRef(0) // ✅

  // 1) 입장 호출
  useEffect(() => {
    if (!roomId) return
    if (didJoinRef.current) return
    // ✅ info가 아직 없으면 대기 (불필요한 join 방지)
    if (!info) return

    // ✅ 이미 참여 중이면 join 요청 자체를 보내지 않음 -> 409 사라짐
    if (info.isJoined) {
      didJoinRef.current = true // ✅
      return
    }

    didJoinRef.current = true // ✅
    joinMut.mutate(roomId) // ✅
  }, [roomId, infoQuery.data, joinMut])

  // 2) 퇴장 성공 후 이동(onSuccess 금지)
  useEffect(() => {
    if (!leaveMut.isSuccess) return
    router.back()
  }, [leaveMut.isSuccess, router])

  const header = useMemo(() => {
    if (info) {
      return {
        title: `${info.worksType ?? '작품'} <${info.worksName}>`,
        sub: info.topicRoomName,
        count: info.activeUserNumber ?? 0,
      }
    }
    return {
      title: worksName ? `작품 <${worksName}>` : '채팅룸',
      sub: '',
      count: 0,
    }
  }, [info, worksName])

  // ✅ 과거 메시지 → UI 메시지(시간 오름차순으로)
  const historyUiMessages: TopicRoomUiMessage[] = useMemo(() => {
    const pages = historyQuery.data?.pages ?? []
    const flat = pages.flatMap((p) => p.content)
    const asc = [...flat].reverse()

    return asc.map((m) => ({
      key: `h-${m.id}`,
      serverId: m.id,
      senderId: m.senderId,
      senderName: m.senderName ?? null,
      text: m.message,
      time: formatKoreanTime(m.createdAt),
      isMine: !!myUserId && m.senderId === myUserId, // ✅ 내/상대 구분
    }))
  }, [historyQuery.data, myUserId])

  // ✅ STOMP 메시지 → UI 메시지(형식이 달라도 최대한 안전하게 매핑)
  const stompUiMessages: TopicRoomUiMessage[] = useMemo(() => {
    const arr = (stompMessages ?? []) as any[]

    return arr.map((m, idx) => {
      const senderId = Number(m.senderId ?? m.senderID ?? m.userId ?? m.userID)
      const serverId = Number(m.id)

      const text = String(m.message ?? m.text ?? '')
      const createdAt = m.createdAt ?? m.created_at ?? m.time ?? null
      const time =
        typeof createdAt === 'string' &&
        createdAt.includes(':') &&
        !createdAt.includes('T')
          ? createdAt
          : formatKoreanTime(createdAt)

      const key = Number.isFinite(serverId)
        ? `s-${serverId}`
        : `s-gen-${idx}-${senderId}-${time}`

      return {
        key,
        serverId: Number.isFinite(serverId) ? serverId : undefined,
        senderId: Number.isFinite(senderId) ? senderId : undefined,
        senderName: (m.senderName ??
          m.userName ??
          m.nickName ??
          m.nickname ??
          null) as string | null,
        text,
        time,
        isMine:
          !!myUserId && Number.isFinite(senderId) && senderId === myUserId, // ✅ 내/상대 구분
      }
    })
  }, [stompMessages, myUserId])

  // ✅ 과거 + 실시간 합치기(중복 제거: serverId 우선)
  const mergedMessages: TopicRoomUiMessage[] = useMemo(() => {
    const map = new Map<string, TopicRoomUiMessage>()

    for (const m of historyUiMessages) {
      const k = m.serverId ? `id-${m.serverId}` : m.key
      map.set(k, m)
    }

    for (const m of stompUiMessages) {
      const k = m.serverId ? `id-${m.serverId}` : m.key
      map.set(k, m)
    }

    return Array.from(map.values())
  }, [historyUiMessages, stompUiMessages])

  // ✅ 상단 도달 시 과거 로드 + 스크롤 위치 유지
  const onReachTopLoadPrev = () => {
    const el = scrollRef.current
    if (!el) return
    if (!historyQuery.hasNextPage) return
    if (historyQuery.isFetchingNextPage) return

    prevScrollHeightRef.current = el.scrollHeight // ✅
    prevScrollTopRef.current = el.scrollTop // ✅

    historyQuery.fetchNextPage() // ✅
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    if (!historyQuery.isFetchingNextPage && prevScrollHeightRef.current) {
      const newHeight = el.scrollHeight
      const diff = newHeight - prevScrollHeightRef.current
      el.scrollTop = prevScrollTopRef.current + diff
      prevScrollHeightRef.current = 0
      prevScrollTopRef.current = 0
    }
  }, [historyQuery.isFetchingNextPage, historyUiMessages.length])

  const onSend = () => {
    const ok = sendMessage(text)
    if (!ok) return
    setText('')
    inputRef.current?.focus()
  }

  const onClickReport = () => {
    router.push(`/home/topicroom/${roomId}/report`) // ✅
  }

  const onClickLeave = () => {
    setLeaveModalOpen(true) // ✅
  }

  const onConfirmLeave = async () => {
    // ✅ 요구사항: 페이지 이동/나갈 때 UNSUBSCRIBE 명시(훅 내부 disconnect가 unsubscribe+deactivate 수행)
    await disconnect() // ✅
    leaveMut.mutate(roomId) // ✅
  }

  return (
    <div className="relative mx-auto flex h-screen max-w-[393px] flex-col bg-white">
      {/* Top */}
      <TopicRoomTopBar
        title={header.title}
        subtitle={header.sub}
        count={header.count}
        onBack={() => router.back()}
        onReport={onClickReport}
        onLeave={onClickLeave}
      />

      {/* Body */}
      <TopicRoomMessages
        messages={mergedMessages} // ✅
        onReachTop={onReachTopLoadPrev} // ✅ UI 변경(상단에서 과거 로드)
        isFetchingPrev={historyQuery.isFetchingNextPage} // ✅
        hasPrev={historyQuery.hasNextPage} // ✅
        scrollRef={scrollRef} // ✅
      />

      {/* Input */}
      <TopicRoomInputBar
        status={status}
        text={text}
        setText={setText}
        onSend={onSend}
        inputRef={inputRef}
      />

      {/* 토픽룸 나가기 모달 */}
      <TopicRoomLeaveModal
        open={leaveModalOpen}
        isPending={leaveMut.isPending}
        onClose={() => setLeaveModalOpen(false)}
        onConfirm={onConfirmLeave}
      />
    </div>
  )
}
