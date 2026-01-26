// src/hooks/topicroom/useCreateTopicRoom.ts

import { useEffect, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTopicRoom } from '@/lib/api/topicroom/topicroom.api'

type Vars = {
  worksId: number
  topicRoomName: string
}

export function useCreateTopicRoom() {
  const queryClient = useQueryClient()
  const didInvalidateRef = useRef(false)

  const mutation = useMutation({
    mutationFn: (vars: Vars) => createTopicRoom(vars),
  })

  //   onSuccess 금지(A안) -> 후처리는 훅 내부 useEffect로 처리
  useEffect(() => {
    if (!mutation.isSuccess) return
    if (didInvalidateRef.current) return

    didInvalidateRef.current = true
    queryClient.invalidateQueries({ queryKey: ['topicroom'] }) //   토픽룸 관련 캐시 갱신
  }, [mutation.isSuccess, queryClient])

  //   재시도/재호출 시 invalidate 다시 가능하도록 리셋
  useEffect(() => {
    if (mutation.isPending) {
      didInvalidateRef.current = false
    }
  }, [mutation.isPending])

  return mutation
}
