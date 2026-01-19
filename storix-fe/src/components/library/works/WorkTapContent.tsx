//src/components/library/works/WorkTapContent.tsx
'use client'

type TabKey = 'info' | 'review'

type UIData = {
  reviewCount: number
  title: string
  description: string
  keywords: string[]
  platform: ''
}

type ReviewItem = {
  id: string
  userName: string
  avatarColorClass: string
  content: string
}

// 리뷰 API 아직 없으니 UI용 더미만 유지
const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: 'u2',
    userName: '나는 유저2',
    avatarColorClass: 'bg-[var(--color-magenta-100)]',
    content:
      '와- 이 웹툰 제목만 보고 가벼운 로맨스겠지? 했는데 생각보다 세계관 탄탄해서 바로 만화책처럼 몰입됨...',
  },
  {
    id: 'u3',
    userName: '나는 유저3',
    avatarColorClass: 'bg-gray-100',
    content: '감정선이 너무 섬세해서 한 장면 한 장면 놓치기 싫다.',
  },
]

type Props = {
  tab: TabKey
  onChangeTab: (tab: TabKey) => void
  ui: UIData
  onReviewWrite: () => void
}

export default function WorkTabContent({
  tab,
  onChangeTab,
  ui,
  onReviewWrite,
}: Props) {
  return (
    <>
      {/* Tabs */}
      <div className="px-4">
        <div className="flex border-b border-gray-200">
          <button
            type="button"
            onClick={() => onChangeTab('info')}
            className={[
              'flex-1 py-3 text-center caption-1 cursor-pointer',
              tab === 'info' ? 'text-black' : 'text-gray-400',
            ].join(' ')}
          >
            정보
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('review')}
            className={[
              'flex-1 py-3 text-center caption-1 cursor-pointer',
              tab === 'review' ? 'text-black' : 'text-gray-400',
            ].join(' ')}
          >
            리뷰({ui.reviewCount})
          </button>
        </div>

        <div className="relative">
          <div
            className={[
              'absolute -top-[1px] h-[2px] w-1/2 bg-black transition-transform duration-200',
              tab === 'info' ? 'translate-x-0' : 'translate-x-full',
            ].join(' ')}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-10">
        {tab === 'info' ? (
          <div>
            <section className="pt-6">
              <p className="heading-2 text-black">감상 가능한 곳</p>

              {ui.platform.length === 0 ? (
                <p className="body-2 mt-3 text-gray-400">
                  플랫폼 정보가 없어요
                </p>
              ) : (
                <div className="mt-3 flex flex-col gap-2">
                  <div key={ui.platform} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2F6BFF]">
                      <span className="caption-1 text-white font-semibold">
                        R
                      </span>
                    </div>
                    <p className="body-2 text-gray-700">{ui.platform}</p>
                  </div>
                </div>
              )}
            </section>

            <section className="pt-8">
              <p className="heading-2 text-black">작품 소개</p>
              <p className="body-2 mt-3 whitespace-pre-line text-gray-600 line-clamp-6">
                {ui.description || '작품 소개가 없어요'}
              </p>
            </section>

            <section className="pt-8">
              <p className="heading-2 text-black">키워드</p>
              {ui.keywords.length === 0 ? (
                <p className="body-2 mt-3 text-gray-400">키워드가 없어요</p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2 ">
                  {ui.keywords.map((k) => (
                    <span
                      key={k}
                      className="inline-flex items-center gap-1 rounded border border-gray-200 bg-gray-50 px-2 py-1.5 text-sm cursor-pointer"
                    >
                      #{k}
                    </span>
                  ))}
                </div>
              )}
            </section>
          </div>
        ) : (
          <div>
            <section className="pt-6">
              <p className="heading-2 text-black">내 리뷰</p>
              <button
                type="button"
                onClick={onReviewWrite}
                className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-4 text-left cursor-pointer"
              >
                <p className="caption-1 text-gray-500">{ui.title}...</p>
                <p className="body-2 mt-1 text-gray-700 line-clamp-2">
                  아직 작성한 리뷰가 없어요. 리뷰를 작성해보세요!
                </p>
              </button>
            </section>

            <section className="pt-8">
              <p className="heading-2 text-black">다른 유저들의 리뷰</p>

              <div className="mt-4 flex flex-col gap-4">
                {MOCK_REVIEWS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className="flex w-full items-start gap-3 rounded-xl border border-gray-100 px-4 py-4 text-left cursor-pointer"
                  >
                    <div
                      className={[
                        'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                        r.avatarColorClass,
                      ].join(' ')}
                    >
                      <span className="caption-1 text-[var(--color-magenta-300)]">
                        ✦
                      </span>
                    </div>

                    <div className="flex-1">
                      <p className="caption-1 text-gray-600">{r.userName}</p>
                      <p className="body-2 mt-1 text-gray-700 line-clamp-2">
                        {r.content}
                      </p>
                    </div>

                    <span className="text-gray-300">›</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  )
}
