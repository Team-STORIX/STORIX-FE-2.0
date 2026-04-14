// src/app/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'

export default function Home() {
  const router = useRouter()
  const setAccessToken = useAuthStore((s) => s.setAccessToken)

  useEffect(() => {
    let mounted = true

    const run = async () => {
      try {
        const baseURL = process.env.NEXT_PUBLIC_API_URL
        if (!baseURL) {
          router.replace('/login')
          return
        }

        // refresh 쿠키가 있으면 새 accessToken 받음, 없으면 4xx → /login
        const res = await axios.post(
          `${baseURL}/api/v1/auth/tokens/refresh`,
          {},
          {
            withCredentials: true,
            validateStatus: (status) => status >= 200 && status < 500,
            headers: { 'Content-Type': 'application/json' },
          },
        )

        const newAccessToken = (res.data as any)?.result?.accessToken

        if (res.status >= 200 && res.status < 300 && newAccessToken) {
          if (!mounted) return
          setAccessToken(String(newAccessToken))
          router.replace('/home')
          return
        }

        router.replace('/login')
      } catch {
        router.replace('/login')
      }
    }

    run()

    return () => {
      mounted = false
    }
  }, [router, setAccessToken])

  return (
    <div className="w-full h-full flex items-center justify-center">
      <p
        className="text-[16px] font-medium"
        style={{ color: 'var(--color-gray-700)' }}
      >
        로딩 중...
      </p>
    </div>
  )
}
