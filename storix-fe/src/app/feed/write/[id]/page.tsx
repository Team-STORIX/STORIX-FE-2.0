//   src/app/feed/write/[id]/page.tsx

import { redirect } from 'next/navigation'

export default function Page() {
  //   기존 /feed/write/:id 라우트는 신규 /feed/write 플로우로 통합
  redirect('/feed/write')
}
