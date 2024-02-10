import { prisma } from '@/lib/prisma'
import { Billboard, Category, Product } from '@prisma/client'
import { cache } from 'react'

type Image = { url: string }

type CategoryWithImage = Category & { image: Image | null }
type BillboardWithImage = Billboard & { image: Image | null }
type ProductWithImages = Product & { images: Image[] | null }

export type CategoryFullStructure = CategoryWithImage & {
  billboard: BillboardWithImage
  products: ProductWithImages[] | null
}

export const getAllCategories = cache(
  (): Promise<CategoryFullStructure[] | null> => {
    const categories = prisma.category.findMany({
      where: {
        storeId: process.env.STORE_ID,
      },
      include: {
        image: { select: { url: true } },
        billboard: {
          include: {
            image: { select: { url: true } },
          },
        },
        products: {
          include: { images: { select: { url: true } } },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return categories
  }
)
