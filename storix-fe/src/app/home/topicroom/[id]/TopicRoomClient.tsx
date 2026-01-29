// src/app/home/topicroom/[id]/TopicRoomClient.tsx
'use client'

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { useJoinTopicRoom } from '@/hooks/topicroom/useJoinTopicRoom'
import { useLeaveTopicRoom } from '@/hooks/topicroom/useLeaveTopicRoom'
import { useTopicRoomInfoById } from '@/hooks/topicroom/useTopicRoomInfoById'
import { useTopicRoomStomp } from '@/hooks/topicroom/useTopicRoomStomp'
import { useChatRoomMessagesInfinite } from '@/hooks/topicroom/useChatRoomMessagesInfinite'
import { useTopicRoomMembers } from '@/hooks/topicroom/useTopicRoomMembers'
import { useAuthStore } from '@/store/auth.store'
import { getUserIdFromJwt } from '@/lib/api/utils/jwt'

import TopicRoomMessages, {
  TopicRoomUiMessage,
} from '@/components/topicroom/TopicRoomMessages'
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

  const accessToken = useAuthStore((s) => s.accessToken)
  const myUserId = useMemo(() => getUserIdFromJwt(accessToken), [accessToken])

  //   입장/퇴장: 컴포넌트에서 API 직접 호출 금지 -> 훅만
  const joinMut = useJoinTopicRoom()
  const leaveMut = useLeaveTopicRoom()

  //   헤더: query 훅으로
  const infoQuery = useTopicRoomInfoById({
    keyword: worksName,
    topicRoomId: roomId,
  })
  const info = infoQuery.data

  const chatRoomId = useMemo(() => {
    const candidate =
      (info as any)?.chatRoomId ?? (info as any)?.roomId ?? roomId

    const n = Number(candidate)
    return Number.isFinite(n) && n > 0 ? n : roomId
  }, [info, roomId])

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

  const didJoinRef = useRef(false)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const prevScrollHeightRef = useRef(0)
  const prevScrollTopRef = useRef(0)

  useEffect(() => {
    if (!roomId) return
    if (didJoinRef.current) return
    if (!info) return

    if (info.isJoined) {
      didJoinRef.current = true
      return
    }

    didJoinRef.current = true
    joinMut.mutate(roomId)
  }, [roomId, infoQuery.data, joinMut])

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

  const membersQuery = useTopicRoomMembers(roomId)

  const memberMap = useMemo(() => {
    const map = new Map<
      number,
      { nickName: string; profileImageUrl: string | null }
    >()
    const list = membersQuery.data ?? []
    for (const m of list) {
      map.set(m.userId, {
        nickName: m.nickName,
        profileImageUrl: m.profileImageUrl,
      })
    }
    return map
  }, [membersQuery.data])

  const toAbsoluteUrl = (url?: string | null) => {
    if (!url) return null
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    const base = process.env.NEXT_PUBLIC_API_URL ?? 'https://api.storix.kr'
    return `${base}${url.startsWith('/') ? '' : '/'}${url}`
  }

  //   과거 메시지 → UI 메시지(시간 오름차순으로)
  const historyUiMessages: TopicRoomUiMessage[] = useMemo(() => {
    const pages = historyQuery.data?.pages ?? []
    const flat = pages.flatMap((p) => p.content)
    const asc = [...flat].reverse()

    return asc.map((m) => {
      const normalizedSenderId =
        Number.isFinite(m.senderId) && m.senderId > 0 ? m.senderId : undefined //

      const member = normalizedSenderId
        ? memberMap.get(normalizedSenderId)
        : undefined

      const mt = String(m.messageType ?? 'TALK').toUpperCase() //
      const isPresence = mt === 'ENTER' || mt === 'EXIT' || mt === 'LEAVE' //
      const presenceAction = mt === 'ENTER' ? 'enter' : 'leave' //

      const senderName = (member?.nickName ?? m.senderName ?? null) as
        | string
        | null

      return {
        key: `h-${m.id}`,
        serverId: m.id,
        kind: isPresence ? 'presence' : 'chat',
        action: isPresence ? presenceAction : undefined,
        userName: isPresence ? (senderName ?? '사용자') : undefined,
        createdAt: m.createdAt ?? null,
        senderId: normalizedSenderId ?? null,
        senderName,
        senderProfileImageUrl: toAbsoluteUrl(member?.profileImageUrl) ?? null,
        text: m.message,
        time: formatKoreanTime(m.createdAt),
        isMine: isPresence
          ? false
          : !!myUserId && normalizedSenderId === myUserId,
      }
    })
  }, [historyQuery.data, myUserId, memberMap, toAbsoluteUrl]) //

  //   STOMP 메시지 → UI 메시지
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

      const normalizedSenderId =
        Number.isFinite(senderId) && senderId > 0 ? senderId : undefined
      const member = normalizedSenderId
        ? memberMap.get(normalizedSenderId)
        : undefined

      return {
        key,
        serverId: Number.isFinite(serverId) ? serverId : undefined,
        kind: 'chat',
        createdAt: typeof createdAt === 'string' ? createdAt : null,
        senderId: normalizedSenderId,
        senderName:
          member?.nickName ??
          ((m.senderName ?? m.userName ?? m.nickName ?? m.nickname ?? null) as
            | string
            | null),
        senderProfileImageUrl: toAbsoluteUrl(member?.profileImageUrl) ?? null,
        text,
        time,
        isMine:
          !!myUserId && Number.isFinite(senderId) && senderId === myUserId,
      }
    })
  }, [stompMessages, myUserId, memberMap, toAbsoluteUrl]) //

  //   과거 + 실시간 합치기(중복 제거)
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

    const toTimeValue = (iso?: string | null) => {
      if (!iso) return Number.POSITIVE_INFINITY
      const t = new Date(iso).getTime()
      return Number.isNaN(t) ? Number.POSITIVE_INFINITY : t
    }

    const merged = Array.from(map.values())

    //: createdAt ASC 정렬(날짜 chip 중복/역순 방지)
    merged.sort((a, b) => {
      const ta = toTimeValue(a.createdAt ?? null)
      const tb = toTimeValue(b.createdAt ?? null)
      if (ta !== tb) return ta - tb

      //: 같은 타임스탬프면 serverId → key 순으로 안정 정렬
      const sa = a.serverId ?? Number.POSITIVE_INFINITY
      const sb = b.serverId ?? Number.POSITIVE_INFINITY
      if (sa !== sb) return sa - sb
      return String(a.key).localeCompare(String(b.key))
    })

    return merged
  }, [historyUiMessages, stompUiMessages])

  //: 날짜 경계마다 날짜 chip 삽입
  const messagesWithChips: TopicRoomUiMessage[] = useMemo(() => {
    const out: TopicRoomUiMessage[] = []
    let lastDateKey = ''

    const toDateKey = (iso?: string | null) => {
      if (!iso) return ''
      const d = new Date(iso)
      if (Number.isNaN(d.getTime())) return ''
      const y = d.getFullYear()
      const m = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${y}-${m}-${day}`
    }

    for (const m of mergedMessages) {
      const dk = toDateKey(m.createdAt ?? null)
      if (dk && dk !== lastDateKey) {
        out.push({
          key: `chip-date-${dk}`,
          kind: 'date',
          date: m.createdAt ?? undefined,
          createdAt: m.createdAt ?? null,
          text: '',
          isMine: false,
        })
        lastDateKey = dk
      }
      out.push(m)
    }

    return out
  }, [mergedMessages])

  const onReachTopLoadPrev = () => {
    const el = scrollRef.current
    if (!el) return
    if (!historyQuery.hasNextPage) return
    if (historyQuery.isFetchingNextPage) return

    prevScrollHeightRef.current = el.scrollHeight
    prevScrollTopRef.current = el.scrollTop

    historyQuery.fetchNextPage()
  }

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return
    if (historyQuery.isFetchingNextPage) return
    if (!prevScrollHeightRef.current) return

    // DOM 반영 이후 높이 차이를 계산(플리커 최소화)
    requestAnimationFrame(() => {
      const newHeight = el.scrollHeight
      const diff = newHeight - prevScrollHeightRef.current
      el.scrollTop = prevScrollTopRef.current + diff
      prevScrollHeightRef.current = 0
      prevScrollTopRef.current = 0
    })
  }, [historyQuery.isFetchingNextPage, messagesWithChips.length])

  const onSend = () => {
    const ok = sendMessage(text)
    if (!ok) return
    setText('')
    inputRef.current?.focus()
  }

  const onClickReport = () => {
    router.push(`/home/topicroom/${roomId}/report`)
  }

  const onClickLeave = () => {
    setLeaveModalOpen(true)
  }

  const onConfirmLeave = async () => {
    await disconnect()
    leaveMut.mutate(roomId)
  }

  return (
    <div className="relative mx-auto flex h-screen max-w-[393px] flex-col bg-white">
      <TopicRoomTopBar
        title={header.title}
        subtitle={header.sub}
        count={header.count}
        onBack={() => router.back()}
        onReport={onClickReport}
        onLeave={onClickLeave}
      />

      <TopicRoomMessages
        messages={messagesWithChips}
        onReachTop={onReachTopLoadPrev}
        isFetchingPrev={historyQuery.isFetchingNextPage}
        hasPrev={historyQuery.hasNextPage}
        scrollRef={scrollRef}
      />

      <TopicRoomInputBar
        status={status}
        text={text}
        setText={setText}
        onSend={onSend}
        inputRef={inputRef}
      />

      <TopicRoomLeaveModal
        open={leaveModalOpen}
        isPending={leaveMut.isPending}
        onClose={() => setLeaveModalOpen(false)}
        onConfirm={onConfirmLeave}
      />
    </div>
  )
}
