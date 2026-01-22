// src/api/auth/nickname.api.ts
import { apiClient } from '@/api/axios-instance'
import { z } from 'zod'

/**
 * ✅ /api/v1/auth/nickname/valid 응답 스키마
 * - 백엔드가 result를 안 내려줄 수도 있어서 optional 처리
 */
export const NicknameValidResponseSchema = z.object({
  isSuccess: z.boolean(),
  code: z.string(),
  message: z.string(),
  result: z.unknown().optional(),
  timestamp: z.string(),
})

export type NicknameValidResponse = z.infer<typeof NicknameValidResponseSchema>

/**
 * ✅ 닉네임 중복 체크 (버튼 클릭시에만 호출)
 * - 명세: GET /api/v1/auth/nickname/valid?nickname=...
 * - 4xx도 "정상 응답처럼" 받아서 UI에서 분기 처리
 */
export const checkNicknameValid = async (
  nickname: string,
): Promise<NicknameValidResponse> => {
  const response = await apiClient.get('/api/v1/auth/nickname/valid', {
    params: { nickname },
    validateStatus: (status) => status >= 200 && status < 500,
  })

  return NicknameValidResponseSchema.parse(response.data)
}

/**
 * ✅ “사용 가능” 판정: 온보딩(기존) + 프로필(신규) 코드 모두 허용
 */
export const extractIsAvailableFromValidResponse = (
  data: NicknameValidResponse,
): boolean => {
  if (data.isSuccess !== true) return false
  return (
    data.code === 'NICKNAME_SUCCESS_001' || // 기존(온보딩)
    data.code === 'PROFILE_SUCCESS_002' // 신규(프로필)
  )
}

/**
 * ✅ “이미 사용 중(중복)” 판정: 기존/신규 코드 모두 허용
 */
export const extractIsDuplicatedFromValidResponse = (
  data: NicknameValidResponse,
): boolean => {
  return (
    data.isSuccess === false &&
    (data.code === 'NICKNAME_ERROR_001' || // 기존
      data.code === 'NICKNAME_ERROR_002') // 신규
  )
}

/**
 * ✅ “사용 불가(작가 닉네임과 동일)” 판정
 */
export const extractIsForbiddenFromValidResponse = (
  data: NicknameValidResponse,
): boolean => {
  return data.isSuccess === false && data.code === 'NICKNAME_ERROR_003'
}
