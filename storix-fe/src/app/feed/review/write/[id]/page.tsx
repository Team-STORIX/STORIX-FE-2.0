// ✅ src/app/feed/review/write/page.tsx
import ReviewWriteClient from '../ReviewWriteClient'

type Work = {
  id: number
  title: string
  meta: string
  thumb: string
}

export default function Page({ params }: { params: { id: string } }) {
  const works: Work[] = [
    {
      id: 1,
      title: '상수리 나무 아래',
      meta: '서하/나무 • 웹툰',
      thumb: '/image/sample/topicroom-1.webp',
    },
    {
      id: 2,
      title: '상수리 나무 아래',
      meta: '서하/나무 • 웹툰',
      thumb: '/image/sample/topicroom-2.webp',
    },
    {
      id: 3,
      title: '상수리 나무 아래',
      meta: '서하/나무 • 웹툰',
      thumb: '/image/sample/topicroom-3.webp',
    },
    {
      id: 4,
      title: '상수리 나무 아래',
      meta: '서하/나무 • 웹툰',
      thumb: '/image/sample/topicroom-4.webp',
    },
  ]
  const workId = Number(params.id)
  const work = works.find((w) => w.id === workId) ?? null

  return <ReviewWriteClient work={work} />
}
