import { z } from 'zod'

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

const ContributorEnum = z.enum([
  'Writer',
  'Translator',
  'Editor',
  'Illustrator',
  'Photographer',
])

export const createContributeSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'نام دسته‌بندی باید بیش از یک حرف باشد.' })
    .regex(/^[\u0600-\u06FFa-zA-Z0-9_ ]+$/, {
      message: 'تنها حروف، اعداد و آندرلاین برای اسم مجاز است.',
    })
    .max(128, { message: 'نام دسته‌بندی نمی‌تواند بیش از 128 حرف باشد.' }),
  //   contributors: z.array(ContributorEnum).min(1).max(5),
  contributors: z.array(z.string()).min(1).max(5),

  bio: z
    .string()
    .max(1536, { message: 'نام دسته‌بندی نمی‌تواند بیش از 1536 حرف باشد.' })
    .optional(),
  image: z
    .any()
    .refine((files) => !!files, {
      message: 'قسمت عکس نمی‌تواند خالی باشد.',
    })
    .optional(),
  //   role: z.array(z.nativeEnum(contributor)).min(1),
  // .refine((files) => {
  //   return files?.size <= MAX_FILE_SIZE
  // }, `حجم عکس از 5 مگابایت بیشتر است!`)
  // .refine(
  //   (files) => ACCEPTED_IMAGE_TYPES.includes(files?.type),
  //   // 'Only .jpg, .jpeg, .png and .webp formats are supported.'
  //   'تنها فرمتهای قابل پشتیبانی .jpg .jpeg .png و webp هستند.'
  // ),
})
