'use server'

import { createReviewSchema } from '../schema/review'

interface CreateReviewFormState {
  errors: {
    label?: string[]
    image?: string[]
    _form?: string[]
  }
}

export async function createBillboard(
  path: string,
  storeId: string,
  formState: CreateReviewFormState,
  formData: FormData
): Promise<CreateReviewFormState> {
  const result = createReviewSchema.safeParse({
    comment: formData.get('comment'),
    rating: formData.get('rating'),
  })
}
