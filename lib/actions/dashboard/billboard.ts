'use server'

import { auth } from '@/auth'
import { createStoreSchema, updateStoreSchema } from '../../schema/store'
import { prisma } from '../../prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Billboard, Image, Store } from '@prisma/client'
import { createBillboardSchema } from '@/lib/schema/billboard'
import { deleteFileFromS3, uploadFileToS3 } from './s3Upload'

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

  // console.log(result)
  // console.log(formData.get('image'))

  if (!result.success) {
    console.log(result.error.flatten().fieldErrors)
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
    const isExisting = await prisma.billboard.findFirst({
      where: { label: result.data.label, storeId },
    })
    if (isExisting) {
      return {
        errors: {
          _form: ['بیلبورد با این نام موجود است!'],
        },
      }
    }
    // console.log(isExisting)
    // console.log(billboard)

    const buffer = Buffer.from(await result.data.image.arrayBuffer())
    const res = await uploadFileToS3(buffer, result.data.image.name)

    billboard = await prisma.billboard.create({
      data: {
        label: result.data.label,
        storeId,
        imageId: res?.imageId,
      },
    })
    // console.log(res?.url)
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
interface EditBillboardFormState {
  errors: {
    label?: string[]
    image?: string[]
    _form?: string[]
  }
}
export async function editBillboard(
  path: string,
  storeId: string,
  billboardId: string,
  formState: EditBillboardFormState,
  formData: FormData
): Promise<EditBillboardFormState> {
  const result = createBillboardSchema.safeParse({
    label: formData.get('label'),
    image: formData.get('image'),
  })

  // console.log(result)
  // console.log(formData.get('image'))

  if (!result.success) {
    // console.log(result.error.flatten().fieldErrors)
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
    const isExisting:
      | (Billboard & { image: { id: string; key: string } | null })
      | null = await prisma.billboard.findFirst({
      where: { id: billboardId, storeId },
      include: {
        image: { select: { id: true, key: true } },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['بیلبورد حذف شده است!'],
        },
      }
    }

    // console.log(isExisting)
    // console.log(billboard)

    if (isExisting.image?.key) {
      const isDeletedFromS3 = await deleteFileFromS3(isExisting.image.key)
      // console.log(isDeletedFromS3)
    }

    const buffer = Buffer.from(await result.data.image.arrayBuffer())
    const res = await uploadFileToS3(buffer, result.data.image.name)
    console.log(res)
    await prisma.billboard.update({
      where: {
        id: billboardId,
        storeId,
      },
      data: {
        image: {
          disconnect: { id: isExisting.image?.id },
        },
      },
    })
    billboard = await prisma.billboard.update({
      where: {
        id: billboardId,
        storeId,
      },
      data: {
        label: result.data.label,
        image: {
          connect: { id: res?.imageId },
        },
      },
    })
    // imageId: res?.imageId,
    // console.log(billboard)
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

//////////////////////

interface DeleteBillboardFormState {
  errors: {
    label?: string[]
    image?: string[]
    _form?: string[]
  }
}

export async function deleteBillboard(
  path: string,
  storeId: string,
  billboardId: string,
  formState: DeleteBillboardFormState,
  formData: FormData
): Promise<DeleteBillboardFormState> {
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
    const isExisting:
      | (Billboard & { image: { id: string; key: string } | null })
      | null = await prisma.billboard.findFirst({
      where: { id: billboardId, storeId },
      include: {
        image: { select: { id: true, key: true } },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['بیلبورد حذف شده است!'],
        },
      }
    }

    // console.log(isExisting)
    // console.log(billboard)

    if (isExisting.image?.key) {
      const isDeletedFromS3 = await deleteFileFromS3(isExisting.image.key)
      // console.log(isDeletedFromS3)
    }

    const deleteBillboard = await prisma.billboard.delete({
      where: {
        id: billboardId,
        storeId,
      },
    })

    // imageId: res?.imageId,
    // console.log(deleteBillboard)
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
