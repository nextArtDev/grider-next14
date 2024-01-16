'use server'

import * as z from 'zod'
import { RegisterSchema } from '@/schemas'
import { sendSms, verifySms } from './sms'
import bcrypt from 'bcryptjs'
import { getUserById, getUserByPhoneNumber } from '@/data/user'
import { prisma } from '@/lib/prisma'

// import { db } from "@/lib/db";
// import { getUserByEmail } from "@/data/user";
// import { sendVerificationEmail } from "@/lib/mail";
// import { generateVerificationToken } from "@/lib/tokens";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'Invalid fields!' }
  }

  const { phone, password, name } = validatedFields.data

  const user = await getUserByPhoneNumber(phone)
  if (user && !user.isVerified) {
    return {
      error: 'شما قبلا ثبت نام کرده‌اید، لطفا به قسمت فعالسازی اکانت بروید.',
    }
  }
  if (user) {
    return { error: 'شما قبلا ثبت نام کرده‌اید.' }
  }

  const smsCode = await sendSms({ phone })

  if (smsCode?.error) {
    return { error: smsCode.error }
  }

  if (!smsCode?.verificationCode) {
    return { error: 'سرویس در دسترس نیست، لطفا بعدا دوباره امتحان کنید.' }
  }

  // console.log(smsCode?.success, smsCode?.verificationCode)

  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByPhoneNumber(phone)

  if (existingUser) {
    return { error: 'کاربر با این شماره تلفن وجود دارد.' }
  }

  await prisma.user.create({
    data: {
      name,
      phone,
      password: hashedPassword,
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
}

export const activation = async (values: {
  phone: string
  verificationCode: string
}) => {
  const { phone, verificationCode } = values

  const user = await getUserByPhoneNumber(phone)

  if (!user?.phone) {
    return { error: 'کاربر با این شماره وجود ندارد.' }
  }

  const smsVerification = await verifySms({ id: user.id, verificationCode })

  if (smsVerification?.error) {
    return { error: smsVerification.error }
  }

  // console.log(smsVerification)

  return { success: 'اکانت شما با موفقیت فعال شد.' }
}
