import { prisma } from '@/lib/prisma'

export const getImageById = async (id: string) => {
  try {
    const user = await prisma.image.findUnique({ where: { id } })

    return user
  } catch {
    return null
  }
}
