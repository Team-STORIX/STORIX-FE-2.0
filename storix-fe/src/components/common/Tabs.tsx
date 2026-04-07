'use client'

type Props<T extends string> = {
  tabs: [T, T]
  labels: [string, string]
  active: T
  onChange: (tab: T) => void
}

export default function Tabs<T extends string>({
  tabs,
  labels,
  active,
  onChange,
}: Props<T>) {
  const activeIndex = active === tabs[0] ? 0 : 1

  return (
    <div className="px-4">
      <div className="flex border-b border-gray-200 -mx-4">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            type="button"
            onClick={() => onChange(tab)}
            className={[
              'flex-1 py-3 text-center body-1 cursor-pointer',
              active === tab ? 'text-black' : 'text-gray-400',
            ].join(' ')}
          >
            {labels[i]}
          </button>
        ))}
      </div>

      <div className="relative -mx-4 px-4">
        <div
          className={[
            'absolute -top-[1px] h-[2px] w-1/2 bg-black transition-transform duration-200 -mx-4 px-4',
            activeIndex === 0 ? 'translate-x-0' : 'translate-x-full',
          ].join(' ')}
        />
      </div>
    </div>
  )
}
