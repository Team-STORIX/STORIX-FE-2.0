// src/components/preference/NextButton.tsx
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

type Props = {
  href: string
  label?: string
  className?: string
}

export default function NextButton({
  href,
  label = '다음으로',
  className = '',
}: Props) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.push(href)}
      className={[
        'w-full h-[56px] rounded-full bg-black text-white',
        'flex items-center justify-center gap-2',
        className,
      ].join(' ')}
    >
      <span className="body-2 font-semibold">{label}</span>
      <Image src="/onboarding/next.svg" alt="next" width={20} height={20} />
    </button>
  )
}
