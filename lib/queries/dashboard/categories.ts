import { prisma } from '@/lib/prisma'
import { Billboard, Category, Image } from '@prisma/client'
import { cache } from 'react'

export const getAllCategories = cache(
  (
    storeId: string
  ): Promise<(Category & { billboard: Billboard })[] | null> => {
    const categories = prisma.category.findMany({
      where: {
        storeId,
      },
      include: {
        billboard: {
          include: {
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return categories
  }
)
