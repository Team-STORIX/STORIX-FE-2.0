// src/hooks/plus/useCreateReaderReview.ts
import { useMutation } from '@tanstack/react-query'
import { postReaderReview } from '@/api/plus/plus.api'
import { ReaderReviewCreateRequest } from '@/api/plus/plus.schema'

export function useCreateReaderReview() {
  return useMutation({
    mutationFn: (payload: ReaderReviewCreateRequest) =>
      postReaderReview(payload),
  })
}
