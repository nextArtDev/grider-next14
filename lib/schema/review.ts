import { z } from 'zod'

export const createReviewSchema = z.object({
  comment: z
    .string()
    .max(512, { message: 'نام فروشگاه نمی‌تواند بیش از 512 حرف باشد.' }),
  rating: z.string(),
})
