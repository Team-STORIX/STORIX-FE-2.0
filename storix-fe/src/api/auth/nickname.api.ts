// src/api/auth/nickname.api.ts
import { apiClient } from '../axios-instance'
import {
  NicknameValidResponseSchema,
  type NicknameValidResponse,
  NicknameForbiddenResponseSchema,
  type NicknameForbiddenResponse,
} from './auth.schema'

// 닉네임 중복 체크 (버튼 클릭시에만 호출)
export const checkNicknameValid = async (
  nickName: string,
): Promise<NicknameValidResponse> => {
  const response = await apiClient.get('/api/v1/auth/nickname/valid', {
    params: { nickName },
  })
  return NicknameValidResponseSchema.parse(response.data)
}

// 금칙어 체크 (debounce로 호출)
// ⚠️ 백엔드 엔드포인트가 확정되면 path만 교체하면 됨
export const checkNicknameForbidden = async (
  nickName: string,
): Promise<NicknameForbiddenResponse> => {
  const response = await apiClient.get('/api/v1/auth/nickname/forbidden', {
    params: { nickName },
  })
  return NicknameForbiddenResponseSchema.parse(response.data)
}

// ✅ result 응답 형태가 애매할 때 "사용 가능 여부"를 최대한 안정적으로 뽑아내는 헬퍼
export const extractIsAvailableFromValidResponse = (
  data: NicknameValidResponse,
): boolean => {
  const r: any = data?.result ?? {}

  // 가장 우선: 명시적 available
  if (typeof r.isAvailable === 'boolean') return r.isAvailable
  if (typeof r.available === 'boolean') return r.available
  if (typeof r.canUse === 'boolean') return r.canUse

  // duplicate 기반
  if (typeof r.isDuplicate === 'boolean') return !r.isDuplicate
  if (typeof r.isDuplicated === 'boolean') return !r.isDuplicated
  if (typeof r.duplicated === 'boolean') return !r.duplicated
  if (typeof r.exists === 'boolean') return !r.exists

  // fallback: message에 “가능” 포함 시 true 추정
  const msg = String(data?.message ?? '')
  if (msg.includes('가능')) return true

  return false
}

export const extractIsForbiddenFromForbiddenResponse = (
  data: NicknameForbiddenResponse,
): { forbidden: boolean; message?: string } => {
  const r: any = data?.result ?? {}

  const forbidden =
    r === true ||
    r?.forbidden === true ||
    r?.isForbidden === true ||
    r?.blocked === true

  const message = r?.message || data?.message
  return { forbidden, message }
}
