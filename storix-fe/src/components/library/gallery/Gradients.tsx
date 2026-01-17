//src/components/library/gallery/Gradients.tsx
'use client'

export function LeftGradient() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="200"
      viewBox="0 0 22 200"
      fill="none"
    >
      <path
        d="M0 200L2.78004e-05 0L22 28.3019L22 171.698L0 200Z"
        fill="url(#paint0_linear_3816_28106)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_3816_28106"
          x1="1.39002e-05"
          y1="100"
          x2="22"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.254801" stop-color="#FDBCD9" />
          <stop offset="0.875009" stop-color="#FDBCD9" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function RightGradient() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="200"
      viewBox="0 0 22 200"
      fill="none"
      className="h-full w-[22px]"
    >
      <path
        d="M22 200L22 0L6.65116e-06 28.3019L2.65836e-05 171.698L22 200Z"
        fill="url(#paint0_linear_3811_13423)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_3811_13423"
          x1="22"
          y1="100"
          x2="1.471e-05"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.254801" stopColor="#FDBCD9" />
          <stop offset="0.875009" stopColor="#FDBCD9" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}
