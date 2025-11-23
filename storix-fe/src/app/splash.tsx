// src\components\Splash.tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function Splash({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 1500)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <main
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#E9E9E9',
      }}
    >
      <div
        style={{
          width: 393,
          height: 892,
          backgroundColor: '#000000',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Image
          src="/icons/logo-white.svg"
          alt="STORIX Logo"
          width={100}
          height={100}
          priority
        />
      </div>
    </main>
  )
}
