'use server'

import * as z from 'zod'
import { NewPasswordSchema, RegisterSchema, ResetSchema } from '@/schemas'
import { sendSms, verifySms } from './sms'
import bcrypt from 'bcryptjs'
import { getUserById, getUserByPhoneNumber } from '@/data/user'
import { prisma } from '@/lib/prisma'
import { auth, signIn } from '@/auth'

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { phone } = validatedFields.data
  try {
    const user = await getUserByPhoneNumber(phone)
    if (user && !user.isVerified) {
      return {
        error: 'شما قبلا ثبت نام کرده‌اید، لطفا به قسمت فعالسازی اکانت بروید.',
      }
    }
    if (!user) {
      return { error: 'شما هنوز ثبت نام نکرده‌اید.' }
    }

    const smsCode = await sendSms({ phone })

    if (smsCode?.error) {
      return { error: smsCode.error }
    }

    if (!smsCode?.verificationCode) {
      return { error: 'سرویس در دسترس نیست، لطفا بعدا دوباره امتحان کنید.' }
    }

    //   const existingUser = await getUserByPhoneNumber(phone)

    //   if (existingUser) {
    //     return { error: 'کاربر با این شماره تلفن وجود دارد.' }
    //   }

    await prisma.user.update({
      where: { phone },
      data: {
        phone,
        verificationCode: smsCode.verificationCode,
        verificationDate: new Date(),
      },
    })
    // const verificationCode = await verifySms(phone, smsCode.verificationCode)

    // const verificationToken = await generateVerificationToken(email);
    // await sendVerificationEmail(
    //   verificationToken.email,
    //   verificationToken.token,
    // );

    return { success: 'کد تایید به شماره شما ارسال شد.', phone }
  } catch (error) {}
}

interface ResetPassProps {
  values: z.infer<typeof NewPasswordSchema>
  phone: string
}
export const resetPass = async ({ values, phone }: ResetPassProps) => {
  const validatedFields = NewPasswordSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { password } = validatedFields.data

  try {
    const user = await getUserByPhoneNumber(phone)
    if (user && !user.isVerified) {
      return {
        error: 'شما قبلا ثبت نام کرده‌اید، لطفا به قسمت فعالسازی اکانت بروید.',
      }
    }
    if (!user) {
      return { error: 'شما هنوز ثبت نام نکرده‌اید.' }
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    //   const existingUser = await getUserByPhoneNumber(phone)

    //   if (existingUser) {
    //     return { error: 'کاربر با این شماره تلفن وجود دارد.' }
    //   }

    await prisma.user.update({
      where: { phone },
      data: {
        password: hashedPassword,
      },
    })
    await signIn('credentials', {
      redirect: false, // Do not redirect after signin
      phone,
      password: values.password,
    })

    // const verificationCode = await verifySms(phone, smsCode.verificationCode)

    // const verificationToken = await generateVerificationToken(email);
    // await sendVerificationEmail(
    //   verificationToken.email,
    //   verificationToken.token,
    // );

    return { success: 'رمز عبور شما با موفقیت تغییر کرد.', phone }
  } catch (error) {}
}
