import { prisma } from '@/lib/prisma'
import { cache } from 'react'
import {
  Billboard,
  Category,
  Contributor,
  Product,
  Review,
  User,
} from '@prisma/client'

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
interface Query {
  OR?: {
    title?: { contains: string }
    subTitle?: { contains: string }
    description?: { contains: string }
    originalTitle?: { contains: string }
  }[]
}

export type ProductsWithImageAndPage = {
  products:
    | (ProductWithImages & { category: Category } & {
        writer: Partial<Contributor>[]
      } & { translator: Partial<Contributor>[] })[]
    | null
  isNext: boolean
}

export const getAllProducts = cache(
  async ({
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
  }): Promise<ProductsWithImageAndPage> => {
    const skipAmount = (page - 1) * pageSize
    const query: Query = {} // This will be used to build the Prisma query

    if (searchQuery) {
      query.OR = [
        { title: { contains: searchQuery } },
        { subTitle: { contains: searchQuery } },
        { description: { contains: searchQuery } },
        { originalTitle: { contains: searchQuery } },
      ]
    }

    let orderByOptions: any = {}
    switch (filter) {
      case 'newest':
        orderByOptions = { createdAt: 'desc' }
        break
      case 'ordered':
        orderByOptions = {
          orderItems: {
            _count: 'desc',
          },
        }
        break
      case 'ordered':
        orderByOptions = { createdAt: 'asc' }
        break
      default:
        break
    }

    const products = await prisma.product.findMany({
      where: {
        storeId: process.env.STORE_ID,
        AND: query,
      },
      include: {
        images: { select: { url: true } },
        writer: { select: { name: true } },
        translator: { select: { name: true } },
        category: true,
        Reviews: true,
      },
      orderBy: orderByOptions,
      take: pageSize,
      skip: skipAmount,
    })

    const totalProducts = await prisma.product.count({ where: query })

    const isNext = totalProducts > skipAmount + products.length

    return { products: products, isNext }
  }
)

export type ReviewsWithUserAndImage = Review & {
  User:
    | (User & {
        image: {
          url: string
        } | null
      })
    | null
}

export type SingleProductFullStructure = ProductWithImages & {
  writer: Partial<Contributor>[]
  translator: Partial<Contributor>[]
  editor: Partial<Contributor>[]
  category: Category
  Reviews: ReviewsWithUserAndImage[]
}

export const getProductById = cache(
  ({ id }: { id: string }): Promise<SingleProductFullStructure | null> => {
    const product = prisma.product.findFirst({
      where: {
        storeId: process.env.STORE_ID,
        id,
      },
      include: {
        images: { select: { url: true } },
        writer: { select: { name: true, id: true } },
        translator: { select: { name: true, id: true } },
        editor: { select: { name: true, id: true } },
        category: true,
        Reviews: {
          include: { User: { include: { image: { select: { url: true } } } } },
        },
      },
    })

    return product
  }
)

// export type SingleProductFullStructure = ProductWithImages & {
//   writer: Partial<Contributor>[]
//   translator: Partial<Contributor>[]
//   editor: Partial<Contributor>[]
//   category: Category
// }

export const getProductsByCategoryId = cache(
  ({
    id,
    categoryId,
  }: {
    id: string
    categoryId: string
  }): Promise<SingleProductFullStructure[] | null> => {
    const products = prisma.product.findMany({
      where: {
        storeId: process.env.STORE_ID,
        categoryId,
        NOT: { id },
      },
      include: {
        images: { select: { url: true } },
        writer: { select: { name: true, id: true } },
        translator: { select: { name: true, id: true } },
        editor: { select: { name: true, id: true } },
        category: true,
        Reviews: {
          include: { User: { include: { image: { select: { url: true } } } } },
        },
      },
    })

    return products
  }
)

// Popular Products

export async function getPopularProducts() {
  try {
    // Get the top 7 popular tags based on the number of questions
    const popular = await prisma.product.findMany({
      where: {},
      take: 7,
      include: {
        images: { select: { url: true } },
      },
      orderBy: {
        orderItems: {
          _count: 'desc',
        },
      },
    })

    // Map the result to include the name and the number of questions

    return popular
  } catch (error) {
    console.log(error)

    throw error
  }
}
