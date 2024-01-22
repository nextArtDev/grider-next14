'use server'

import { auth } from '@/auth'
import { createStoreSchema } from '../schema/store'
import { prisma } from '../prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Store } from '@prisma/client'

interface CreateStoreFormState {
  errors: {
    name?: string[]
    // description?: string[]
    _form?: string[]
  }
}
export async function createStore(
  path: string,
  formState: CreateStoreFormState,
  formData: FormData
): Promise<CreateStoreFormState> {
  const result = createStoreSchema.safeParse({
    name: formData.get('name'),
  })
  if (!result.success) {
    // console.log(result.error.flatten().fieldErrors.name)
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
  //   console.log(result)

  let store: Store
  try {
    store = await prisma.store.create({
      data: {
        name: result.data.name,
        userId: session.user.id,
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
  redirect(`/dashboard/${store.id}`)
}
// import type { Topic } from '@prisma/client'
// import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'
// import { z } from 'zod'
// import { auth } from '@/auth'
// import { db } from '@/db'
// import paths from '@/paths'

// const createTopicSchema = z.object({
//   name: z
//     .string()
//     .min(3)
//     .regex(/[a-z-]/, {
//       message: 'Must be lowercase letters or dashes without spaces',
//     }),
//   description: z.string().min(10),
// })

// interface CreateTopicFormState {
//   errors: {
//     name?: string[]
//     description?: string[]
//     // form level errors like: auth error, db failed or ...
//     // we add _ to avoid accidentally convolution with other form names
//     _form?: string[]
//   }
// }

// export async function createTopic(
//   formState: CreateTopicFormState,
//   formData: FormData
// ): Promise<CreateTopicFormState> {
//   const result = createTopicSchema.safeParse({
//     name: formData.get('name'),
//     description: formData.get('description'),
//   })

//   if (!result.success) {
//     return {
//       errors: result.error.flatten().fieldErrors,
//     }
//   }

//   const session = await auth()
//   if (!session || !session.user) {
//     return {
//       errors: {
//         _form: ['You must be signed in to do this.'],
//       },
//     }
//   }

//   let topic: Topic
//   try {
//     topic = await db.topic.create({
//       data: {
//         slug: result.data.name,
//         description: result.data.description,
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
//           _form: ['Something went wrong'],
//         },
//       }
//     }
//   }

//   revalidatePath('/')
//   redirect(paths.topicShow(topic.slug))
// }

// /**With bind*/
// export async function createPost(
//   slug:string,
//   formState:CreatePostFormState,
//   formData:FormData
// ):Promise<CreatePostFormState>{
//   return ...
// }
