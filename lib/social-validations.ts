import { z } from 'zod'

export const QuestionSchema = z.object({
  title: z
    .string()
    .min(5, {
      message: 'عنوان باید حداقل 5 حرف باشد.',
    })
    .max(130, {
      message: 'عنوان نمی‌تواند بیش از 130 حرف باشد.',
    }),
  // explanation: z.string(),
  explanation: z
    .string()
    .min(20, {
      message: 'شما باید موضوع خود را حداقل در 20 حرف توضیح دهید.',
    })
    .max(1080, {
      message: 'توضیحات نمی‌تواند بیش از 1080 حرف باشد.',
    }),
  tags: z
    .array(
      z
        .string()
        .min(1, {
          message: 'تگ باید حداقل 1 حرف باشد.',
        })
        .max(15)
    )
    .max(15, {
      message: 'تگ نمی‌تواند بیش از 15 حرف باشد.',
    }),
})

export const AnswerSchema = z.object({
  answer: z
    .string()
    .min(3, {
      message: 'توضیحات نمی‌تواند کمتر از 3 حرف باشد.',
    })
    .max(1080, {
      message: 'توضیحات نمی‌تواند بیش از 1080 حرف باشد.',
    }),
})

export const ProfileSchema = z.object({
  name: z.string(),
  // .min(5, {
  //   message: 'Username must be at least 2 characters.',
  // })
  // .max(50),
  // username: z.string().min(5).max(50),
  bio: z.string().max(150).optional(),
  portfolioWebsite: z.string().optional(),
  // portfolioWebsite: z
  //   .string()
  //   .refine(
  //     (value) => {
  //       return (
  //         value === null ||
  //         value.trim() === '' ||
  //         /^https?:\/\/\S+$/.test(value)
  //       )
  //     },
  //     {
  //       message: 'آدرس وبسایت معتبر نیست!',
  //     }
  //   )
  //   .transform((value) => {
  //     return value === null || value.trim() === '' ? null : value
  //   }),
  location: z.string().max(50).optional(),
})
