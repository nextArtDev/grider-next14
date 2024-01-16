import { Image, Role } from '@prisma/client'
import NextAuth, { type DefaultSession } from 'next-auth'

export type ExtendedUser = DefaultSession['user'] & {
  role: Role
  phone: string
  isVerified: boolean
  image?: string
}
export type ExtendedUserWithoutEmail = Omit<ExtendedUser, 'email'>
declare module 'next-auth' {
  interface Session {
    user: ExtendedUserWithoutEmail
  }
}
