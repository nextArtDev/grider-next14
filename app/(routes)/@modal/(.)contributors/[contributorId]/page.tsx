import { FC } from 'react'
import ContributorDrawer from './ContributorDrawer'
import { getContributorById } from '@/lib/queries/home/contributors'
import { notFound } from 'next/navigation'

interface pageProps {
  params: { contributorId: string }
}

const InterceptingContributor: FC<pageProps> = async ({
  params: { contributorId },
}) => {
  const contributor = await getContributorById({ id: contributorId })

  if (!contributor.contributor) return notFound()

  return (
    <div>
      <ContributorDrawer
        contributor={contributor.contributor}
        rate={contributor.rate}
      />
    </div>
  )
}

export default InterceptingContributor
