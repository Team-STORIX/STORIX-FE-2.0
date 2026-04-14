'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function WorksRedirect() {
  const router = useRouter()
  const sp = useSearchParams()

  useEffect(() => {
    const keyword = sp.get('keyword') ?? ''
    router.replace(`/home/search/result?keyword=${encodeURIComponent(keyword)}`)
  }, [router, sp])

  return null
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <WorksRedirect />
    </Suspense>
  )
}
