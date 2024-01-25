import { prisma } from '@/lib/prisma'
import { Billboard } from '@prisma/client'
import { cache } from 'react'

export const getAllBillboards = cache(
  (storeId: string): Promise<Billboard[] | null> => {
    const billboards = prisma.billboard.findMany({
      where: {
        storeId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    return billboards
  }
)
