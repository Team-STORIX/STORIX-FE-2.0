// src/app/feed/page.tsx
'use client'

import { useState } from 'react'
import TopBar from './components/topbar'
import NavigationBar from '../profile/components/navigationbar'

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<'works' | 'writers'>('works')

  return (
    <div className="relative min-h-screen pb-[169px]">
      {/* 상단 54px 공백 */}
      <div className="h-[54px]" />

      {/* 상단바 */}
      <TopBar activeTab={activeTab} onChange={setActiveTab} />

      {/* TODO: 컨텐츠 추가 */}
      {activeTab === 'works' && <div className="px-4 py-8">관심 작품 피드</div>}
      {activeTab === 'writers' && (
        <div className="px-4 py-8">관심 작가 피드</div>
      )}

      {/* 하단 네비게이션 바 */}
      <NavigationBar />
    </div>
  )
}
