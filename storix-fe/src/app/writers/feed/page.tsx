// src/app/writers/feed/page.tsx
import { Suspense } from 'react'

import WritersFeedClient from './WritersFeedClient'

export default function WritersFeedPage() {
  return (
    <Suspense fallback={null}>
      <WritersFeedClient />
    </Suspense>
  )
}
