// import { format } from 'date-fns'
import { format } from 'date-fns-jalali'

import { notFound } from 'next/navigation'
import { getAllProducts } from '@/lib/queries/dashboard/products'
import { formatter, getFarsiBoolean } from '@/lib/utils'
import { ProductsClient } from './components/ProductClient'
import { ProductColumn } from './components/columns'

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  // const billboards = await prisma.billboard.findMany({
  //   where: {
  //     storeId: params.storeId,
  //   },
  //   orderBy: {
  //     createdAt: 'desc',
  //   },
  // })
  const products = await getAllProducts(params.storeId)

  if (!products) {
    return notFound()
  }

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    title: item.title,
    writer: item?.writer?.[0]?.name,
    translator: item?.translator?.[0]?.name,
    isFeatured: getFarsiBoolean(item.isFeatured),
    isArchived: getFarsiBoolean(item.isArchived),
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    createdAt: format(item.createdAt, 'dd MMMM yyyy'),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  )
}

export default CategoriesPage
