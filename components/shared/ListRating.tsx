'use client'
import { FC } from 'react'
import { Rating } from '@mui/material'
import { Separator } from '@/components/ui/separator'

import { User } from '@prisma/client'
import UserAvatar from './Avatar'
import { Dot } from 'lucide-react'
import { formatTimeToNow } from '@/lib/date-utils'
interface ListRatingProps {
  product: any
  user: (User & { image: { url: string } | null }) | null
}

const ListRating: FC<ListRatingProps> = ({ product, user }) => {
  return (
    <section className="">
      <div className="text-2xl px-8 space-y-4 font-bold">نظرات</div>
      <div className="text-sm mt-2">
        {product.Reviews?.map((review: any) => {
          return (
            <div key={review.id} className="pt-10 px-8 ml-auto max-w-300px">
              <div className="flex gap-2 items-center">
                <UserAvatar src={user?.image?.url} />
                {/* <div className='font-semibold' >{review?.user.name}</div> */}
                <div className="flex justify-center items-center">
                  <span className=" text-[1rem] ">{user?.name}</span>
                  <Dot className="" />
                  <span className=" text-sm ">
                    {formatTimeToNow(new Date(review.created_at))}
                  </span>
                </div>
              </div>
              <div className="mt-2 ">
                <div className="flex items-center gap-2">
                  <Rating
                    dir="rtl"
                    value={review.rating}
                    readOnly
                    precision={0.5}
                  />
                  {`(${review.rating}) از 5`}
                </div>
                <div
                  className="prose prose-sm my-4 mb-16 max-w-none text-gray-500"
                  dangerouslySetInnerHTML={{ __html: review.comment }}
                />
                <Separator className="my-4" />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default ListRating
