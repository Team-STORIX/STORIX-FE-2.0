// src/app/writers/login/pending/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Final from '../components/final'

export default function PendingPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'pending' | 'success'>('pending')

  useEffect(() => {
    // ✅ (더미) 로그인 체크: 세션스토리지 값을 보고 성공/실패 분기
    const id = sessionStorage.getItem('writer_login_id') || ''
    const pw = sessionStorage.getItem('writer_login_pw') || ''

    const timer = setTimeout(() => {
      // TODO: 여기를 API 호출 결과로 교체
      const ok = id.length > 0 && pw.length > 0 && pw !== 'wrong'

      if (ok) {
        setStatus('success')
      } else {
        // 실패면 로그인 페이지로 돌아가면서 error=1
        router.replace('/writers/login?error=1')
      }
    }, 700)

    return () => clearTimeout(timer)
  }, [router])

  if (status === 'success') return <Final />

  // pending 화면(원하면 스피너/로딩 이미지로 교체)
  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center">
      <p className="body-1 text-[var(--color-gray-500)]">로그인 확인 중...</p>
    </div>
  )
}
