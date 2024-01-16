'use server'

import * as z from 'zod'
import bcrypt from 'bcryptjs'

import { update } from '@/auth'

import { SettingsSchema } from '@/schemas'
import { getUserByPhoneNumber, getUserById } from '@/data/user'
import { currentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
  const user = await currentUser()

  if (!user) {
    return { error: 'عدم عضویت!' }
  }

  const dbUser = await getUserById(user.id)

  if (!dbUser) {
    return { error: 'عدم عضویت!' }
  }

  // if (values.phone && values.phone !== user.phone) {
  //   const existingUser = await getUserByPhoneNumber(values.phone)

  //   if (existingUser && existingUser.id !== user.id) {
  //     return { error: 'این شماره موجود است!' }
  //   }

  //   // const verificationToken = await generateVerificationToken(values.email)
  //   // await sendVerificationEmail(
  //   //   verificationToken.email,
  //   //   verificationToken.token
  //   // )

  //   return { success: 'Verification email sent!' }
  // }

  if (values.password && values.newPassword && dbUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      dbUser.password
    )

    if (!passwordsMatch) {
      return { error: 'پسورد اشتباه است!' }
    }

    const hashedPassword = await bcrypt.hash(values.newPassword, 10)
    values.password = hashedPassword
    values.newPassword = undefined
  }

  const updatedUser = await prisma.user.update({
    where: { id: dbUser.id },
    data: {
      ...values,
    },
  })

  update({
    user: {
      name: updatedUser.name,
      // phone: updatedUser.phone,
      // isVerified: updatedUser.isVerified,
      // role: updatedUser.role,
    },
  })

  return { success: 'مشخصات آپدیت شد!' }
}
