// src/api/feed/readerReply.api.ts
import { apiClient } from '@/api/axios-instance'
import axios from 'axios'

export type ReportReplyArgs = {
  boardId: number
  replyId: number
  reportedUserId?: number //   optional
}

export const reportReply = async ({
  boardId,
  replyId,
  reportedUserId,
}: ReportReplyArgs) => {
  //   숫자 검증 (undefined/string 방지)
  if (!Number.isFinite(boardId) || !Number.isFinite(replyId)) {
    throw new Error('Invalid boardId/replyId')
  }

  const url = `/api/v1/feed/reader/board/${boardId}/reply/${replyId}/report`

  //   서버가 바디를 안 받는 케이스가 많아서: 있을 때만 전송
  const body =
    typeof reportedUserId === 'number' && Number.isFinite(reportedUserId)
      ? { reportedUserId }
      : undefined

  try {
    const res = await apiClient.post(url, body)
    return res.data
  } catch (e) {
    // 여기서는 throw만 하고, UI(토스트/모달)는 훅에서 처리
    throw e
  }
}

//   "이미 신고" 판별용 유틸 (백엔드 메시지/코드가 다를 수 있으니 느슨하게)
export const isAlreadyReportedError = (e: unknown) => {
  if (!axios.isAxiosError(e)) return false
  const data: any = e.response?.data
  const msg = String(data?.message ?? '')
  const code = String(data?.code ?? '')
  return (
    (msg.includes('이미') && msg.includes('신고')) ||
    code.toUpperCase().includes('ALREADY') ||
    code.toUpperCase().includes('DUPLICATE')
  )
}
