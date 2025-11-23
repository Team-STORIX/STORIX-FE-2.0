// src\app\login\page.tsx
'use client'

import { useState } from 'react'
import Splash from '@/app/splash'

export default function LoginPage() {
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />
  }

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
          backgroundColor: '#FFFFFF',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1 className="heading-1 text-primary-main">로그인 페이지</h1>
      </div>
    </main>
  )
}
