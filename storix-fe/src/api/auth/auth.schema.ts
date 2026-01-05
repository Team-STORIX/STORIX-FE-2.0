// src/api/auth/auth.schema.ts
import { z } from 'zod'

// ✅ (추가) 백엔드 ENUM 값(전송용) - 단일 소스
export const GenreKeySchema = z.enum([
  'ROMANCE',
  'FANTASY',
  'ROFAN',
  'HISTORICAL',
  'DRAMA',
  'THRILLER',
  'ACTION',
  'BL',
  'MODERN_FANTASY',
  'DAILY',
])
export type GenreKey = z.infer<typeof GenreKeySchema>

// 기본 응답 래퍼
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    isSuccess: z.boolean(),
    code: z.string(),
    message: z.string(),
    result: dataSchema,
    timestamp: z.string(),
  })

// 로그인 성공 응답
export const ReaderLoginResponseSchema = z.object({
  accessToken: z.string(),
  // refreshToken은 쿠키로 오므로 body에서 제거
})

// 회원가입 필요 응답 (온보딩)
export const ReaderPreLoginResponseSchema = z.object({
  onboardingToken: z.string(),
})

// 카카오 로그인 결과
export const KakaoLoginResultSchema = z.object({
  isRegistered: z.boolean(),
  readerLoginResponse: ReaderLoginResponseSchema.nullable(),
  readerPreLoginResponse: ReaderPreLoginResponseSchema.nullable(),
})

// 최종 응답
export const KakaoLoginResponseSchema = ApiResponseSchema(
  KakaoLoginResultSchema,
)

// 회원가입 Request
export const SignupRequestSchema = z.object({
  marketingAgree: z.boolean(),
  nickName: z.string().min(1),
  gender: z.enum(['MALE', 'FEMALE']),
  // ✅ (개선) 아무 문자열이 아니라, 백엔드 ENUM만 허용
  favoriteGenreList: z.array(GenreKeySchema),
  favoriteWorksIdList: z.array(z.number()),
})

// 회원가입 Response
export const SignupResponseSchema = ApiResponseSchema(
  z.object({
    accessToken: z.string(),
  }),
)

// 타입 추출
export type ReaderLoginResponse = z.infer<typeof ReaderLoginResponseSchema>
export type ReaderPreLoginResponse = z.infer<
  typeof ReaderPreLoginResponseSchema
>
export type KakaoLoginResult = z.infer<typeof KakaoLoginResultSchema>
export type KakaoLoginResponse = z.infer<typeof KakaoLoginResponseSchema>
export type SignupRequest = z.infer<typeof SignupRequestSchema>
export type SignupResponse = z.infer<typeof SignupResponseSchema>
