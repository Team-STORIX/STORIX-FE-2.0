// src/app/home/notify/page.tsx

import TopNotifyNavigation from '@/components/home/notify/TopNotifyNavigation'
import NotifyList from '@/components/home/notify/NotifyList'

const NOTIFY_ITEMS = [
  {
    title: '',
    description: '',
    date: '',
    thumbnailSrc: '',
  },
]

export default function notify() {
  return (
    <div>
      <TopNotifyNavigation />
      <NotifyList items={NOTIFY_ITEMS} />
    </div>
  )
}
