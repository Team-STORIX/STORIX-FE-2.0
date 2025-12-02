// src/components/home/notify/TopNotifyNavigation.tsx
'use client'

import Link from 'next/link'

export default function TopNotifyNavigation() {
  return (
    <div className="flex h-17 w-full justify-center items-center px-4 py-2.5 bg-white">
      {/* 상단 행: 화살표 / 텍스트 / 돋보기 */}
      <Link
        href={'/home'}
        aria-label="홈으로 이동"
        className="flex h-6 w-6 items-center justify-center"
      >
        <BackIcon />
      </Link>
      <div className="flex w-full h-full justify-center items-center -translate-x-1.5">
        <p className="body-1 font-gray-900">알림</p>
      </div>
    </div>
  )
}
/* ===== 아이콘들 ===== */

function BackIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M3.54922 11.9996L10.8992 19.3496C11.1492 19.5996 11.2701 19.8913 11.2617 20.2246C11.2534 20.558 11.1242 20.8496 10.8742 21.0996C10.6242 21.3496 10.3326 21.4746 9.99922 21.4746C9.66589 21.4746 9.37422 21.3496 9.12422 21.0996L1.42422 13.4246C1.22422 13.2246 1.07422 12.9996 0.974219 12.7496C0.874219 12.4996 0.824219 12.2496 0.824219 11.9996C0.824219 11.7496 0.874219 11.4996 0.974219 11.2496C1.07422 10.9996 1.22422 10.7746 1.42422 10.5746L9.12422 2.87462C9.37422 2.62462 9.67005 2.50379 10.0117 2.51212C10.3534 2.52046 10.6492 2.64962 10.8992 2.89962C11.1492 3.14962 11.2742 3.44129 11.2742 3.77462C11.2742 4.10796 11.1492 4.39962 10.8992 4.64962L3.54922 11.9996Z"
        fill="#100F0F"
      />
    </svg>
  )
}
