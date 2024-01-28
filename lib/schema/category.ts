import { z } from 'zod'

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, { message: 'نام دسته‌بندی باید بیش از یک حرف باشد.' })
    .regex(/^[\u0600-\u06FFa-zA-Z0-9_ ]+$/, {
      message: 'تنها حروف، اعداد و آندرلاین برای اسم مجاز است.',
    })
    .max(128, { message: 'نام دسته‌بندی نمی‌تواند بیش از 128 حرف باشد.' }),
  description: z.string().optional(),
  billboardId: z.string().min(1, { message: ' بیلبورد نمی‌تواند خالی باشد.' }),
  image: z.any().refine((files) => !!files, {
    message: 'قسمت عکس نمی‌تواند خالی باشد.',
  }),
  // .refine((files) => {
  //   return files?.size <= MAX_FILE_SIZE
  // }, `حجم عکس از 5 مگابایت بیشتر است!`)
  // .refine(
  //   (files) => ACCEPTED_IMAGE_TYPES.includes(files?.type),
  //   // 'Only .jpg, .jpeg, .png and .webp formats are supported.'
  //   'تنها فرمتهای قابل پشتیبانی .jpg .jpeg .png و webp هستند.'
  // ),
})
export const upImageSchema = z.object({
  image: z
    .any()
    .refine((files) => !!files, {
      message: 'قسمت عکس نمی‌تواند خالی باشد.',
    })
    .refine((files) => {
      return files?.size <= MAX_FILE_SIZE
    }, `حجم عکس از 5 مگابایت بیشتر است!`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.type),
      // 'Only .jpg, .jpeg, .png and .webp formats are supported.'
      'تنها فرمتهای قابل پشتیبانی .jpg .jpeg .png و webp هستند.'
    ),
})
