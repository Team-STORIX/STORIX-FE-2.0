// src/app/profile/myActivity/page.tsx
import { Suspense } from 'react'
import MyActivityPageClient from './MyActivityClient'

export default function MyActivityPage() {
  return (
    <Suspense>
      <MyActivityPageClient />
    </Suspense>
  )
}
