'use server'

import { PhoneSchema } from '@/schemas'
import TrezSMSClient from 'trez-sms-client'
import { z } from 'zod'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { getUserById, getUserByPhoneNumber } from '@/data/user'

export const sendSms = async (values: z.infer<typeof PhoneSchema>) => {
  const verificationCode = crypto.randomInt(100123, 999879)

  const validatedFields = PhoneSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'شماره نامعتبر است.' }
  }

  const { phone } = validatedFields.data

  const client = new TrezSMSClient(
    process.env.SMS_USERNAME!,
    process.env.SMS_PASSWORD!
  )

  try {
    console.log({ phone, verificationCode })
    // const messageId = await client.manualSendCode(
    //   phone,
    //   `کد تایید شما: ${
    //     verificationCode as number
    //   } \n مدت اعتبار این کد ۲ دقیقه می‌باشد`
    // )

    // if (messageId <= 2000) {
    //   return {
    //     error: 'ارسال کد تایید با خطا مواجه شد لطفا دوباره تلاش نمایید',
    //     // verificationCode: null,
    //   }
    // }
    return { success: 'کد تایید به شماره شما ارسال شد.', verificationCode }
  } catch (error) {
    console.log(error)
  }
}

interface VerifySmsType {
  id: string
  verificationCode: string
}

export const verifySms = async (values: VerifySmsType) => {
  const { id, verificationCode } = values

  // console.log(verificationCode)

  if (
    verificationCode.length > 6 ||
    !verificationCode ||
    verificationCode.length < 6
  ) {
    return { error: 'کد نامعتبر است.' }
  }

  try {
    const user = await getUserById(id)
    if (!user) {
      return { error: 'شما هنوز ثبت نام نکرده‌اید.' }
    }

    if (user.verificationCode !== +verificationCode) {
      return { error: 'کد تایید اشتباه است.' }
    }
    if (!user.verificationDate) {
      return { error: 'کد ارسالی معتبر نیست.' }
    }
    const verificationDate = new Date(
      user.verificationDate.getTime() + 120 * 1000
    )
    if (verificationDate < new Date()) {
      user.verificationCode = null
      user.verificationDate = null
      return {
        error: 'کد تایید منقضی شده است.',
      }
    }

    await prisma.user.update({
      where: { id },
      data: {
        isVerified: true,
        verificationCode: +verificationCode,
        verificationDate: new Date(),
      },
    })
    return { success: 'حساب کاربری شما با موفقیت فعال شد.' }
  } catch (error) {
    console.log(error)
  }
}
