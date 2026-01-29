// src/app/profile/myActivity/page.tsx
'use client'

import { useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import TopBar from '../components/topbar'
import UserProfile from '../components/userProfile'
import PreferenceTab from '../components/preferenceTab'
import Selectbar from './components/selectBar'
import MyPosts from './components/myPosts'
import MyComments from './components/myComments'
import MyLikes from './components/myLikes'
import NavBar from '@/components/common/NavBar'

import { useProfileStore } from '@/store/profile.store'
import { getMyProfile } from '@/api/profile/profile.api'

type Tab = 'posts' | 'comments' | 'likes'
const TABS: Tab[] = ['posts', 'comments', 'likes']

const isTab = (v: string | null): v is Tab => !!v && TABS.includes(v as Tab)

const scrollKey = (tab: Tab) => `myActivity:scroll:${tab}`

export default function MyActivityPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // ✅ URL에서 tab 읽기 (없으면 posts)
  const tabFromUrl = useMemo<Tab>(() => {
    const t = searchParams.get('tab')
    return isTab(t) ? t : 'posts'
  }, [searchParams])

  const [activeTab, setActiveTab] = useState<Tab>(tabFromUrl)

  // ✅ URL tab이 바뀌면 state도 동기화 (뒤로가기/앞으로가기 대응)
  useEffect(() => {
    setActiveTab(tabFromUrl)
  }, [tabFromUrl])

  // ✅ 탭 변경 시 URL도 같이 변경 (뒤로가기로 복원되게)
  const changeTab = (next: Tab) => {
    // 탭 바꾸기 전에 현재 스크롤 저장
    sessionStorage.setItem(scrollKey(activeTab), String(window.scrollY))

    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', next)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    // state는 tabFromUrl effect가 맞춰주지만, UX 빠르게 하려면 바로 반영해도 됨
    setActiveTab(next)
  }

  // ✅ 탭별 스크롤 저장(스크롤할 때마다 갱신)
  useEffect(() => {
    const onScroll = () => {
      sessionStorage.setItem(scrollKey(activeTab), String(window.scrollY))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [activeTab])

  // ✅ 탭 바뀌거나(또는 뒤로가기) 마운트될 때 저장된 스크롤 복원
  useLayoutEffect(() => {
    const saved = sessionStorage.getItem(scrollKey(activeTab))
    if (!saved) return

    // 렌더 완료 후 이동 (리스트가 그려진 다음이 더 안정적)
    requestAnimationFrame(() => {
      window.scrollTo(0, Number(saved))
    })
  }, [activeTab])

  const me = useProfileStore((s) => s.me)
  const setMe = useProfileStore((s) => s.setMe)

  // ✅ store 비어있을 때만 1회 보충 fetch
  useEffect(() => {
    let mounted = true

    const hydrate = async () => {
      if (me) return
      try {
        const res = await getMyProfile()
        if (!res.isSuccess) throw new Error(res.message || 'Failed to load me')
        if (!mounted) return
        setMe(res.result)
      } catch (e) {}
    }

    hydrate()
    return () => {
      mounted = false
    }
  }, [me, setMe])

  const nickname = me?.nickName ?? ''
  const level = typeof me?.level === 'number' ? me.level : 1
  const profileImageUrl = me?.profileImageUrl || undefined
  const bio = me?.profileDescription ?? ''

  return (
    <div className="relative w-full min-h-full pb-[169px]">
      <TopBar />

      <UserProfile
        profileImage={profileImageUrl}
        level={level}
        nickname={nickname || '닉네임'}
        bio={bio}
      />

      <PreferenceTab />

      <Selectbar activeTab={activeTab} onChange={changeTab} />

      {activeTab === 'posts' && <MyPosts />}
      {activeTab === 'comments' && <MyComments />}
      {activeTab === 'likes' && <MyLikes />}

      <NavBar active="profile" />
    </div>
  )
}
