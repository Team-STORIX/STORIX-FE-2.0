// src/components/feed/ImagePicker.tsx
'use client'

import Image from 'next/image'
import { useMemo, useRef } from 'react'

export default function ImagePicker({
  files,
  onChange,
  max = 3,
}: {
  files: File[]
  onChange: (next: File[]) => void
  max?: number
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  const previews = useMemo(() => {
    return files.map((f) => ({ file: f, url: URL.createObjectURL(f) }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files])

  const open = () => inputRef.current?.click()

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || [])
    if (picked.length === 0) return
    const next = [...files, ...picked].slice(0, max)
    onChange(next)
    e.target.value = '' // 같은 파일 다시 선택 가능
  }

  const removeAt = (idx: number) => {
    onChange(files.filter((_, i) => i !== idx))
  }

  return (
    <div className="mt-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={onPick}
      />

      <button
        type="button"
        onClick={open}
        className="inline-flex items-center gap-2 cursor-pointer"
      >
        <Image
          src="/feed/icon-photo.svg"
          alt="이미지 추가"
          className=" cursor-pointer"
          width={24}
          height={24}
        />
        <span className="caption-1 text-gray-400">
          {files.length}/{max}
        </span>
      </button>

      {files.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto no-scrollbar">
          {previews.map((p, idx) => (
            <div
              key={p.url}
              className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt="preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-1 text-[10px] text-white cursor-pointer"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
