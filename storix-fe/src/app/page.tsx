import Link from 'next/link'

export default function Start() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-6 px-6">
      <Link
        href="/home"
        className="flex w-full items-center justify-center rounded-2xl bg-[var(--color-primary-main)] px-6 py-4 text-white transition hover:bg-[var(--color-primary-dark)]"
      >
        <span className="heading-2 text-white">Enter App</span>
      </Link>
    </div>
  )
}
