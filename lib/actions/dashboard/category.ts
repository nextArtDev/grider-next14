'use server'

import { auth } from '@/auth'
import { createStoreSchema, updateStoreSchema } from '../../schema/store'
import { prisma } from '../../prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Billboard, Category, Image, Store } from '@prisma/client'
import { createBillboardSchema } from '@/lib/schema/billboard'
import { deleteFileFromS3, uploadFileToS3 } from './s3Upload'
import { createCategorySchema } from '@/lib/schema/category'

interface CreateCategoryFormState {
  errors: {
    name?: string[]
    description?: string[]
    billboardId?: string[]
    image?: string[]
    _form?: string[]
  }
}
export async function createCategory(
  path: string,
  storeId: string,
  formState: CreateCategoryFormState,
  formData: FormData
): Promise<CreateCategoryFormState> {
  const result = createCategorySchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    image: formData.get('image'),
    billboardId: formData.get('billboardId'),
  })

  //   console.log(result)
  console.log(formData.get('billboardId'))

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
  if (!storeId) {
    return {
      errors: {
        _form: ['فروشگاه در دسترس نیست!'],
      },
    }
  }

  const categoryByBillboardId = await prisma.billboard.findFirst({
    where: {
      id: result.data.billboardId,
    },
  })
  if (!categoryByBillboardId) {
    return {
      errors: {
        _form: ['بیلبورد حذف شده است!'],
      },
    }
  }

  // console.log(result)

  let category: Category
  try {
    const isExisting = await prisma.category.findFirst({
      where: {
        name: result.data.name,
        storeId,
        billboardId: result.data.billboardId,
      },
    })
    if (isExisting) {
      return {
        errors: {
          _form: ['دسته‌بندی با این نام موجود است!'],
        },
      }
    }
    // console.log(isExisting)
    // console.log(billboard)

    const buffer = Buffer.from(await result.data.image.arrayBuffer())
    const res = await uploadFileToS3(buffer, result.data.image.name)

    category = await prisma.category.create({
      data: {
        name: result.data.name,
        imageId: res?.imageId,
        billboardId: result.data.billboardId,
        storeId,
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
  redirect(`/dashboard/${storeId}/categories`)
}
interface EditCategoryFormState {
  errors: {
    name?: string[]
    description?: string[]
    billboardId?: string[]
    image?: string[]
    _form?: string[]
  }
}
export async function editCategory(
  path: string,
  storeId: string,
  categoryId: string,
  formState: EditCategoryFormState,
  formData: FormData
): Promise<EditCategoryFormState> {
  const result = createCategorySchema.safeParse({
    name: formData.get('name'),
    image: formData.get('image'),
    billboardId: formData.get('billboardId'),
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
  if (!storeId || !categoryId) {
    return {
      errors: {
        _form: ['دسته‌بندی در دسترس نیست!'],
      },
    }
  }
  // console.log(result)

  try {
    const isExisting:
      | (Category & { billboard: { id: string } } & {
          image: { id: string; key: string } | null
        })
      | null = await prisma.category.findFirst({
      where: { id: categoryId, storeId },
      include: {
        image: { select: { id: true, key: true } },
        billboard: { select: { id: true } },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['دسته‌بندی حذف شده است!'],
        },
      }
    }
    const isNameExisting = await prisma.category.findFirst({
      where: {
        name: result.data.name,
        billboardId: result.data.billboardId,
        storeId,
      },
    })

    if (isNameExisting) {
      return {
        errors: {
          _form: ['دسته‌بندی با این نام موجود است!'],
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
    // console.log(res)
    await prisma.category.update({
      where: {
        id: categoryId,

        storeId,
      },
      data: {
        image: {
          disconnect: { id: isExisting.image?.id },
        },
        // billboard: {
        //   disconnect: { id: isExisting.billboard.id },
        // },
      },
    })
    await prisma.category.update({
      where: {
        id: categoryId,
        storeId,
      },
      data: {
        name: result.data.name,
        description: result.data.description,
        //   billboardId: result.data.billboardId,
        image: {
          connect: { id: res?.imageId },
        },
        billboard: {
          connect: { id: result.data.billboardId },
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
  redirect(`/dashboard/${storeId}/categories`)
}

//////////////////////

interface DeleteBillboardFormState {
  errors: {
    name?: string[]
    description?: string[]
    billboardId?: string[]
    image?: string[]
    _form?: string[]
  }
}

export async function deleteCategory(
  path: string,
  storeId: string,
  categoryId: string,
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
  if (!storeId || !categoryId) {
    return {
      errors: {
        _form: ['فروشگاه در دسترس نیست!'],
      },
    }
  }

  try {
    const isExisting:
      | (Category & { image: { id: string; key: string } | null })
      | null = await prisma.category.findFirst({
      where: { id: categoryId, storeId },
      include: {
        image: { select: { id: true, key: true } },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['دسته‌بندی حذف شده است!'],
        },
      }
    }

    // console.log(isExisting)
    // console.log(billboard)

    if (isExisting.image?.key) {
      const isDeletedFromS3 = await deleteFileFromS3(isExisting.image.key)
      // console.log(isDeletedFromS3)
    }

    const deleteBillboard = await prisma.category.delete({
      where: {
        id: categoryId,
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
  redirect(`/dashboard/${storeId}/categories`)
}
