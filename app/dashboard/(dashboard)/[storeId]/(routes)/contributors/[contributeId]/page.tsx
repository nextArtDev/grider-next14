import { prisma } from '@/lib/prisma'
import { ContributeForm } from './components/contribute-form'

const CategoryPage = async ({
  params,
}: {
  params: { contributeId: string; storeId: string }
}) => {
  const contributor = await prisma.contributor.findFirst({
    where: {
      id: params.contributeId,
    },
    include: {
      image: { select: { url: true } },
    },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ContributeForm initialData={contributor} />
      </div>
    </div>
  )
}

export default CategoryPage
