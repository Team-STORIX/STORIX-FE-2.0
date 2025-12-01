// src/components/home/hotfeed/HotFeedSlider.tsx
import { MyTypeCard } from '@/components/home/myType/MyTypeCard'

export default function MyTypeSlider() {
  return (
    <section className="">
      <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar -mx-4">
        <MyTypeCard className="flex ml-4 bg-gray-100" />
        <MyTypeCard className="flex bg-gray-100" />
        <MyTypeCard className="flex bg-gray-100" />
        <MyTypeCard className="flex bg-gray-100" />
        <MyTypeCard className="flex bg-gray-100" />
      </div>
    </section>
  )
}
