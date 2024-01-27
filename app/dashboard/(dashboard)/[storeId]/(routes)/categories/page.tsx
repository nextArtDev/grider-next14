// import { format } from 'date-fns'
import { format } from 'date-fns-jalali'
import { CategoryColumn } from './components/columns'

import { getAllBillboards } from '@/lib/queries/dashboard/billboards'
import { notFound } from 'next/navigation'
import { getAllCategories } from '@/lib/queries/dashboard/categories'
import { CategoriesClient } from './components/CategoriesClient'

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  // const billboards = await prisma.billboard.findMany({
  //   where: {
  //     storeId: params.storeId,
  //   },
  //   orderBy: {
  //     createdAt: 'desc',
  //   },
  // })
  const categories = await getAllCategories(params.storeId)

  if (!categories) {
    return notFound()
  }
  const formattedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt, 'dd MMMM yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesClient data={formattedCategories} />
      </div>
    </div>
  )
}

export default BillboardsPage
