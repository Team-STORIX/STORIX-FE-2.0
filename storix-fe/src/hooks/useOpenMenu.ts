// src/hooks/useOpenMenu.ts
'use client'

import { useEffect, useRef, useState } from 'react'

export function useOpenMenu<T extends number | string>() {
  const [openId, setOpenId] = useState<T | null>(null)
  const refs = useRef<Record<string, HTMLDivElement | null>>({})

  const bindRef = (id: T) => (el: HTMLDivElement | null) => {
    refs.current[String(id)] = el
  }

  const toggle = (id: T) => setOpenId((prev) => (prev === id ? null : id))
  const close = () => setOpenId(null)

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (openId == null) return
      const current = refs.current[String(openId)]
      if (!current) return
      if (!current.contains(e.target as Node)) setOpenId(null)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [openId])

  return { openId, bindRef, toggle, close }
}
