import RelatedProducts from '@/components/home/RelatedProducts'
import ContributorProfile from '@/components/home/contributors/ContributorProfile'
import { getContributorById } from '@/lib/queries/home/contributors'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {
  params: { contributorId: string }
}

const page: FC<pageProps> = async ({ params: { contributorId } }) => {
  const contributor = await getContributorById({ id: contributorId })
  console.log(contributor?.writer)
  console.log(contributor?.Translator)
  console.log(contributor?.editor)
  console.log(contributor?.illustrator)
  console.log(contributor?.photographer)

  if (!contributor) return notFound()

  return (
    <div>
      <ContributorProfile contributor={contributor} />
      <RelatedProducts contributor={contributor} />
    </div>
  )
}

export default page
