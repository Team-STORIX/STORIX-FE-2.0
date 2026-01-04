// src/app/profile/myActivity/components/selectBar.tsx
interface SelectBarProps {
  activeTab: 'posts' | 'comments' | 'likes'
  onChange: (tab: 'posts' | 'comments' | 'likes') => void
}

export default function SelectBar({ activeTab, onChange }: SelectBarProps) {
  const tabs = [
    { id: 'posts' as const, label: '게시글' },
    { id: 'comments' as const, label: '댓글' },
    { id: 'likes' as const, label: '좋아요' },
  ]

  return (
    <div className="p-4">
      <div className="flex items-center gap-[10px] h-9">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="px-4 py-2 rounded-[50px] text-[14px] font-medium leading-[140%]"
            style={
              activeTab === tab.id
                ? {
                    backgroundColor: 'var(--color-gray-900)',
                    color: 'var(--color-white)',
                  }
                : {
                    backgroundColor: 'var(--color-white)',
                    color: 'var(--color-gray-400)',
                    border: '1px solid var(--color-gray-400)',
                  }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
