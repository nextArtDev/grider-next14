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
  label: z.string().min(1, { message: 'عنوان نمی‌تواند خالی باشد.' }),
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
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
})

export const imageUploadSchema = z.object({
  image: z
    .any()
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      'Only .jpg, .jpeg, .png and .webp formats are supported.'
    ),
})
