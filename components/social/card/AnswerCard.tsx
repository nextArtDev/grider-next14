import { FC } from 'react'
import Link from 'next/link'
// import Metric from '../shared/Metric'
// import { getTimestamp } from '@/lib/utils'
// import RenderTag from '../shared/RenderTag'
// import EditDeleteAction from '../shared/EditDeleteAction'
// import { Question, User } from '@prisma/client'
import { User } from '@prisma/client'
import { getTimestamp } from '@/lib/socialUtils'
import EditDeleteAction from '../EditDeleteAction'
import Metric from '../Metric'

interface AnswerCardProps {
  id: string
  author: Partial<User>
  upvotes: Partial<User>[]
  question: any
  // question: Question
  createdAt: Date
  userId?: string
}

const AnswerCard: FC<AnswerCardProps> = ({
  id,
  author,
  upvotes,
  question,
  createdAt,
  userId,
}) => {
  const showActionButtons = userId && userId === author.id
  return (
    <Link
      href={`/question/${question?.id}/#${id}`}
      className="rounded-[10px] px-11 py-9"
    >
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="line-clamp-1 flex sm:hidden">
            {/* {getTimestamp(createdAt)} */}
          </span>
          <h3 className="line-clamp-1 flex  ">{question.title}</h3>
        </div>
        {/* <SignedIn>
          {showActionButtons && <EditDeleteAction />}
        </SignedIn> */}
        {showActionButtons && <EditDeleteAction type="Answer" itemId={id} />}
      </div>
      <div className="mt-6 flex w-full flex-wrap justify-between gap-3">
        <Metric
          imgUrl={author.picture || '/assets/icons/user.svg'}
          alt="User"
          value={author.name!}
          // title={` - ${getTimestamp(new Date(createdAt))}`}
          textStyles="text-sm md:text-md"
          href={`/profile/${author.id}`}
          isAuthor
        />
        <div className="flex items-center justify-center gap-3">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={upvotes.length}
            title="رای"
            textStyles="text-sm md:text-md"
          />
        </div>
      </div>
    </Link>
  )
}

export default AnswerCard
