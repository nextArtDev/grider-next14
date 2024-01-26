import { z } from 'zod'

export const createStoreSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'نام فروشگاه باید بیش از یک حرف باشد.' })
    .regex(/^[\u0600-\u06FFa-zA-Z0-9_ ]+$/, {
      message: 'تنها حروف، اعداد و آندرلاین برای اسم مجاز است.',
    })
    .max(128, { message: 'نام فروشگاه نمی‌تواند بیش از 128 حرف باشد.' }),
})

export const updateStoreSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'نام فروشگاه باید بیش از یک حرف باشد.' })
    .regex(/^[\u0600-\u06FFa-zA-Z0-9_ ]+$/, {
      message: 'تنها حروف، اعداد و آندرلاین برای اسم مجاز است.',
    })
    .max(128, { message: 'نام فروشگاه نمی‌تواند بیش از 128 حرف باشد.' }),
  // storeId: z.string(),
})

// export const deleteStoreSchema = updateStoreSchema.pick({ storeId: true })
