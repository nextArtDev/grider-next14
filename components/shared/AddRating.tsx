'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

import { Contributor, Order, Product, Review, User } from '@prisma/client'
import { usePathname, useRouter } from 'next/navigation'
import { FC, startTransition, useState, useTransition } from 'react'
import { Rating } from '@mui/material'

import { Loader } from 'lucide-react'
import { createReviewSchema } from '@/lib/schema/review'
import { ContributorFullStructure } from '@/lib/queries/home/contributors'
import { SingleProductFullStructure } from '@/lib/queries/home/products'

import { createReview } from '@/lib/actions/rating'
import { toast } from 'sonner'

interface AddRatingContributorProps {
  product: ContributorFullStructure
  user: (User & { image: { url: string } | null }) | null
  //   user: (SafeUser & { orders: Order[] }) | null
}
interface AddRatingProductProps {
  product: SingleProductFullStructure
  user: (User & { image: { url: string } | null }) | null
  //   user: (SafeUser & { orders: Order[] }) | null
}

const AddRating: FC<AddRatingContributorProps | AddRatingProductProps> = ({
  product,
  user,
}) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const path = usePathname()

  const form = useForm<z.infer<typeof createReviewSchema>>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      comment: '',
      rating: '5',
    },
  })

  const onSubmit = async (data: z.infer<typeof createReviewSchema>) => {
    const formData = new FormData()

    formData.append('comment', data.comment)
    formData.append('rating', data.rating)

    try {
      startTransition(() => {
        createReview(formData, path, user?.id as string, product.id as string)
          .then((res) => {
            if (res?.errors?.comment) {
              form.setError('comment', {
                type: 'custom',
                message: res?.errors.comment?.join(' و '),
              })
            } else if (res?.errors?.rating) {
              form.setError('rating', {
                type: 'custom',
                message: res?.errors.rating?.join(' و '),
              })
            } else if (res?.errors?._form) {
              toast.error(res?.errors._form?.join(' و '))
              form.setError('root', {
                type: 'custom',
                message: res?.errors?._form?.join(' و '),
              })
            }
            // if (res?.success) {
            //    toast.success(toastMessage)
            // }
          })
          .catch(() => toast.error('مشکلی پیش آمده.'))
      })
    } catch (error) {}
    // setIsLoading(true)
    // try {
    //   const result = await createReviewAction({
    //     comment: data.comment,
    //     rating: data.rating,
    //     user_id: user.id,
    //     productId: Number(product.id),
    //     path: pathname,
    //   })
    //   if (result) {
    //     return toast({ title: 'نظر شما منتشر شد.', variant: 'default' })
    //   }
    //   form.reset()
    // } catch (error) {
    //   //   console.log(error)
    //   return toast({ title: `${error}`, variant: 'destructive' })
    // } finally {
    //   setIsLoading(false)
    // }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem className="py-4 flex items-center align-middle gap-4">
              <FormLabel className="mt-2 ">ستاره بدهید:</FormLabel>
              <FormControl>
                <Rating {...field} value={Number(field.value)} dir="ltr" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نظر</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="نظر خود را بنویسید..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending} className="ml-auto">
          {isPending ? (
            <Loader className="animate-spin w-full h-full " />
          ) : (
            'ثبت'
          )}
        </Button>
      </form>
    </Form>
  )
}

export default AddRating
