'use server'

import { auth } from '@/auth'
import { createStoreSchema, updateStoreSchema } from '../../schema/store'
import { prisma } from '../../prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Billboard, Category, Contributor, Image, Store } from '@prisma/client'
import { createBillboardSchema } from '@/lib/schema/billboard'
import { deleteFileFromS3, uploadFileToS3 } from './s3Upload'
import { createCategorySchema, upImageSchema } from '@/lib/schema/category'
import * as z from 'zod'
import { createContributeSchema } from '@/lib/schema/contribute'

interface CreateContributeFormState {
  success?: string
  errors: {
    name?: string[]
    bio?: string[]
    contributes?: string[]
    image?: string[]
    _form?: string[]
  }
}
enum ContributorRole {
  Writer = 'Writer',
  Translator = 'Translator',
  Editor = 'Editor',
  Illustrator = 'Illustrator',
  Photographer = 'Photographer',
}

const stringToEnum: { [key: string]: ContributorRole } = {
  Writer: ContributorRole.Writer,
  Translator: ContributorRole.Translator,
  Editor: ContributorRole.Editor,
  Illustrator: ContributorRole.Illustrator,
  Photographer: ContributorRole.Photographer,
}

function convertRoles(roles: string[]): ContributorRole[] {
  return roles.map((role) => stringToEnum[role])
}

// const inputRoles = ['Writer', 'Translator', 'Editor'];

// const roles = inputRoles.map((role) => {
//   if (Object.values(ContributorRole).includes(role)) {
//     return role as ContributorRole;
//   } else {
//     throw new Error(Invalid role: ${role});
//   }
// });

export async function createContributor(
  formData: FormData,
  storeId: string,
  path: string
): Promise<CreateContributeFormState> {
  const result = createContributeSchema.safeParse({
    name: formData.get('name'),
    bio: formData.get('bio'),
    image: formData.get('image'),
    contributes: formData.getAll('contributes'),
  })
  if (!result.success) {
    // console.log(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }
  // console.log(result?.data)

  //   const roles = Object.values(ContributorRole)
  //     .filter((value) => typeof value === 'string')
  //     .filter((value) => result.data.contributes.includes(value))
  //   const roles = result.data.contributes.map(
  //     (roleString) => `ContributorRole.${roleString}`
  //   )

  //   const roles = result.data.contributes.map(
  //     (roleString) => ContributorRole[roleString]
  //   )
  //   const role = result.data.contributes.map((ro) => eval(ro))
  const roles = convertRoles(result.data.contributes)
  // console.log(roles)

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

  let contributor: Contributor
  try {
    const isExisting = await prisma.contributor.findFirst({
      where: {
        name: result.data.name,
        storeId,
      },
    })
    if (isExisting) {
      return {
        errors: {
          _form: ['شخص با این نام موجود است!'],
        },
      }
    }

    const buffer = Buffer.from(await result.data.image.arrayBuffer())
    const res = await uploadFileToS3(buffer, result.data.image.name)

    contributor = await prisma.contributor.create({
      data: {
        name: result.data.name,
        imageId: res?.imageId,
        bio: result.data.bio,
        storeId,
        role: roles,
      },
    })
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
  redirect(`/dashboard/${storeId}/contributors`)
}

export async function updateContributor(
  formData: FormData,
  storeId: string,
  contributeId: string,
  path: string
): Promise<CreateContributeFormState> {
  const result = createContributeSchema.safeParse({
    name: formData.get('name'),
    bio: formData.get('bio'),
    image: formData.get('image'),
    contributes: formData.getAll('contributes'),
  })

  // console.log(result)
  // console.log(formData.get('image'))

  if (!result.success) {
    // console.log(result.error.flatten().fieldErrors)
    return {
      errors: result.error.flatten().fieldErrors,
    }
  }

  const roles = convertRoles(result.data.contributes)

  const session = await auth()
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return {
      errors: {
        _form: ['شما اجازه دسترسی ندارید!'],
      },
    }
  }
  if (!storeId || !contributeId) {
    return {
      errors: {
        _form: ['دسته‌بندی در دسترس نیست!'],
      },
    }
  }
  // console.log(result)

  try {
    const isExisting:
      | (Contributor & {
          image: { id: string; key: string } | null
        })
      | null = await prisma.contributor.findFirst({
      where: { id: contributeId, storeId },
      include: {
        image: { select: { id: true, key: true } },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['فعالیت حذف شده است!'],
        },
      }
    }
    const isNameExisting = await prisma.contributor.findFirst({
      where: {
        name: result.data.name,
        storeId,
        NOT: { id: contributeId },
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
    if (
      typeof result.data.image === 'object' &&
      result.data.image instanceof File
    ) {
      const buffer = Buffer.from(await result.data.image.arrayBuffer())
      const res = await uploadFileToS3(buffer, result.data.image.name)

      if (isExisting.image?.key) {
        await deleteFileFromS3(isExisting.image.key)
        // console.log(isDeletedFromS3)
      }
      // console.log(res)
      await prisma.contributor.update({
        where: {
          id: contributeId,

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
      await prisma.contributor.update({
        where: {
          id: contributeId,
          storeId,
        },
        data: {
          name: result.data.name,
          bio: result.data.bio,
          role: roles,
          //   billboardId: result.data.billboardId,
          image: {
            connect: { id: res?.imageId },
          },
        },
      })
    } else {
      await prisma.contributor.update({
        where: {
          id: contributeId,
          storeId,
        },
        data: {
          name: result.data.name,
          bio: result.data.bio,
          role: roles,
        },
      })
    }
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
  redirect(`/dashboard/${storeId}/contributors`)
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

export async function deleteContributes(
  path: string,
  storeId: string,
  contributeId: string,
  formState: DeleteBillboardFormState,
  formData: FormData
): Promise<DeleteBillboardFormState> {
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
  if (!storeId || !contributeId) {
    return {
      errors: {
        _form: ['فروشگاه در دسترس نیست!'],
      },
    }
  }

  try {
    const isExisting:
      | (Contributor & { image: { id: string; key: string } | null })
      | null = await prisma.contributor.findFirst({
      where: { id: contributeId, storeId },
      include: {
        image: { select: { id: true, key: true } },
      },
    })
    if (!isExisting) {
      return {
        errors: {
          _form: ['فعال حذف شده است!'],
        },
      }
    }

    // console.log(isExisting)
    // console.log(billboard)

    if (isExisting.image?.key) {
      await deleteFileFromS3(isExisting.image.key)
      // console.log(isDeletedFromS3)
    }

    const deleteBillboard = await prisma.contributor.delete({
      where: {
        id: contributeId,
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
  redirect(`/dashboard/${storeId}/contributors`)
}
