// app/splash.tsx
'use client'

import { useEffect, useState } from 'react'

export function Splash() {
  return (
    <div
      className="flex w-full h-full justify-center items-center"
      style={{ backgroundColor: 'var(--color-black)' }}
    >
      <div className="flex flex-col items-center">
        <img
          src="/icons/logo-white.svg"
          alt="STORIX Logo"
          width={100}
          height={100}
        />
      </div>
    </div>
  )
}

export default function SplashWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return <Splash />
  }

  return <>{children}</>
}
