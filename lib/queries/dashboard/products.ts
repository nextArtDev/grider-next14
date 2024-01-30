import { prisma } from '@/lib/prisma'
import {
  Billboard,
  Category,
  Contributor,
  Image,
  Product,
} from '@prisma/client'
import { cache } from 'react'

export const getAllProducts = cache(
  (
    storeId: string
  ): Promise<
    | (Product & { category: Category } & { images: { url: string }[] } & {
        writer: Contributor[] | null
      } & {
        editor: Contributor[] | null
      } & { illustrator: Contributor[] | null } & {
        translator: Contributor[] | null
      } & {
        photographer: Contributor[] | null
      })[]
    | null
  > => {
    const products = prisma.product.findMany({
      where: {
        storeId,
      },
      include: {
        category: true,
        writer: true,
        editor: true,
        illustrator: true,
        translator: true,
        photographer: true,
        images: { select: { url: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return products
  }
)
// export const getProductWithContributors = cache(
//   (
//     id: string
//   ): Promise<
//     | (Product & { category: Category } & { images: { url: string }[] } & {
//         writer: Contributor[] | null
//       } & {
//         editor: Contributor[] | null
//       } & { illustrator: Contributor[] | null } & {
//         translator: Contributor[] | null
//       } & {
//         photographer: Contributor[] | null
//       })[]
//     | null
//   > => {
//     const products = prisma.product.findFirst({
//       where: {
//         id,
//       },
//       include: {
//         category: true,
//         writer: true,
//         editor: true,
//         illustrator: true,
//         translator: true,
//         photographer: true,
//         images: { select: { url: true } },
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     })

//     return products
//   }
// )
