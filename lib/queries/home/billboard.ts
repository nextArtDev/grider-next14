import { prisma } from '@/lib/prisma'
import { Billboard } from '@prisma/client'
import { cache } from 'react'

export type BillboardsWithImagesAndCategories = Billboard & {
  image: { url: string } | null
} & {
  categories: { id: string; name: string }[]
}

export const getBillboardsWithCategories = cache(
  (): Promise<BillboardsWithImagesAndCategories[] | null> => {
    const billboards = prisma.billboard.findMany({
      where: {
        storeId: process.env.STORE_ID,
      },
      include: {
        categories: { select: { id: true, name: true } },
        image: { select: { url: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return billboards
  }
)
