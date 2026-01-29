// src/app/feed/review/write/[id]/page.tsx
import ReviewWriteClient from '../ReviewWriteClient'

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params
  const worksId = Number.parseInt(id, 10)

  return <ReviewWriteClient worksId={worksId} />
}
