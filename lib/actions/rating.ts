'use server'

import { auth } from '@/auth'
import { prisma } from '../prisma'
import { createReviewSchema } from '../schema/review'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

interface CreateReviewFormState {
  errors: {
    comment?: string[]
    rating?: string[]
    _form?: string[]
  }
}

export async function createReview(
  formData: FormData,
  path: string,
  userId: string,
  productId: string
): Promise<CreateReviewFormState> {
  const result = createReviewSchema.safeParse({
    comment: formData.get('comment'),
    rating: formData.get('rating'),
  })
  if (!result.success) {
    console.log(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  const session = await auth()
  if (!session || !session.user) {
    return {
      errors: {
        _form: ['شما عضو نیستید!'],
      },
    }
  }
  if (!productId) {
    return {
      errors: {
        _form: ['لطفا بعدا امتحان کنید!'],
      },
    }
  }

  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      storeId: process.env.STORE_ID,
    },
  })
  const contributor = await prisma.contributor.findFirst({
    where: {
      id: productId,
      storeId: process.env.STORE_ID,
    },
  })

  let reviewId
  if (product?.id) {
    reviewId === product.id
  } else if (contributor?.id) {
    reviewId === contributor.id
  } else {
    return {
      errors: {
        _form: ['صفحه حذف شده است!'],
      },
    }
  }

  try {
    if (product?.id) {
      const alreadyRated = await prisma.review.findFirst({
        where: {
          productId,
          storeId: process.env.STORE_ID!,
          userId,
        },
      })
      if (alreadyRated) {
        return {
          errors: {
            _form: ['شما قبلا نظر خود را ثبت کرده‌اید!'],
          },
        }
      }

      const review = await prisma.review.create({
        data: {
          comment: result.data.comment,
          rating: +result.data.rating,
          userId: session.user.id,
          productId: product.id,
          storeId: process.env.STORE_ID!,
        },
      })
    } else if (contributor?.id) {
      const alreadyRated = await prisma.review.findFirst({
        where: {
          contributorId: contributor.id,
          storeId: process.env.STORE_ID!,
          userId,
        },
      })
      if (alreadyRated) {
        return {
          errors: {
            _form: ['شما قبلا نظر خود را ثبت کرده‌اید!'],
          },
        }
      }

      const review = await prisma.review.create({
        data: {
          comment: result.data.comment,
          rating: +result.data.rating,
          userId: session.user.id,
          contributorId: contributor.id,
          storeId: process.env.STORE_ID!,
        },
      })
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      }
    } else {
      return {
        errors: {
          _form: ['مشکلی پیش آمده، لطفا دوباره امتحان کنید!'],
        },
      }
    }
  }
  revalidatePath(path)
  redirect(path)
}
// export async function createContributorReview(
//   formData: FormData,
//   path: string,
//   userId: string,
//   productId: string
// ): Promise<CreateReviewFormState> {
//   const result = createReviewSchema.safeParse({
//     comment: formData.get('comment'),
//     rating: formData.get('rating'),
//   })
//   if (!result.success) {
//     console.log(result.error.flatten().fieldErrors)
//     return {
//       errors: result.error.flatten().fieldErrors,
//     }
//   }
//   const session = await auth()
//   if (!session || !session.user) {
//     return {
//       errors: {
//         _form: ['شما عضو نیستید!'],
//       },
//     }
//   }
//   if (!productId) {
//     return {
//       errors: {
//         _form: ['لطفا بعدا امتحان کنید!'],
//       },
//     }
//   }

//   const product = await prisma.product.findFirst({
//     where: {
//       id: productId,
//       storeId: process.env.STORE_ID,
//     },
//   })
//   if (!product) {
//     return {
//       errors: {
//         _form: ['صفحه حذف شده است!'],
//       },
//     }
//   }

//   const alreadyRated = await prisma.review.findFirst({
//     where: {
//       productId,
//       storeId: process.env.STORE_ID!,
//       userId,
//     },
//   })
//   if (alreadyRated) {
//     return {
//       errors: {
//         _form: ['شما قبلا نظر خود را ثبت کرده‌اید!'],
//       },
//     }
//   }

//   try {
//     const review = await prisma.review.create({
//       data: {
//         comment: result.data.comment,
//         rating: +result.data.rating,
//         userId: session.user.id,
//         productId,
//         storeId: process.env.STORE_ID!,
//       },
//     })
//   } catch (err: unknown) {
//     if (err instanceof Error) {
//       return {
//         errors: {
//           _form: [err.message],
//         },
//       }
//     } else {
//       return {
//         errors: {
//           _form: ['مشکلی پیش آمده، لطفا دوباره امتحان کنید!'],
//         },
//       }
//     }
//   }
//   revalidatePath(path)
//   redirect(path)
// }
