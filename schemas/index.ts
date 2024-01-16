import * as z from 'zod'
import { Role, Image } from '@prisma/client'

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    // image:Image,

    // role: z.enum([Role.ADMIN, Role.USER]),
    phone: z.optional(
      z
        .string()
        .regex(new RegExp('^09\\d{9}$'), {
          message: 'شماره موبایل معتبر نیست.',
        })
        .regex(
          new RegExp('^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'),
          {
            message: 'شماره موبایل معتبر نیست.',
          }
        )
    ),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false
      }

      return true
    },
    {
      message: 'رمز عبور جدید را وارد کنید!',
      path: ['newPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false
      }

      return true
    },
    {
      message: 'رمز عبور را وارد کنید!',
      path: ['password'],
    }
  )

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'حداقل 6 کاراکتر الزامی است.',
  }),
})

export const ResetSchema = z.object({
  phone: z
    .string()
    .regex(new RegExp('^09\\d{9}$'), {
      message: 'شماره موبایل معتبر نیست.',
    })
    .regex(new RegExp('^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'), {
      message: 'شماره موبایل معتبر نیست.',
    }),
})

export const LoginSchema = z.object({
  phone: z
    .string()
    .regex(new RegExp('^09\\d{9}$'), {
      message: 'شماره موبایل معتبر نیست.',
    })
    .regex(new RegExp('^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'), {
      message: 'شماره موبایل معتبر نیست.',
    }),
  password: z.string().min(6, {
    message: 'حداقل 6 کاراکتر الزامی است.',
  }),
})

export const RegisterSchema = z.object({
  phone: z
    .string()
    .regex(new RegExp('^09\\d{9}$'), {
      message: 'شماره موبایل معتبر نیست.',
    })
    .regex(new RegExp('^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'), {
      message: 'شماره موبایل معتبر نیست.',
    }),
  password: z.string().min(6, {
    message: 'حداقل 6 کاراکتر الزامی است.',
  }),
  name: z.string().min(1, {
    message: 'نام کاربری الزامی است',
  }),
})

export const PhoneSchema = RegisterSchema.pick({ phone: true })
