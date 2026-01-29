// src/components/preference/PreferenceCard.tsx
'use client'

import type { PreferenceWork } from './PreferenceProvider'

export default function PreferenceCard({ work }: { work: PreferenceWork }) {
  const hashtags = (work.hashtags ?? [])
    .map((t) => String(t ?? '').trim())
    .filter(Boolean)
    .map((t) => (t.startsWith('#') ? t.slice(1) : t))
  return (
    <div className="w-full rounded-xl overflow-hidden">
      <div
        className="relative w-full h-131"
        style={{
          background:
            `linear-gradient(180deg, rgba(255, 64, 147, 0.00) 0%, rgba(255, 64, 147, 0.60) 100%), ` +
            `linear-gradient(0deg, var(--bottomsheet_background, rgba(0, 0, 0, 0.50)) 0%, var(--bottomsheet_background, rgba(0, 0, 0, 0.50)) 100%), ` +
            `url(${work.imageSrc}) lightgray 50% / cover no-repeat`,
        }}
      >
        <div className="absolute left-4 right-4 bottom-4 text-white">
          {/* genre chip */}
          {!!work.genre && (
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-[var(--color-magenta-300)] text-white body-4">
                {work.genre}
              </span>
            </div>
          )}
          {/* worksName */}
          <div className="text-[28px] leading-[34px] font-semibold tracking-[-0.02em]">
            {work.title}
          </div>
          {/* description (meta fallback 제거) */}
          {!!work.description && (
            <div className="mt-2 body-2 text-white/90 line-clamp-3">
              {work.description}
            </div>
          )}{' '}
          \ {/* hashtags */}
          {hashtags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {hashtags.map((t, i) => (
                <span
                  key={`${work.id}-tag-${i}`}
                  className="inline-flex items-center h-8 px-4 rounded-full bg-white/20 text-white/95 body-2"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}{' '}
        </div>
      </div>
    </div>
  )
}
