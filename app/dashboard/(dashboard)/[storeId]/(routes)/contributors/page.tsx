// import { format } from 'date-fns'
import { format } from 'date-fns-jalali'
import { ContributorColumn } from './components/columns'

import { getAllCategories } from '@/lib/queries/dashboard/categories'
import { notFound } from 'next/navigation'
import { getAllContributions } from '@/lib/queries/dashboard/contributors'
import { ContributorsClient } from './components/ContributorsClient'
import { translateArray } from '@/lib/utils'

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categories = await getAllContributions(params.storeId)

  if (!categories) {
    return notFound()
  }
  const formattedContributors: ContributorColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    role: translateArray(item.role),
    // createdAt: format(item.createdAt, 'dd MMMM yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ContributorsClient data={formattedContributors} />
      </div>
    </div>
  )
}

export default CategoriesPage
