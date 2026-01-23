// src/app/feed/components/topbar.tsx
'use client'

interface TopbarProps {
  activeTab: 'works' | 'writers'
  onChange: (tab: 'works' | 'writers') => void
}

export default function Topbar({ activeTab, onChange }: TopbarProps) {
  return (
    <div className="flex items-start gap-5 px-5 py-4">
      {/* 관심 작품 */}
      <button
        onClick={() => onChange('works')}
        className="text-[24px] font-bold leading-[140%] transition-opacity hover:opacity-70"
        style={{
          color:
            activeTab === 'works'
              ? 'var(--color-gray-900)'
              : 'var(--color-gray-200)',
          fontFamily: 'SUIT',
        }}
      >
        관심 작품
      </button>

      {/* 관심 작가 */}
      <button
        onClick={() => onChange('writers')}
        className="text-[24px] font-bold leading-[140%] transition-opacity hover:opacity-70"
        style={{
          color:
            activeTab === 'writers'
              ? 'var(--color-gray-900)'
              : 'var(--color-gray-200)',
          fontFamily: 'SUIT',
        }}
      >
        관심 작가
      </button>
    </div>
  )
}
