'use client'

import React, { forwardRef } from 'react'
import { LeftGradient, RightGradient } from './Gradients'

type Props = {
  title: string
  onClick: () => void
  edge?: 'left' | 'right' // ✅ 표지쪽에 붙는 그라디언트 방향
  height?: number
  style?: React.CSSProperties
  className?: string
}

const SpineButton = forwardRef<HTMLButtonElement, Props>(
  ({ title, onClick, edge = 'left', height = 260, className = '' }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        aria-label={title}
        className={[
          'relative w-[52px] rounded-md bg-[var(--color-magenta-300)]',
          'shadow-[0px_12px_26px_rgba(255,64,147,0.18)]',
          'hover:opacity-90',
          className,
        ].join(' ')}
        style={{ height }}
      >
        {/* ✅ 옆면 그라디언트: div 하나 + SVG 하나 */}
        <div
          className={[
            'absolute top-0 h-full w-[22px] pointer-events-none',
            edge === 'left' ? 'left-0' : 'right-0',
          ].join(' ')}
        >
          {edge === 'left' ? <LeftGradient /> : <RightGradient />}
        </div>

        {/* ✅ 세로 제목 */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="body-2 text-white whitespace-nowrap -rotate-90">
            {title}
          </span>
        </div>
      </button>
    )
  },
)

SpineButton.displayName = 'SpineButton'
export default SpineButton
