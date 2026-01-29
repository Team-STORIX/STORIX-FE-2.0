// src/components/preference/PreferenceCard.tsx
'use client'

import Image from 'next/image'
import type { PreferenceWork } from './PreferenceProvider'

export default function PreferenceCard({ work }: { work: PreferenceWork }) {
  return (
    <div className="w-full rounded-2xl overflow-hidden bg-black/5">
      <div className="relative w-full aspect-[3/4]">
        <Image
          src={work.imageSrc}
          alt={work.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute left-4 right-4 bottom-4">
          <div className="text-white">
            <div className="text-xl font-semibold">{work.title}</div>
            <div className="mt-2 text-sm text-white/80 line-clamp-2">
              {work.meta}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
