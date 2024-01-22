import { prisma } from '@/lib/prisma'
import { Store } from '@prisma/client'
import { cache } from 'react'

// export type CommentWithAuthor = Comment & {
//   user: { name: string | null; image: string | null }
// }

export const getStoreById = cache(
  (storeId: string, userId: string): Promise<Store | null> => {
    return prisma.store.findUnique({
      where: { id: storeId, userId },
      //   include: {

      //   },
    })
  }
)
