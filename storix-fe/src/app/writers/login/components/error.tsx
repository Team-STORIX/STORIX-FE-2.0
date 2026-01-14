// src/app/writers/login/components/error.tsx
'use client'

import Image from 'next/image'

type Props = {
  open: boolean
  onClose: () => void
}

export default function ErrorModal({ open, onClose }: Props) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(16, 15, 15, 0.70)' }}
      role="dialog"
      aria-modal="true"
    >
      {/* 배경 클릭 닫기 */}
      <button
        type="button"
        className="absolute inset-0 cursor-pointer"
        aria-label="닫기"
        onClick={onClose}
      />

      {/* 팝업 (306*240) */}
      <div className="relative w-[306px] h-[240px]">
        <Image
          src="/login/login-warning.svg"
          alt="로그인 실패"
          fill
          className="object-contain"
          priority
        />

        {/* 우측 상단 X (16,16 위치 / 24*24) */}
        <button
          type="button"
          className="absolute top-[16px] right-[16px] w-6 h-6 cursor-pointer hover:opacity-70 transition-opacity"
          aria-label="닫기"
          onClick={onClose}
        />
      </div>
    </div>
  )
}
