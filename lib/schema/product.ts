import { z } from 'zod'

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export const createProductSchema = z.object({
  isbn: z
    .string()
    .min(1, { message: 'شابک باید بیش از یک حرف باشد.' })
    .regex(/^[\u0600-\u06FFa-zA-Z0-9_ ]+$/, {
      message: 'تنها حروف، اعداد و آندرلاین برای اسم مجاز است.',
    })
    .max(26, { message: 'شابک نمی‌تواند بیش از 26 حرف باشد.' })
    .optional(),
  title: z
    .string()
    .min(1, { message: 'عنوان باید بیش از یک حرف باشد.' })
    .regex(/^[\u0600-\u06FFa-zA-Z0-9_ ]+$/, {
      message: 'تنها حروف، اعداد و آندرلاین برای اسم مجاز است.',
    })
    .max(128, { message: 'نام شخص نمی‌تواند بیش از 128 حرف باشد.' }),
  subTitle: z
    .string()
    .min(1, { message: 'زیرعنوان باید بیش از یک حرف باشد.' })
    .regex(/^[\u0600-\u06FFa-zA-Z0-9_ ]+$/, {
      message: 'تنها حروف، اعداد و آندرلاین برای اسم مجاز است.',
    })
    .max(128, { message: 'نام شخص نمی‌تواند بیش از 128 حرف باشد.' })
    .optional(),
  originalTitle: z
    .string()
    .min(1, { message: 'عنوان اصلی باید بیش از یک حرف باشد.' })
    .regex(/^[\u0600-\u06FFa-zA-Z0-9_ ]+$/, {
      message: 'تنها حروف، اعداد و آندرلاین برای اسم مجاز است.',
    })
    .max(128, { message: 'عنوان اصلی نمی‌تواند بیش از 128 حرف باشد.' })
    .optional(),
  description: z
    .string()
    .min(1, { message: 'توضیحات باید بیش از یک حرف باشد.' })
    // .regex(/^[\u0600-\u06FFa-zA-Z0-9_ ]+$/, {
    //   message: 'تنها حروف، اعداد و آندرلاین برای اسم مجاز است.',
    // })
    .max(1536, { message: 'توضیحات نمی‌تواند بیش از 1536 حرف باشد.' })
    .optional(),
  size: z
    .string()
    .min(1, { message: 'قطع کتاب باید بیش از یک حرف باشد.' })
    // .regex(/^[\u0600-\u06FFa-zA-Z0-9_ ]+$/, {
    //   message: 'تنها حروف، اعداد و آندرلاین برای اسم مجاز است.',
    // })
    .max(128, { message: 'قطع کتاب نمی‌تواند بیش از 128 حرف باشد.' })
    .optional(),
  pages: z
    .string()
    .min(1, { message: 'تعداد صفحات کتاب  باید بیش از یک رقم باشد.' })
    // .regex(/^[\u0600-\u06FFa-zA-Z0-9_ ]+$/, {
    //   message: 'تنها حروف، اعداد و آندرلاین برای اسم مجاز است.',
    // })
    .max(6, { message: 'صفحات کتاب نمی‌تواند بیش از 6 رقم باشد.' })
    .optional(),
  weight: z
    .string()
    .min(1, { message: 'وزن کتاب باید بیش از یک رقم باشد.' })
    // .regex(/^[\u0600-\u06FFa-zA-Z0-9_ ]+$/, {
    //   message: 'تنها حروف، اعداد و آندرلاین برای اسم مجاز است.',
    // })
    .max(6, { message: 'وزن نمی‌تواند بیش از 6 رقم باشد.' })
    .optional(),
  cover: z
    .string()
    .min(1, { message: 'نوع جلد کتاب باید بیش از یک رقم باشد.' })
    // .regex(/^[\u0600-\u06FFa-zA-Z0-9_ ]+$/, {
    //   message: 'تنها حروف، اعداد و آندرلاین برای اسم مجاز است.',
    // })
    .max(128, { message: 'نوع جلد نمی‌تواند بیش از 128 رقم باشد.' })
    .optional(),
  publishDate: z
    .string()
    .min(1, { message: 'زمان انتشار کتاب باید بیش از یک حرف باشد.' })
    // .regex(/^[\u0600-\u06FFa-zA-Z0-9_ ]+$/, {
    //   message: 'تنها حروف، اعداد و آندرلاین برای اسم مجاز است.',
    // })
    .max(128, { message: 'زمان انتشار کتاب نمی‌تواند بیش از 128 حرف باشد.' })
    .optional(),
  edition: z
    .string()
    .min(1, { message: 'ویراست کتاب کتاب باید بیش از یک حرف باشد.' })
    // .regex(/^[\u0600-\u06FFa-zA-Z0-9_ ]+$/, {
    //   message: 'تنها حروف، اعداد و آندرلاین برای اسم مجاز است.',
    // })
    .max(128, { message: 'ویراست کتاب نمی‌تواند بیش از 128 حرف باشد.' })
    .optional(),

  summary: z
    .string()
    .min(1, { message: 'خلاصه باید بیش از یک حرف باشد.' })
    // .regex(/^[\u0600-\u06FFa-zA-Z0-9_ ]+$/, {
    //   message: 'تنها حروف، اعداد و آندرلاین برای اسم مجاز است.',
    // })
    .max(1536, { message: 'خلاصه نمی‌تواند بیش از 1536 حرف باشد.' })
    .optional(),
  price: z.coerce
    .number()
    .min(1, { message: 'این قسمت نمی‌تواند خالی باشد' })
    .max(1536, { message: 'نام شخص نمی‌تواند بیش از 1536 حرف باشد.' }),

  writerId: z
    .array(z.string())
    // .min(1, { message: 'وارد کردن یکی از فعالیتها الزامی است!' })
    .max(52),
  translatorId: z
    .array(z.string())
    // .min(1, { message: 'وارد کردن یکی از فعالیتها الزامی است!' })
    .max(52),
  editorId: z
    .array(z.string())
    // .min(1, { message: 'وارد کردن یکی از فعالیتها الزامی است!' })
    .max(52),
  illustratorId: z
    .array(z.string())
    // .min(1, { message: 'وارد کردن یکی از فعالیتها الزامی است!' })
    .max(52),
  photographerId: z
    .array(z.string())
    // .min(1, { message: 'وارد کردن یکی از فعالیتها الزامی است!' })
    .max(52),
  // contributes: z
  //   .array(z.string())
  //   .min(1, { message: 'وارد کردن یکی از فعالیتها الزامی است!' })
  //   .max(5),
  //   .max(5),
  image: z
    .any()
    .refine((files) => !!files, {
      message: 'قسمت عکس نمی‌تواند خالی باشد.',
    })
    .optional(),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
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
