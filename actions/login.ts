'use server'

import * as z from 'zod'
import { AuthError } from 'next-auth'
import { LoginSchema } from '@/schemas'

// import { db } from "@/lib/db";
import { signIn } from '@/auth'
// import { getUserByEmail } from "@/data/user";
// import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
// import {
//   sendVerificationEmail,
//   sendTwoFactorTokenEmail,
// } from "@/lib/mail";
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { getUserByPhoneNumber } from '@/data/user'
import { sendSms, verifySms } from './sms'
// import {
//   generateVerificationToken,
//   generateTwoFactorToken
// } from "@/lib/tokens";
// import {
//   getTwoFactorConfirmationByUserId
// } from "@/data/two-factor-confirmation";

export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validatedFields = LoginSchema.safeParse(values)

  if (!validatedFields.success) {
    return { error: 'ورودی معتبر نیست!' }
  }
  // return { success: 'Email sent!' }
  const { phone, password } = validatedFields.data

  const existingUser = await getUserByPhoneNumber(phone)
  if (!existingUser || !existingUser.phone || !existingUser.password) {
    return { error: 'کاربر با این شماره موجود نیست!' }
  }

  if (!existingUser.isVerified) {
    return { error: 'شما اکانت خود را از طریق کد ارسال شده فعال نکرده‌اید.' }
    //   const smsCode = await sendSms({ phone: existingUser.phone })

    //   if (!smsCode?.error && smsCode?.verificationCode) {

    //     const smsVerification = await verifySms({
    //       id: existingUser.id,
    //       verificationCode: JSON.stringify(smsCode.verificationCode),
    //     })
    //   }

    //   // await sendVerificationEmail(
    //   //   verificationToken.email,
    //   //   verificationToken.token
    //   // )

    //   // return { success: 'Confirmation email sent!' }
  }

  // if (existingUser.isTwoFactorEnabled && existingUser.email) {
  //   if (code) {
  //     const twoFactorToken = await getTwoFactorTokenByEmail(
  //       existingUser.email
  //     );

  //     if (!twoFactorToken) {
  //       return { error: "Invalid code!" };
  //     }

  //     if (twoFactorToken.token !== code) {
  //       return { error: "Invalid code!" };
  //     }

  //     const hasExpired = new Date(twoFactorToken.expires) < new Date();

  //     if (hasExpired) {
  //       return { error: "Code expired!" };
  //     }

  //     await db.twoFactorToken.delete({
  //       where: { id: twoFactorToken.id }
  //     });

  //     const existingConfirmation = await getTwoFactorConfirmationByUserId(
  //       existingUser.id
  //     );

  //     if (existingConfirmation) {
  //       await db.twoFactorConfirmation.delete({
  //         where: { id: existingConfirmation.id }
  //       });
  //     }

  //     await db.twoFactorConfirmation.create({
  //       data: {
  //         userId: existingUser.id,
  //       }
  //     });
  //   } else {
  //     const twoFactorToken = await generateTwoFactorToken(existingUser.email)
  //     await sendTwoFactorTokenEmail(
  //       twoFactorToken.email,
  //       twoFactorToken.token,
  //     );

  //     return { twoFactor: true };
  //   }
  // }

  try {
    await signIn('credentials', {
      phone,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'مشخصات نامعتبر است!' }
        default:
          return { error: 'مشکلی پیش آمده، لطفا دوباره امتحان کنید!' }
      }
    }

    throw error
  }
}
