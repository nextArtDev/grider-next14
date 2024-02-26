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

interface Query {
  OR?: {
    name?: { contains: string }
    description?: { contains: string }
  }[]
}
export const getAllCategories = cache(
  ({
    page = 1,
    pageSize = 10,
    searchQuery,
    filter,
  }: // orderBy,
  {
    page?: number
    pageSize?: number
    searchQuery?: string
    filter?: string
    // orderBy?: OrderByType
  }): Promise<CategoryFullStructure[] | null> => {
    const skipAmount = (page - 1) * pageSize
    const query: Query = {} // This will be used to build the Prisma query

    if (searchQuery) {
      query.OR = [
        { name: { contains: searchQuery } },
        { description: { contains: searchQuery } },
      ]
    }

    let orderByOptions: any = {}
    const categories = prisma.category.findMany({
      where: {
        storeId: process.env.STORE_ID,
        AND: query,
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
