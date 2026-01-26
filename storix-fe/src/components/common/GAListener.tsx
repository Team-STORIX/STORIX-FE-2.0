// src/components/common/GAListener.tsx
'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { pageview } from '@/lib/ga'

export default function GAListener() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const qs = searchParams?.toString()
    const url = qs ? `${pathname}?${qs}` : pathname
    pageview(url)
  }, [pathname, searchParams])

  return null
}
