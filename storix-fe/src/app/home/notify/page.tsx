// src/app/home/notify/page.tsx

import TopNotifyNavigation from '@/components/home/notify/TopNotifyNavigation'
import NotifyList from '@/components/home/notify/NotifyList'
import type { NotifyCardProps } from '@/components/home/notify/NotifyCard'
import Warning from '@/components/common/Warining'

const NOTIFY_ITEMS: NotifyCardProps[] = []

export default function notify() {
  const isEmpty = NOTIFY_ITEMS.length === 0

  return (
    <div>
      <TopNotifyNavigation />
      {isEmpty ? (
        <Warning
          title="알림이 없어요"
          description="좋아요, 댓글, 팔로우 요청, 친구 새소식 등"
        />
      ) : (
        <NotifyList items={NOTIFY_ITEMS} />
      )}
    </div>
  )
}
