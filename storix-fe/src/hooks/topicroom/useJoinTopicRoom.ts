// src/hooks/topicroom/useJoinTopicRoom.ts
import { useEffect, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { joinTopicRoom } from '@/lib/api/topicroom'

export const useJoinTopicRoom = () => {
  const qc = useQueryClient()
  const didInvalidateRef = useRef(false)

  const mutation = useMutation({
    mutationFn: (roomId: number) => joinTopicRoom(roomId),
  })

  // ✅ onSuccess 금지(A안) -> useEffect로 invalidate
  useEffect(() => {
    if (!mutation.isSuccess) return
    if (didInvalidateRef.current) return

    didInvalidateRef.current = true
    qc.invalidateQueries({ queryKey: ['topicroom'] }) // ✅
  }, [mutation.isSuccess, qc])

  useEffect(() => {
    if (mutation.isPending) didInvalidateRef.current = false // ✅
  }, [mutation.isPending])

  return mutation
}
