// src/api/auth/withdraw.api.ts
import { apiClient } from '../axios-instance'
import { WithdrawResponseSchema, type WithdrawResponse } from './auth.schema'

// 회원 탈퇴
export const withdrawUser = async (): Promise<WithdrawResponse> => {
  const response = await apiClient.delete('/api/v1/auth/user/withdraw')

  // ✅ 응답 shape이 swagger랑 미세하게 달라도(예: result가 null 등) 탈퇴 흐름은 성공 처리
  const parsed = WithdrawResponseSchema.safeParse(response.data)
  if (parsed.success) return parsed.data

  // parse 실패해도 2xx면 탈퇴는 된 거라 보고 raw로 반환 (혹은 최소 형태로 반환)
  return response.data as WithdrawResponse
}
