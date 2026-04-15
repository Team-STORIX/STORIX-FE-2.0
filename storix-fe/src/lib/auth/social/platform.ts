// src/lib/auth/social/platform.ts
//
// 현재 실행 중인 플랫폼이 네이티브(iOS/Android)인지 판별.
// - Capacitor.isNativePlatform() 이 있으면 그걸 우선 사용 (SSR-safe)
// - 없으면 web 으로 간주 (브라우저 / Next.js 서버)

import { Capacitor } from '@capacitor/core'

export const isNativePlatform = (): boolean => {
  try {
    return Capacitor.isNativePlatform()
  } catch {
    return false
  }
}

export const getPlatform = (): 'ios' | 'android' | 'web' => {
  try {
    const p = Capacitor.getPlatform()
    if (p === 'ios' || p === 'android') return p
    return 'web'
  } catch {
    return 'web'
  }
}
