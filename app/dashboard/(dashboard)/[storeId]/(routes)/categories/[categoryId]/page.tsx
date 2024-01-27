import { prisma } from '@/lib/prisma'
import { CategoryForm } from './components/category-form'

const CategoryPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string }
}) => {
  const category = await prisma.category.findUnique({
    where: {
      id: params.categoryId,
    },
    include: {
      image: true,
    },
  })
  //if any 'billboardId' we'll gonna use that as initial data, if not just we route here to create a new billboard
  const billboards = await prisma.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  )
}

export default CategoryPage
