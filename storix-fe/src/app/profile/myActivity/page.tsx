// src/app/profile/myActivity/page.tsx
'use client'

import { useState } from 'react'
import TopBar from '../components/topbar'
import UserProfile from '../components/userProfile'
import PreferenceTab from '../components/preferenceTab'
import Selectbar from './components/selectBar'
import MyPosts from './components/myPosts'
import MyComments from './components/myComments'
import MyLikes from './components/myLikes'

export default function MyActivityPage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'comments' | 'likes'>(
    'posts',
  )

  return (
    <div>
      <div className="h-[54px]" />
      <TopBar />
      <UserProfile />
      <PreferenceTab />

      {/* 게시글/댓글/좋아요 탭 */}
      <Selectbar activeTab={activeTab} onChange={setActiveTab} />

      {/* 선택된 탭에 따른 컨텐츠 */}
      {activeTab === 'posts' && <MyPosts />}
      {activeTab === 'comments' && <MyComments />}
      {activeTab === 'likes' && <MyLikes />}
    </div>
  )
}
