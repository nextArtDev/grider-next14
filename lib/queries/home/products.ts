import { prisma } from '@/lib/prisma'
import { cache } from 'react'
import { Billboard, Category, Contributor, Product } from '@prisma/client'

enum OrderByType {
  'asc',
  'desc',
}

type Image = { url: string }

type CategoryWithImage = Category & { image: Image | null }
type BillboardWithImage = Billboard & { image: Image | null }
type ProductWithImages = Product & { images: Image[] }

export type ProductFullStructure = ProductWithImages & {
  writer: Partial<Contributor>[]
  translator: Partial<Contributor>[]
  category: Category
}

export const getFeaturedProducts = cache(
  ({
    take,
  }: // orderBy,
  {
    take: number
    // orderBy?: OrderByType
  }): Promise<ProductFullStructure[] | null> => {
    const products = prisma.product.findMany({
      where: {
        storeId: process.env.STORE_ID,
        isFeatured: true,
      },
      include: {
        images: { select: { url: true } },
        writer: { select: { name: true } },
        translator: { select: { name: true } },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
      take,
    })

    return products
  }
)
export const getAllProducts = cache(
  (): Promise<
    | (ProductWithImages & { category: Category } & {
        writer: Partial<Contributor>[]
      } & { translator: Partial<Contributor>[] })[]
    | null
  > => {
    const products = prisma.product.findMany({
      where: {
        storeId: process.env.STORE_ID,
      },
      include: {
        images: { select: { url: true } },
        writer: { select: { name: true } },
        translator: { select: { name: true } },
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return products
  }
)
