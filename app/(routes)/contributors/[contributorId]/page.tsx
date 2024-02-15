import ContributorProfile from '@/components/home/contributors/ContributorProfile'
import { getContributorById } from '@/lib/queries/home/contributors'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {
  params: { contributorId: string }
}

const page: FC<pageProps> = async ({ params: { contributorId } }) => {
  const contributor = await getContributorById({ id: contributorId })
  if (!contributor) return notFound()

  return (
    <div>
      <ContributorProfile contributor={contributor} />
    </div>
  )
}

export default page
