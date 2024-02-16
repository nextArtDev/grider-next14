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
import { toast } from '@/components/ui/use-toast'

import { Contributor, Order, Product, Review, User } from '@prisma/client'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useState } from 'react'
import { Rating } from '@mui/material'

import { Loader } from 'lucide-react'
import { createReviewSchema } from '@/lib/schema/review'
import { ContributorFullStructure } from '@/lib/queries/home/contributors'
import { SingleProductFullStructure } from '@/lib/queries/home/products'

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
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const form = useForm<z.infer<typeof createReviewSchema>>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      comment: '',
      rating: '5',
    },
  })

  async function onSubmit(data: z.infer<typeof createReviewSchema>) {
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
        <Button disabled={isLoading} type="submit">
          {isLoading ? <Loader className="animate-spin w-4 h-4 " /> : 'ثبت نظر'}
        </Button>
      </form>
    </Form>
  )
}

export default AddRating
