// src/app/profile/likes/components/selectBar.tsx
'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

type Tab = 'works' | 'writers'

export default function SelectBar() {
  const sp = useSearchParams()
  const tab = (sp.get('tab') as Tab) ?? 'works'

  const isWorks = tab === 'works'
  const isWriters = tab === 'writers'

  const baseText = 'body-1'
  const activeText = 'text-[var(--color-gray-900)]'
  const inactiveText = 'text-[var(--color-gray-400)]'
  const activeBar = 'bg-[var(--color-gray-900)]'
  const inactiveBar = 'bg-[var(--color-gray-400)]'

  return (
    <div className="flex py-2">
      {/*   왼쪽: 관심 작가 */}
      <Link
        href="/profile/likes?tab=writers"
        className="flex-1 flex flex-col items-center gap-4"
      >
        <span
          className={`${baseText} ${isWriters ? activeText : inactiveText}`}
        >
          관심 작가
        </span>
        <div
          className={`w-full h-[2px] ${isWriters ? activeBar : inactiveBar}`}
        />
      </Link>

      {/*   오른쪽: 관심 작품 */}
      <Link
        href="/profile/likes?tab=works"
        className="flex-1 flex flex-col items-center gap-4"
      >
        <span className={`${baseText} ${isWorks ? activeText : inactiveText}`}>
          관심 작품
        </span>
        <div
          className={`w-full h-[2px] ${isWorks ? activeBar : inactiveBar}`}
        />
      </Link>
    </div>
  )
}
