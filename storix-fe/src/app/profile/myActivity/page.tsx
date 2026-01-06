// src/app/profile/myActivity/page.tsx
'use client'

import { useEffect, useState } from 'react'
import TopBar from '../components/topbar'
import UserProfile from '../components/userProfile'
import PreferenceTab from '../components/preferenceTab'
import Selectbar from './components/selectBar'
import MyPosts from './components/myPosts'
import MyComments from './components/myComments'
import MyLikes from './components/myLikes'
import NavBar from '@/components/common/NavBar'
import { apiClient } from '@/api/axios-instance'
import { useAuthStore } from '@/store/auth.store'

type MeProfileResult = {
  role: string
  profileImageUrl: string | null
  nickName: string
  level?: number
  profileDescription: string | null
}

export default function MyActivityPage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'comments' | 'likes'>(
    'posts',
  )

  const [nickname, setNickname] = useState<string>('')
  const [level, setLevel] = useState<number>(1)
  const [profileImageUrl, setProfileImageUrl] = useState<string | undefined>(
    undefined,
  )
  const [bio, setBio] = useState<string>('')

  useEffect(() => {
    let mounted = true

    const fetchMe = async () => {
      try {
        const token = useAuthStore.getState().accessToken
        console.log('[myActivity] accessToken exists?', !!token)

        const res = await apiClient.get('/api/v1/profile/me')

        const result = (res.data as any)?.result as MeProfileResult | undefined
        if (!result) throw new Error('No result in /profile/me response')

        if (!mounted) return

        setNickname(result.nickName ?? '')
        setLevel(typeof result.level === 'number' ? result.level : 1)
        setProfileImageUrl(result.profileImageUrl ?? undefined)
        setBio(result.profileDescription ?? '')
      } catch (e: any) {
        console.error('[myActivity] failed to fetch /profile/me', e)
        if (!mounted) return
        setNickname('')
        setLevel(1)
        setProfileImageUrl(undefined)
        setBio('')
      }
    }

    fetchMe()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div>
      <div className="h-[54px]" />
      <TopBar />

      <UserProfile
        profileImage={profileImageUrl}
        level={level}
        nickname={nickname || '닉네임'}
        bio={bio}
      />

      <PreferenceTab />

      {/* 게시글/댓글/좋아요 탭 */}
      <Selectbar activeTab={activeTab} onChange={setActiveTab} />

      {/* 선택된 탭에 따른 컨텐츠 */}
      {activeTab === 'posts' && <MyPosts />}
      {activeTab === 'comments' && <MyComments />}
      {activeTab === 'likes' && <MyLikes />}
      <NavBar active="profile" />
    </div>
  )
}
