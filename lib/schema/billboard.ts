import { z } from 'zod'

const MAX_IMAGE_SIZE = 5242880 // 5 MB
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
]
const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export const createBillboardSchema = z.object({
  label: z
    .string()
    .min(1, { message: 'نام فروشگاه باید بیش از یک حرف باشد.' })
    .regex(/^[\u0600-\u06FFa-zA-Z0-9_ ]+$/, {
      message: 'تنها حروف، اعداد و آندرلاین برای اسم مجاز است.',
    })
    .max(128, { message: 'نام فروشگاه نمی‌تواند بیش از 128 حرف باشد.' }),
  // image: z.custom<File>(),
  // .custom<File>((val) => val instanceof File, 'قسمت عکس نمی‌تواند خالی باشد')
  // // .refine((files) => files.length > 0, `قسمت عکس نمی‌تواند خالی باشد`)
  // // .refine((files) => files.length <= 5, `حداکثر 5 عکس مجاز است.`)
  // .refine(
  //   (file) => file.size <= MAX_IMAGE_SIZE,
  //   `هر فایل باید کمتر از 5 مگابایت باشد`
  // )
  // .refine(
  //   (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
  //   'تنها این فرمتها مجاز است: .jpg, .jpeg, .png and .webp'
  // ),
  image: z
    .any()
    .refine((files) => files.size > 0, {
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
  // To not allow empty files
  // .refine((files) => files?.length >= 1, { message: 'Image is required.' })
  // To not allow files other than images
  // .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), {
  //   message: '.jpg, .jpeg, .png and .webp files are accepted.',
  // })
  // To not allow files larger than 5MB
  // .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, {
  //   message: `Max file size is 5MB.`,
  // }),
})
