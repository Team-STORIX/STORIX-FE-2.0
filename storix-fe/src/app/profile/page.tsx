// src/app/profile/page.tsx

import TopBar from './components/topbar'
import UserProfile from './components/userProfile'
import PreferenceTab from './components/preferenceTab'
import Preference from './components/preference'
import Rating from './components/rating'
import Genre from './components/genre'
import Hashtag from './components/hashtag'

// ✅ 공통 네비게이션바로 교체
import NavBar from '@/components/common/NavBar'

export default function ProfilePage() {
  return (
    // ✅ 카드 내부 기준 absolute bottom-0가 먹도록 relative 유지
    // ✅ 네비바(100px) + 플러스 떠있는 영역 고려해서 여유 pb 유지
    <div className="relative w-full min-h-full pb-[169px]">
      {/* 상단 54px 공백 */}
      <div className="h-[54px]" />

      {/* 상단바 */}
      <TopBar />

      {/* 유저 프로필 */}
      <UserProfile />

      {/* 취향분석 */}
      <PreferenceTab />
      <Preference />

      {/* 별점분포 */}
      <Rating />

      {/* 선호장르 */}
      <Genre />

      {/* 해시태그 */}
      <Hashtag />

      {/* ✅ 하단 네비게이션 바 (카드 안 최하단 고정) */}
      <NavBar active="profile" />
    </div>
  )
}
