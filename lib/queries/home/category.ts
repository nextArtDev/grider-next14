import { prisma } from '@/lib/prisma'
import { Billboard, Category, Product } from '@prisma/client'
import { cache } from 'react'

type Image = { url: string }

type CategoryWithImage = Category & { image: Partial<Image> | null }
type BillboardWithImage = Billboard & { image: Partial<Image> | null }
type ProductWithImages = Product & { images: { url: string }[] }

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
        name: 'asc',
      },
    })

    return categories
  }
)
export const getCategoryByBillboardId = cache(
  ({
    billboardId,
  }: {
    billboardId: string
  }): Promise<CategoryFullStructure[] | null> => {
    const categories = prisma.category.findMany({
      where: {
        storeId: process.env.STORE_ID,
        billboardId,
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

export type CategoryWithProducts = CategoryWithImage & {
  products: ProductWithImages[] | null
  billboard: { label: string }
}
export const getCategoryById = cache(
  ({
    categoryId,
  }: {
    categoryId: string
  }): Promise<CategoryWithProducts | null> => {
    const category = prisma.category.findFirst({
      where: {
        storeId: process.env.STORE_ID,
        id: categoryId,
      },
      include: {
        image: { select: { url: true } },
        billboard: { select: { label: true } },
        products: {
          include: { images: { select: { url: true } } },
        },
      },
    })

    return category
  }
)
