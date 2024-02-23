// import { authOptions } from '@/lib/auth'
// import { prisma } from '@/lib/prisma'
// import { getServerSession } from 'next-auth'

// export async function getSession() {
//   return await getServerSession(authOptions)
// }

// export async function getCurrentUser() {
//   try {
//     const session = await getSession()

//     if (!session?.user) {
//       return null
//     }
//     // console.log('user get', session?.user)

//     const currentUser = await prisma.user.findUnique({
//       where: {
//         id: session.user.id,
//       },
//     })

//     if (!currentUser) return null

//     return {
//       ...currentUser,
//       createdAt: currentUser.createdAt.toISOString(),
//       updatedAt: currentUser.updatedAt.toISOString(),
//       verified: currentUser.isVerified,
//       // role: currentUser.role,
//     }
//   } catch (error) {}
// }
