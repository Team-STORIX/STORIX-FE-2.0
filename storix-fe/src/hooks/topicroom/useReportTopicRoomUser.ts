// src/hooks/topicroom/useReportTopicRoomUser.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reportTopicRoomUser } from '@/lib/api/topicroom'

type Vars = {
  roomId: number
  reportedUserId: number
  reason: string
  otherReason?: string | null
}

export const useReportTopicRoomUser = () => {
  const qc = useQueryClient()

  return useMutation({
    mutationKey: ['topicroom', 'report'], // ✅
    mutationFn: (vars: Vars) =>
      reportTopicRoomUser(vars.roomId, {
        reportedUserId: vars.reportedUserId,
        reason: vars.reason,
        otherReason: vars.otherReason ?? null,
      }),
    onSettled: async (_data, _error, vars) => {
      // ✅ 성공 시 invalidateQueries로 갱신(규칙 준수)
      await qc.invalidateQueries({
        queryKey: ['topicroom', 'members', vars.roomId],
      }) // ✅
    },
  })
}
