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
import { useMyProfile } from '@/features/profile/hooks/useMyProfile'

export default function MyActivityPage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'comments' | 'likes'>(
    'posts',
  )

  const { data, loading, errorMsg } = useMyProfile()

  return (
    <div>
      <div className="h-[54px]" />
      <TopBar />

      {loading && (
        <div
          className="px-5 py-4 text-[14px]"
          style={{ color: 'var(--color-gray-600)' }}
        >
          프로필 불러오는 중...
        </div>
      )}

      {errorMsg && (
        <div
          className="px-5 py-4 text-[14px]"
          style={{ color: 'var(--color-gray-600)' }}
        >
          프로필 조회 에러: {errorMsg}
        </div>
      )}

      {/* ✅ 여기서 undefined 방지: 기본값 넣어서 UserProfile props 타입 맞추기 */}
      {!loading && !errorMsg && (
        <>
          <UserProfile
            profileImage={data?.profileImageUrl ?? undefined}
            level={data?.level ?? 1}
            nickname={data?.nickname ?? '(닉네임 없음)'}
            bio={data?.bio ?? ''}
          />

          <PreferenceTab />

          {/* 게시글/댓글/좋아요 탭 */}
          <Selectbar activeTab={activeTab} onChange={setActiveTab} />

          {/* 선택된 탭에 따른 컨텐츠 */}
          {activeTab === 'posts' && <MyPosts />}
          {activeTab === 'comments' && <MyComments />}
          {activeTab === 'likes' && <MyLikes />}
        </>
      )}
    </div>
  )
}
