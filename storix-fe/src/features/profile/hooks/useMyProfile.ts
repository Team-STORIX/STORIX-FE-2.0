// src/features/profile/hooks/useMyProfile.ts
'use client'

import { useEffect, useState } from 'react'
import { fetchMyProfile } from '@/features/profile/api/profile.api'

// ✅ ProfileResponse가 profile.api.ts에서 export되고 있지 않아서 에러가 난 거야.
//    가장 빠른 해결: 여기서는 타입 import를 빼고, 응답 타입을 훅 안에서 정의하거나 any로 받기.
//    (나중에 백엔드 응답 스펙 확정되면 profile.api.ts에서 타입 export로 정리하면 됨)

type MyProfile = {
  nickname?: string
  bio?: string
  level?: number
  profileImageUrl?: string
  // 필요하면 더 추가
  [key: string]: any
}

export function useMyProfile() {
  const [data, setData] = useState<MyProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true)
        setErrorMsg(null)

        const accessToken =
          typeof window !== 'undefined'
            ? sessionStorage.getItem('accessToken')
            : null

        if (!accessToken) {
          throw new Error('accessToken이 없습니다. 로그인 상태를 확인해주세요.')
        }

        const res = await fetchMyProfile(accessToken)
        setData(res as MyProfile)
      } catch (e) {
        setErrorMsg(e instanceof Error ? e.message : '알 수 없는 오류')
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  return { data, loading, errorMsg }
}
