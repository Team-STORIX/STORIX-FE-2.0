// src/app/profile/page.tsx
import TopBar from './components/topbar'
import UserProfile from './components/userProfile'
import PreferenceTab from './components/preferenceTab'
import Preference from './components/preference'
import Rating from './components/rating'
import Genre from './components/genre'
import Hashtag from './components/hashtag'
import NavigationBar from './components/navigationbar'

export default function ProfilePage() {
  return (
    <div className="relative min-h-screen pb-[169px]">
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

      {/* 하단 네비게이션 바 */}
      <NavigationBar />
    </div>
  )
}
