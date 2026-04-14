// src/components/preference/NextButton.tsx
'use client'

import { useRouter } from 'next/navigation'

type Props = {
  href: string
  label?: string
  className?: string
}

export default function NextButton({ href, label, className = '' }: Props) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className={[
        'py-3.5 px-38.25 rounded-lg bg-black text-white',
        'flex items-center justify-center cursor-pointer',
        className,
      ].join(' ')}
    >
      <span className="body-1-medium flex flex-shrink-0 ">{label}</span>
    </button>
  )
}
