import RelatedProducts from '@/components/home/RelatedProducts'
import ContributorProfile from '@/components/home/contributors/ContributorProfile'
import AddRating from '@/components/shared/AddRating'
import { currentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getContributorById } from '@/lib/queries/home/contributors'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {
  params: { contributorId: string }
}

const page: FC<pageProps> = async ({ params: { contributorId } }) => {
  const contributor = await getContributorById({ id: contributorId })
  if (!contributor) return notFound()

  const user = await currentUser()
  const beforeRated = await prisma.review.findFirst({
    where: {
      userId: user?.id,
      contributorId: contributor.id,
    },
    select: {
      rating: true,
    },
  })

  const userWithPic = await prisma.user.findFirst({
    where: { id: user?.id },
    include: { image: { select: { url: true } } },
  })

  console.log(user)
  return (
    <div>
      <ContributorProfile
        contributor={contributor}
        user={userWithPic}
        beforeRated={beforeRated}
      />
      <RelatedProducts contributor={contributor} />
    </div>
  )
}

export default page
