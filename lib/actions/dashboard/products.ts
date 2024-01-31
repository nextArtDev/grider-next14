'use server'

import { auth } from '@/auth'
import { createStoreSchema, updateStoreSchema } from '../../schema/store'
import { prisma } from '../../prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Billboard, Category, Image, Product, Store } from '@prisma/client'
import { createBillboardSchema } from '@/lib/schema/billboard'
import { deleteFileFromS3, uploadFileToS3 } from './s3Upload'
import { createCategorySchema, upImageSchema } from '@/lib/schema/category'
import * as z from 'zod'
import {
  createProductSchema,
  createServerProductSchema,
} from '@/lib/schema/product'

interface CreateProductFormState {
  success?: string
  errors: {
    name?: string[]
    description?: string[]
    billboardId?: string[]
    image?: string[]
    _form?: string[]
  }
}

export async function createProduct(
  formData: FormData,
  storeId: string,
  path: string
): Promise<CreateProductFormState> {
  const result = createServerProductSchema.safeParse({
    isbn: formData.get('isbn'),
    title: formData.get('title'),
    subTitle: formData.get('subTitle'),
    originalTitle: formData.get('originalTitle'),
    description: formData.get('description'),
    size: formData.get('size'),
    pages: formData.get('pages'),
    weight: formData.get('weight'),
    cover: formData.get('cover'),
    publishDate: formData.get('publishDate'),
    edition: formData.get('edition'),
    summary: formData.get('summary'),
    price: formData.get('price'),
    writerId: formData.getAll('writerId'),
    translatorId: formData.getAll('translatorId'),
    editorId: formData.getAll('editorId'),
    illustratorId: formData.getAll('illustratorId'),
    photographerId: formData.getAll('photographerId'),
    categoryId: formData.get('categoryId'),
    image: formData.getAll('image'),
    isFeatured: formData.get('isFeatured'),
    isArchived: formData.get('isArchived'),
  })
  // console.log(result)

  //   console.log(formData.getAll('writerId'))
  //   console.log(formData.get('categoryId'))
  //   console.log(formData.get('price'))
  //   console.log(formData.getAll('image'))
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

  const category = await prisma.category.findFirst({
    where: {
      id: result.data.categoryId,
    },
  })
  if (!category) {
    return {
      errors: {
        _form: ['دسته‌بندی حذف شده است!'],
      },
    }
  }

  //   // console.log(result)

  let product: Product
  try {
    const isExisting = await prisma.product.findFirst({
      where: {
        isbn: result.data.isbn,
        title: result.data.title,
        storeId,
        categoryId: result.data.categoryId,
      },
    })
    if (isExisting) {
      return {
        errors: {
          _form: ['کتاب با این نام و شابک موجود است!'],
        },
      }
    }
    //     // console.log(isExisting)
    //     // console.log(billboard)
    const isFeaturedBoolean = result.data.isFeatured == 'true'
    const isArchivedBoolean = result.data.isArchived == 'true'

    let imageIds: string[] = []
    for (let img of result.data?.image || []) {
      const buffer = Buffer.from(await img.arrayBuffer())
      const res = await uploadFileToS3(buffer, img.name)

      if (res?.imageId && typeof res.imageId === 'string') {
        imageIds.push(res.imageId)
      }
    }
    console.log(imageIds)
    // console.log('data', result.data)
    product = await prisma.product.create({
      data: {
        isbn: result.data.isbn,
        title: result.data.title,
        subTitle: result.data.subTitle,
        originalTitle: result.data.originalTitle,
        description: result.data.description,
        size: result.data.size,
        pages: result.data.pages,
        weight: result.data.weight,
        cover: result.data.cover,
        publishDate: result.data.publishDate,
        edition: result.data.edition,
        summary: result.data.summary,
        categoryId: result.data.categoryId,
        isArchived: isArchivedBoolean,
        isFeatured: isFeaturedBoolean,
        price: +result.data.price,
        images: {
          connect: imageIds.map((id) => ({
            id: id,
          })),
        },
        storeId,
        writer: {
          connect: result.data.writerId?.map((id) => ({ id: id })),
        },
        translator: {
          connect: result.data.translatorId?.map((id) => ({ id: id })),
        },
        editor: {
          connect: result.data.editorId?.map((id) => ({ id: id })),
        },
        photographer: {
          connect: result.data.photographerId?.map((id) => ({ id: id })),
        },
        illustrator: {
          connect: result.data.illustratorId?.map((id) => ({ id: id })),
        },
      },
    })
    // console.log({ product })
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
  redirect(`/dashboard/${storeId}/products`)
}

export async function editProduct(
  formData: FormData,
  storeId: string,
  productId: string,
  path: string
): Promise<CreateProductFormState> {
  const result = createServerProductSchema.safeParse({
    isbn: formData.get('isbn'),
    title: formData.get('title'),
    subTitle: formData.get('subTitle'),
    originalTitle: formData.get('originalTitle'),
    description: formData.get('description'),
    size: formData.get('size'),
    pages: formData.get('pages'),
    weight: formData.get('weight'),
    cover: formData.get('cover'),
    publishDate: formData.get('publishDate'),
    edition: formData.get('edition'),
    summary: formData.get('summary'),
    price: formData.get('price'),
    writerId: formData.getAll('writerId'),
    translatorId: formData.getAll('translatorId'),
    editorId: formData.getAll('editorId'),
    illustratorId: formData.getAll('illustratorId'),
    photographerId: formData.getAll('photographerId'),
    categoryId: formData.get('categoryId'),
    image: formData.getAll('image'),
    isFeatured: formData.get('isFeatured'),
    isArchived: formData.get('isArchived'),
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
  if (!storeId || !productId) {
    return {
      errors: {
        _form: ['دسته‌بندی در دسترس نیست!'],
      },
    }
  }
  // console.log(result)

  try {
    let product: Product
    const isExisting = await prisma.product.findFirst({
      where: {
        id: productId,
        // isbn: result.data.isbn,
        // title: result.data.title,
        storeId,
      },
      include: {
        images: true,
        writer: true,
        translator: true,
        editor: true,
        photographer: true,
        illustrator: true,
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['کتاب حذف شده است!!'],
        },
      }
    }

    const isFeaturedBoolean = result.data.isFeatured == 'true'
    const isArchivedBoolean = result.data.isArchived == 'true'

    const isNameExisting = await prisma.product.findFirst({
      where: {
        title: result.data.title,
        isbn: result.data.isbn,
        categoryId: result.data.categoryId,
        storeId,
        NOT: { id: productId },
      },
    })

    if (isNameExisting) {
      return {
        errors: {
          _form: ['این کتاب موجود است!'],
        },
      }
    }
    await prisma.product.update({
      where: {
        id: productId,
        storeId,
      },
      data: {
        writer: {
          disconnect: isExisting.writer.map((writer: { id: string }) => ({
            id: writer.id,
          })),
        },
        translator: {
          disconnect: isExisting.translator.map(
            (translator: { id: string }) => ({
              id: translator.id,
            })
          ),
        },
        editor: {
          disconnect: isExisting.editor.map((editor: { id: string }) => ({
            id: editor.id,
          })),
        },
        photographer: {
          disconnect: isExisting.photographer.map(
            (photographer: { id: string }) => ({
              id: photographer.id,
            })
          ),
        },
        illustrator: {
          disconnect: isExisting.illustrator.map(
            (illustrator: { id: string }) => ({
              id: illustrator.id,
            })
          ),
        },
      },
    })

    // console.log(isExisting)
    // console.log(billboard)
    if (
      typeof result.data.image[0] === 'object' &&
      result.data.image[0] instanceof File
    ) {
      let imageIds: string[] = []
      for (let img of result.data.image) {
        const buffer = Buffer.from(await img.arrayBuffer())
        const res = await uploadFileToS3(buffer, img.name)

        if (res?.imageId && typeof res.imageId === 'string') {
          imageIds.push(res.imageId)
        }
      }
      // const buffer = Buffer.from(await result.data.image.arrayBuffer())
      // const res = await uploadFileToS3(buffer, result.data.image.name)

      // if (isExisting.image?.key) {
      //   await deleteFileFromS3(isExisting.image.key)
      //   // console.log(isDeletedFromS3)
      // }
      // console.log(res)
      await prisma.product.update({
        where: {
          id: productId,

          storeId,
        },
        data: {
          images: {
            //  connect: result.data.writerId?.map((id) => ({ id: id })),
            disconnect: isExisting.images.map((image: { id: string }) => ({
              id: image.id,
            })),
          },
        },
      })
      await prisma.product.update({
        where: {
          id: productId,
          storeId,
        },
        data: {
          isbn: result.data.isbn,
          title: result.data.title,
          subTitle: result.data.subTitle,
          originalTitle: result.data.originalTitle,
          description: result.data.description,
          size: result.data.size,
          pages: result.data.pages,
          weight: result.data.weight,
          cover: result.data.cover,
          publishDate: result.data.publishDate,
          edition: result.data.edition,
          summary: result.data.summary,
          categoryId: result.data.categoryId,
          isArchived: isArchivedBoolean,
          isFeatured: isFeaturedBoolean,
          price: +result.data.price,
          images: {
            connect: imageIds.map((id) => ({
              id: id,
            })),
          },
          storeId,
          writer: {
            connect: result.data.writerId?.map((id) => ({ id: id })),
          },
          translator: {
            connect: result.data.translatorId?.map((id) => ({ id: id })),
          },
          editor: {
            connect: result.data.editorId?.map((id) => ({ id: id })),
          },
          photographer: {
            connect: result.data.photographerId?.map((id) => ({ id: id })),
          },
          illustrator: {
            connect: result.data.illustratorId?.map((id) => ({ id: id })),
          },
        },
      })
    } else {
      await prisma.product.update({
        where: {
          id: productId,
          storeId,
        },
        data: {
          isbn: result.data.isbn,
          title: result.data.title,
          subTitle: result.data.subTitle,
          originalTitle: result.data.originalTitle,
          description: result.data.description,
          size: result.data.size,
          pages: result.data.pages,
          weight: result.data.weight,
          cover: result.data.cover,
          publishDate: result.data.publishDate,
          edition: result.data.edition,
          summary: result.data.summary,
          categoryId: result.data.categoryId,
          isArchived: isArchivedBoolean,
          isFeatured: isFeaturedBoolean,
          price: +result.data.price,
          // images: result.data.image,
          storeId,
          writer: {
            connect: result.data.writerId?.map((id) => ({ id: id })),
          },
          translator: {
            connect: result.data.translatorId?.map((id) => ({ id: id })),
          },
          editor: {
            connect: result.data.editorId?.map((id) => ({ id: id })),
          },
          photographer: {
            connect: result.data.photographerId?.map((id) => ({ id: id })),
          },
          illustrator: {
            connect: result.data.illustratorId?.map((id) => ({ id: id })),
          },
        },
      })
    }

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
  redirect(`/dashboard/${storeId}/products`)
}

//////////////////////

interface DeleteProductFormState {
  errors: {
    name?: string[]
    description?: string[]
    billboardId?: string[]
    image?: string[]
    _form?: string[]
  }
}

export async function deleteProduct(
  path: string,
  storeId: string,
  productId: string,
  formState: DeleteProductFormState,
  formData: FormData
): Promise<DeleteProductFormState> {
  // console.log({ path, storeId, categoryId })
  const session = await auth()
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return {
      errors: {
        _form: ['شما اجازه دسترسی ندارید!'],
      },
    }
  }
  // console.log(result)
  if (!storeId || !productId) {
    return {
      errors: {
        _form: ['کتاب در دسترس نیست!'],
      },
    }
  }

  try {
    const isExisting:
      | (Product & { image: { id: string; key: string } | null })
      | null = await prisma.product.findFirst({
      where: { id: productId, storeId },
      include: {
        images: { select: { id: true, key: true } },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['کتاب حذف شده است!'],
        },
      }
    }

    console.log(isExisting)
    // console.log(billboard)
    for (let image of isExisting.images) {
      if (image.key) {
        await deleteFileFromS3(image.key)
      }
    }

    await prisma.product.delete({
      where: {
        id: productId,
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
  redirect(`/dashboard/${storeId}/products`)
}
