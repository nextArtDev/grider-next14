import { prisma } from '@/lib/prisma'

export const getUserByPhoneNumber = async (phone: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { phone } })

    return user
  } catch {
    return null
  }
}

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } })

    return user
  } catch {
    return null
  }
}
