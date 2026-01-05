// src/features/profile/api/profile.api.ts
// ✅ (선택) 너가 타입을 깔끔하게 쓰고 싶으면, 여기서 ProfileResponse를 export해주면 돼.
// ✅ 그리고 401 해결을 위해 Authorization: Bearer 를 강제해서 붙여줘.

export type ProfileResponse = {
  nickname: string
  bio?: string
  level?: number
  profileImageUrl?: string
  [key: string]: any
}

export async function fetchMyProfile(
  accessToken: string,
): Promise<ProfileResponse> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL
  if (!apiBase) throw new Error('NEXT_PUBLIC_API_URL is not set')

  const token = accessToken.trim()

  const res = await fetch(`${apiBase}/users/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  })

  const text = await res.text()
  if (!res.ok) {
    throw new Error(`프로필 조회 실패: ${res.status} ${text}`)
  }

  return JSON.parse(text) as ProfileResponse
}
