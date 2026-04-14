'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Client, type IFrame, type StompSubscription } from '@stomp/stompjs'
import { useAuthStore } from '@/store/auth.store'
import { useProfileStore } from '@/store/profile.store'
import {
  STORIX_STOMP_BROKER_URL,
  makeSubscriptionId,
  normalizeTopicRoomStompMessage,
  topicRoomPubPath,
  topicRoomSubPath,
} from '@/lib/api/topicroom'
import type { TopicRoomUiMsg } from '@/lib/api/topicroom'

type Status = 'idle' | 'connecting' | 'open' | 'closed' | 'error'

export const useTopicRoomStomp = (params: { roomId: number }) => {
  const { roomId } = params
  const { accessToken } = useAuthStore()
  const myUserId = useProfileStore((s) => s.me?.userId ?? null) //

  const clientRef = useRef<Client | null>(null)
  const subRef = useRef<StompSubscription | null>(null)
  const subIdRef = useRef<string | null>(null)

  //   동일 조건에서 중복 connect 방지(StrictMode/리렌더)
  const sessionKeyRef = useRef<string>('') //

  //   optimistic 중복 제거
  const pendingSentRef = useRef<
    Array<{ tempId: string; text: string; at: number }>
  >([]) //

  const [status, setStatus] = useState<Status>('idle')
  const [messages, setMessages] = useState<TopicRoomUiMsg[]>([])

  const canConnect = useMemo(
    () => !!roomId && !!accessToken,
    [roomId, accessToken],
  )

  const unsubscribe = useCallback(() => {
    // UNSUBSCRIBE 명시
    try {
      if (subRef.current) {
        subRef.current.unsubscribe() //
      } else if (clientRef.current && subIdRef.current) {
        clientRef.current.unsubscribe(subIdRef.current) //
      }
    } catch {
      // noop
    } finally {
      subRef.current = null
      subIdRef.current = null
    }
  }, [])

  const disconnect = useCallback(async () => {
    unsubscribe() //
    try {
      if (clientRef.current) {
        await clientRef.current.deactivate() //
      }
    } catch {
      // noop
    } finally {
      clientRef.current = null
      setStatus('closed')
    }
  }, [unsubscribe])

  const appendOptimisticMe = useCallback(
    (tempId: string, text: string) => {
      const now = new Date()
      const time = new Intl.DateTimeFormat('ko-KR', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(now)

      setMessages((prev) => [
        ...prev,
        {
          id: tempId, //
          type: 'me',
          senderId: myUserId ?? undefined, //
          text,
          time,
          createdAt: now.toISOString(), //
        },
      ])
    },
    [myUserId],
  )

  useEffect(() => {
    if (!canConnect) return

    const sessionKey = `room:${roomId}|token:${accessToken}` //
    if (sessionKeyRef.current === sessionKey && clientRef.current?.connected) {
      return //   이미 같은 조건으로 연결돼 있으면 재연결 금지
    }

    sessionKeyRef.current = sessionKey //
    setStatus('connecting')

    let cancelled = false

    ;(async () => {
      //   혹시 남아있는 이전 client가 있으면 먼저 확실히 끊고 시작
      if (clientRef.current) {
        await disconnect() //
      }
      if (cancelled) return

      const client = new Client({
        //   Native WebSocket: brokerURL 직접 입력 (SockJS 금지)
        brokerURL: STORIX_STOMP_BROKER_URL, //
        reconnectDelay: 3000, //
        connectHeaders: {
          Authorization: `Bearer ${accessToken}`, //   JWT 헤더 필수
        },
        onConnect: () => {
          if (cancelled) return
          setStatus('open')

          const subId = makeSubscriptionId(roomId)
          subIdRef.current = subId

          //   혹시 reconnect 상황이면 기존 sub 정리 후 재구독
          unsubscribe() //

          subRef.current = client.subscribe(
            topicRoomSubPath(roomId),
            (frame) => {
              const uiMsg = normalizeTopicRoomStompMessage(frame.body, {
                myUserId,
              }) //
              if (!uiMsg) return

              //   내 메시지 echo면 optimistic과 중복 제거
              if (uiMsg.type === 'me') {
                const now = Date.now()
                const idx = pendingSentRef.current.findIndex(
                  (p) => p.text === uiMsg.text && now - p.at < 5000,
                )

                if (idx !== -1) {
                  const matched = pendingSentRef.current[idx]
                  pendingSentRef.current.splice(idx, 1)

                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === matched.tempId
                        ? {
                            ...m,
                            id: uiMsg.id, //   server id로 교체
                            time: uiMsg.time || m.time,
                            createdAt: uiMsg.createdAt ?? m.createdAt,
                            senderId: uiMsg.senderId ?? m.senderId,
                          }
                        : m,
                    ),
                  )
                  return
                }
              }

              setMessages((prev) => [...prev, uiMsg])
            },
            { id: subId }, //   Subscription ID 필수
          )

          console.log('[STOMP] connected', roomId) //   디버그(원하면 나중에 제거)
        },
        onWebSocketClose: () => {
          if (cancelled) return
          setStatus('closed')
        },
        onWebSocketError: () => {
          if (cancelled) return
          setStatus('error')
        },
        onStompError: (_frame: IFrame) => {
          if (cancelled) return
          setStatus('error')
        },
      })

      clientRef.current = client
      client.activate()
    })()

    return () => {
      cancelled = true
      //   언마운트/페이지 이동 시 명시적 UNSUBSCRIBE + deactivate
      void disconnect() //
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canConnect, roomId, accessToken, myUserId]) //   disconnect/unsubscribe는 내부에서만 사용

  const sendMessage = useCallback(
    (text: string) => {
      const t = text.trim()
      if (!t) return false

      const client = clientRef.current
      if (!client || !client.connected) return false

      const tempId = `me_tmp_${Date.now()}_${Math.random().toString(16).slice(2)}` //
      pendingSentRef.current.push({ tempId, text: t, at: Date.now() }) //
      appendOptimisticMe(tempId, t) //

      client.publish({
        destination: topicRoomPubPath(),
        body: JSON.stringify({
          roomId,
          type: 'TALK',
          message: t,
        }),
      })

      return true
    },
    [appendOptimisticMe, roomId],
  )

  return { status, messages, sendMessage, disconnect, unsubscribe }
}
