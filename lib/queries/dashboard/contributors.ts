import { prisma } from '@/lib/prisma'
import { Billboard, Category, Contributor, Image } from '@prisma/client'
import { cache } from 'react'

export const getAllContributions = cache(
  (storeId: string): Promise<Contributor[] | null> => {
    const contributors = prisma.contributor.findMany({
      where: {
        storeId,
      },
      orderBy: {
        name: 'desc',
      },
    })

    return contributors
  }
)
