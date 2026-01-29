import type { ReactNode } from 'react'
import PreferenceProvider from '@/components/preference/PreferenceProvider'

export default function Layout({ children }: { children: ReactNode }) {
  return <PreferenceProvider>{children}</PreferenceProvider>
}
