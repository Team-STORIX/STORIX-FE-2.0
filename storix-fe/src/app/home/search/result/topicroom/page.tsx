import { redirect } from 'next/navigation'

type Props = {
  searchParams: Promise<{ keyword?: string }>
}

export default async function Page({ searchParams }: Props) {
  const { keyword = '' } = await searchParams
  redirect(`/home/search/result?keyword=${encodeURIComponent(keyword)}`)
}
