import { prisma } from '@/lib/prisma'
import { ProductForm } from './components/product-form'
import { Product } from '@prisma/client'

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string }
}) => {
  const product:
    | (Product & { images: { url: string }[] } & {
        translator: { id: string }[]
      } & {
        category: { id: string }
      } & {
        illustrator: { id: string }[]
      } & { photographer: { id: string }[] } & {
        writer: { id: string }[]
      } & { editor: { id: string }[] })
    | null = await prisma.product.findUnique({
    where: {
      id: params.productId,
    },
    include: {
      images: { select: { url: true } },
      translator: { select: { id: true } },
      category: { select: { id: true } },
      illustrator: { select: { id: true } },
      photographer: { select: { id: true } },
      writer: { select: { id: true } },
      editor: { select: { id: true } },
    },
  })
  const categories = await prisma.category.findMany({
    where: {
      storeId: params.storeId,
    },
  })
  //if any 'billboardId' we'll gonna use that as initial data, if not just we route here to create a new billboard
  const writers = await prisma.contributor.findMany({
    where: {
      storeId: params.storeId,
      OR: [
        {
          role: {
            has: 'Writer',
          },
        },
      ],
    },
  })
  const translators = await prisma.contributor.findMany({
    where: {
      storeId: params.storeId,
      OR: [
        {
          role: {
            has: 'Translator',
          },
        },
      ],
    },
  })
  const editors = await prisma.contributor.findMany({
    where: {
      storeId: params.storeId,
      OR: [
        {
          role: {
            has: 'Editor',
          },
        },
      ],
    },
  })
  const photographers = await prisma.contributor.findMany({
    where: {
      storeId: params.storeId,
      OR: [
        {
          role: {
            has: 'Photographer',
          },
        },
      ],
    },
  })
  const illustrators = await prisma.contributor.findMany({
    where: {
      storeId: params.storeId,
      OR: [
        {
          role: {
            has: 'Illustrator',
          },
        },
      ],
    },
  })
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          writers={writers}
          translators={translators}
          editors={editors}
          illustrators={illustrators}
          photographers={photographers}
          categories={categories}
          initialData={product}
        />
      </div>
    </div>
  )
}

export default ProductPage
