// ✅ src/app/feed//write/[id]/page.tsx
import WriteClient from '../WriteClient'

type Work = {
  id: number
  title: string
  meta: string
  thumb: string
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
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
  const { id } = await params
  const workId = Number(id)
  const work = works.find((w) => w.id === workId) ?? null

  return <WriteClient work={work} />
}
