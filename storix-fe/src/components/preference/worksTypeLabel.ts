export type SearchWorksType = 'WEBTOON' | 'WEBNOVEL' | 'COMIC'

const WORKS_TYPE_LABELS: Record<SearchWorksType, string> = {
  WEBTOON: '웹툰',
  WEBNOVEL: '웹소설',
  COMIC: '만화',
}

export function getWorksTypeLabel(worksType?: string | null) {
  if (!worksType) return ''

  return (
    WORKS_TYPE_LABELS[worksType as SearchWorksType] ??
    worksType
  )
}
