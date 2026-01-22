// src/app/home/topicroom/[id]/page.tsx
import { Suspense } from 'react'

import TopicRoomClient from './TopicRoomClient'

export default function TopicRoomPage() {
  return (
    <Suspense fallback={null}>
      <TopicRoomClient />
    </Suspense>
  )
}
