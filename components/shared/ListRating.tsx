'use client'
import { FC } from 'react'
import { Rating } from '@mui/material'
import { Separator } from '@/components/ui/separator'

import { Review, User } from '@prisma/client'
import UserAvatar from './Avatar'
import { Dot } from 'lucide-react'
import { formatTimeToNow } from '@/lib/date-utils'
import { ReviewsWithUserAndImage } from '@/lib/queries/home/products'
interface ListRatingProps {
  reviews: ReviewsWithUserAndImage[]
}

const ListRating: FC<ListRatingProps> = ({ reviews }) => {
  return (
    <section className="">
      <div className="text-2xl px-8 space-y-4 font-bold">نظرات</div>
      <div className="text-sm mt-2">
        {reviews.map((review) => {
          return (
            <div key={review.id} className="mt-10 px-8 ml-auto max-w-[300px]">
              <div className="flex gap-2 items-center">
                <UserAvatar src={review.User?.image?.url} />
                {/* <div className='font-semibold' >{review?.user.name}</div> */}
                <div className="flex justify-center items-center">
                  <span className=" text-[1rem] ">{review.User?.name}</span>
                  <Dot className="" />
                  <span className=" text-sm ">
                    {formatTimeToNow(new Date(review.created_at))}
                  </span>
                </div>
              </div>
              <div className="mt-2 ">
                <div className="flex items-center gap-2">
                  <Rating
                    dir="ltr"
                    value={review.rating}
                    readOnly
                    precision={0.5}
                  />
                  {`${review.rating} (از 5)`}
                </div>
                <div
                  className="prose prose-sm my-4 mb-16 max-w-none text-primary/85"
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
