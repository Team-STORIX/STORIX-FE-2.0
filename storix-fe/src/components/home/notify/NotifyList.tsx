// src/components/home/notify/NotifyList.tsx
'use client'

import NotifyCard, { NotifyCardProps } from './NotifyCard'

interface NotifyListProps {
  items: NotifyCardProps[]
}

export default function NotifyList({ items }: NotifyListProps) {
  return (
    <section className="w-full">
      <div className="flex flex-col">
        {items.map((item, index) => (
          <NotifyCard key={index} {...item} />
        ))}
      </div>
    </section>
  )
}
