import Link from 'next/link'
import { FC } from 'react'
// import RenderTag from '../shared/RenderTag'
// import Metric from '../shared/Metric'
// import { formatLargeNumber, getTimestamp } from '@/lib/utils'
// import EditDeleteAction from '../shared/EditDeleteAction'
import { User } from '@prisma/client'
import { getTimestamp } from '@/lib/socialUtils'
import EditDeleteAction from '../EditDeleteAction'
import RenderTag from '../RenderTag'
import Metric from '../Metric'

interface QuestionCardProps {
  id: string
  title: string
  tags: { id: number; name: string }[]
  author: { id: string; name: string; picture?: string | null }
  // author: string
  upvotes: User[]
  views?: number
  answers: Array<object>
  createdAt: Date
  userId?: string
}

const QuestionCard: FC<QuestionCardProps> = ({
  id,
  title,
  tags,
  author,
  upvotes,
  views,
  answers,
  createdAt,
  userId,
}) => {
  const showActionButtons = userId && userId === author.id
  return (
    <section className="rounded-[10px] p-9 text-slate-300 sm:px-11 ">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="line-clamp-1 flex sm:hidden">
            {/* {getTimestamp(new Date(createdAt))} */}
            {/* {getTimestamp(createdAt)} */}
          </span>
          <Link href={`/question/${id}`}>
            <h3 className="line-clamp-1 flex-1 text-base sm:font-semibold ">
              {title}
            </h3>
          </Link>
        </div>
        {/* edit and delete action  */}
        {/* <SignedIn>
          {showActionButtons && <EditDeleteAction />}
        </SignedIn> */}
        {showActionButtons && <EditDeleteAction type="Question" itemId={id} />}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2 ">
        {tags.map((tag) => (
          <RenderTag key={tag.id} id={tag.id.toString()} name={tag.name} />
        ))}
      </div>
      <div className="mt-6 flex w-full flex-wrap justify-between gap-3">
        <Metric
          imgUrl={author.picture ?? '/assets/icons/user.svg'}
          alt="User"
          value={author.name}
          // title={` - ${getTimestamp(new Date(createdAt))}`}
          textStyles="text-sm md:text-md"
          href={`/profile/${author.id}`}
          isAuthor
        />
        <div className="max-sm:flex-start flex items-center gap-3 max-sm:flex-wrap ">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={upvotes?.length}
            // value={formatLargeNumber(upvotes)}
            title="رای"
            textStyles="text-sm md:text-md"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="Message"
            // value={answers.length}
            value={answers.length}
            title="جواب"
            textStyles="text-sm md:text-md"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="Views"
            value={+views}
            title="مشاهده"
            textStyles="text-sm md:text-md"
          />
        </div>
      </div>
    </section>
  )
}

export default QuestionCard
