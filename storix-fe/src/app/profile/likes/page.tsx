// src/app/profile/likes/page.tsx
import { Suspense } from 'react'

import LikesClient from './LikesClient'

export default function LikesPage() {
  return (
    <Suspense fallback={null}>
      <LikesClient />
    </Suspense>
  )
}
