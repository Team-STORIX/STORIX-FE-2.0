// src/hooks/plus/useCreateReaderBoard.ts
import { useMutation } from '@tanstack/react-query'
import {
  postBoardImagePresignedUrls,
  postReaderBoard,
  uploadToPresignedUrl,
} from '@/lib/api/plus/plus.api'

type CreateReaderBoardArgs = {
  isWorksSelected: boolean
  worksId: number
  isSpoiler: boolean
  content: string
  images: File[] // 사용자가 선택한 이미지들(최대 3장)
}

export function useCreateReaderBoard() {
  return useMutation({
    mutationFn: async ({ images, ...rest }: CreateReaderBoardArgs) => {
      // 1) presigned url 발급
      const presignRes = await postBoardImagePresignedUrls({
        files: images.map((f) => ({ contentType: f.type })),
      })
      const presigned = presignRes.result

      // 2) S3 업로드 (PUT)
      await Promise.all(
        presigned.map((p, idx) => uploadToPresignedUrl(p.url, images[idx])),
      )

      // 3) objectKey로 게시글 등록
      const boardRes = await postReaderBoard({
        ...rest,
        files: presigned.map((p) => ({ objectKey: p.objectKey })),
      })

      return boardRes
    },
  })
}
