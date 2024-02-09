import { prisma } from '@/lib/prisma'
import { Billboard } from '@prisma/client'
import { cache } from 'react'

export const getBillboardsWithCategories = cache(
  (): Promise<
    (Billboard & { categories: { id: string; name: string }[] })[] | null
  > => {
    const billboards = prisma.billboard.findMany({
      where: {
        storeId: process.env.STORE_ID,
      },
      include: {
        categories: { select: { id: true, name: true } },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return billboards
  }
)
