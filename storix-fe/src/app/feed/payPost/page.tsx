// src/app/feed/payPost/page.tsx
import { Suspense } from 'react'

import FeedPayPostClient from './FeedPayPostClient'

export default function FeedPayPostPage() {
  return (
    <Suspense fallback={null}>
      <FeedPayPostClient />
    </Suspense>
  )
}
