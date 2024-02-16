'use client'
import { FC } from 'react'
import { Rating } from '@mui/material'
import { Separator } from '@/components/ui/separator'
import Avatar from './Avatar'
interface ListRatingProps {
  product: any
}

const ListRating: FC<ListRatingProps> = ({ product }) => {
  return (
    <section className="">
      <div className="text-2xl font-bold">نظرات</div>
      <div className="text-sm mt-2">
        {product.reviews?.map((review: any) => {
          return (
            <div key={review.id} className="max-w-300px">
              <div className="flex gap-2 items-center">
                <Avatar src={review.avatarSrc} />
                {/* <div className='font-semibold' >{review?.user.name}</div> */}
                <div className="font-semibold">{review?.author}</div>
                {/* <div className='font-light' >{moment(review.dateTime).fromNow()}</div> */}
                <div className="font-light">{review.date}</div>
              </div>
              <div className="mt-2 ">
                <Rating
                  dir="ltr"
                  value={review.rating}
                  readOnly
                  precision={0.5}
                />

                {/* <div className="ml-2">{review.content}</div> */}
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
