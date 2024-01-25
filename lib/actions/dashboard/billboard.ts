'use server'

import { auth } from '@/auth'
import { createStoreSchema, updateStoreSchema } from '../../schema/store'
import { prisma } from '../../prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Billboard, Store } from '@prisma/client'
import {
  createBillboardSchema,
  imageUploadSchema,
} from '@/lib/schema/billboard'

interface CreateBillboardFormState {
  errors: {
    label?: string[]
    image?: string[]
    _form?: string[]
  }
}
export async function createBillboard(
  path: string,
  storeId: string,
  formState: CreateBillboardFormState,
  formData: FormData
): Promise<CreateBillboardFormState> {
  const result = createBillboardSchema.safeParse({
    label: formData.get('label'),
    image: formData.get('image'),
  })

  console.log(result)
  console.log(storeId)
  console.log(path)
  console.log(formData.get('image'))

  if (!result.success) {
    console.log(result.error.flatten().fieldErrors.image)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  const session = await auth()
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return {
      errors: {
        _form: ['شما اجازه دسترسی ندارید!'],
      },
    }
  }
  // console.log(result)

  let billboard: Billboard
  try {
    // const isExisting = await prisma.billboard.findFirst({
    //   where: { label: result.data.label, storeId },
    // })
    // if (isExisting) {
    //   return {
    //     errors: {
    //       _form: ['فروشگاه با این نام موجود است!'],
    //     },
    //   }
    // }
    // console.log(isExisting)
    billboard = await prisma.billboard.create({
      data: {
        label: result.data.label,
        storeId,
      },
    })
    console.log(billboard)
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
  redirect(`/dashboard/${storeId}/billboards`)
}

interface UploadImageFormState {
  urls: {}
  errors: {
    image?: string[]
    // description?: string[]
    _form?: string[]
  }
}
export async function uploadImage(
  formState: UploadImageFormState,
  formData: FormData
): Promise<UploadImageFormState> {
  const result = imageUploadSchema.safeParse({
    image: formData.get('image'),
  })
  const image = formData.get('image')
  console.log(result)
  console.log(image)

  if (!result.success) {
    console.log(result.error.flatten().fieldErrors.image)
    return {
      errors: result.error.flatten().fieldErrors,
      urls: {},
    }
  }
  return {
    errors: {},
    urls: { success: 'true' },
  }
}
