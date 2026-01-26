// src/lib/ga.ts
export const GA_ID = process.env.NEXT_PUBLIC_GA_ID

declare global {
  interface Window {
    gtag?: (...args: any[]) => void
  }
}

export const pageview = (url: string) => {
  if (!GA_ID) return
  window.gtag?.('config', GA_ID, { page_path: url })
}

export const event = (name: string, params: Record<string, unknown> = {}) => {
  if (!GA_ID) return
  window.gtag?.('event', name, params)
}
