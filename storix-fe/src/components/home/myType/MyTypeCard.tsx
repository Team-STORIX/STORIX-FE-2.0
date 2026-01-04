// src/components/home/myType/MyTypeCard.tsx
import Image from 'next/image'

export default function MyTypeCard() {
  return (
    <div
      className={`relative flex w-[353px] h-[173px] rounded-2xl shadow-sm flex-shrink-0 bg-gray-100`}
    >
      <Image
        src={'/sample/card_serach_insidecover.webp'}
        alt={'으아아앙'}
        fill
        className="object-cover"
      />
    </div>
  )
}
