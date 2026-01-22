// src/components/common/ProfileBootstrap.tsx

'use client'

import { useEffect } from 'react'
import { useProfileStore } from '@/store/profile.store'
import { useAuthStore } from '@/store/auth.store'
import { getMyProfile } from '@/api/profile/profile.api'

export default function ProfileBootstrap() {
  const me = useProfileStore((s) => s.me)
  const setMe = useProfileStore((s) => s.setMe)

  const accessToken = useAuthStore((s) => s.accessToken)

  useEffect(() => {
    const run = async () => {
      // 이미 있으면 스킵
      if (me) return

      // accessToken이 없으면(로그아웃 상태거나 초기화됨) 스킵
      if (!accessToken) return

      try {
        const res = await getMyProfile()
        if (res?.isSuccess) setMe(res.result)
      } catch (e) {
        console.error('[ProfileBootstrap] getMyProfile failed:', e)
      }
    }

    run()
  }, [me, accessToken, setMe])

  return null
}
