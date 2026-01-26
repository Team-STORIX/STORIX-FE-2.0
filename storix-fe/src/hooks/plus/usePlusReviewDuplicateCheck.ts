// src/hooks/plus/usePlusReviewDuplicateCheck.ts
import { useQuery } from '@tanstack/react-query'
import { getPlusReviewDuplicate } from '@/lib/api/plus/plus.api'

/**   [+] 리뷰 중복 여부 조회 */
export function usePlusReviewDuplicateCheck(worksId?: number) {
  return useQuery({
    queryKey: ['plus', 'reviewDuplicate', worksId],
    queryFn: () => getPlusReviewDuplicate(worksId as number),
    enabled: !!worksId,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false, // (개발모드 mount 2회 시 불필요 refetch 완화)
    staleTime: 60 * 1000, // (1분간 fresh로 보고 중복 호출 완화)
  })
}
