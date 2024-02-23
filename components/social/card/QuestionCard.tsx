import Link from 'next/link'
import { FC } from 'react'
// import RenderTag from '../shared/RenderTag'
// import Metric from '../shared/Metric'
// import { formatLargeNumber, getTimestamp } from '@/lib/utils'
// import EditDeleteAction from '../shared/EditDeleteAction'
import { User } from '@prisma/client'
import { formatLargeNumber, getTimestamp } from '@/lib/socialUtils'
import EditDeleteAction from '../EditDeleteAction'
import RenderTag from '../RenderTag'
import Metric from '../Metric'
import UserAvatar from '@/components/shared/Avatar'

interface QuestionCardProps {
  id: string
  title: string
  tags: { id: number; name: string }[]
  author: User & { image: { url: string } | null }
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
    <section className="rounded-[10px] p-9  sm:px-11 ">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div className="space-y-3.5">
          <Link href={`/social/question/${id}`}>
            <h3 className="line-clamp-1 flex-1 text-lg sm:font-semibold ">
              {title}
            </h3>
          </Link>
          <span className="line-clamp-1 text-xs flex sm:hidden">
            {getTimestamp(new Date(createdAt))}
            {/* {getTimestamp(createdAt)} */}
          </span>
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
          imgUrl={author.image?.url ?? '/assets/icons/user.svg'}
          // alt="User"
          alt={author.name}
          value={author.name}
          title={` - ${getTimestamp(new Date(createdAt))}`}
          textStyles="text-sm md:text-md"
          href={`/social/profile/${author.id}`}
          isAuthor
          isAvatar
        />
        <div className="max-sm:flex-start flex items-center gap-3 max-sm:flex-wrap ">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="Upvotes"
            value={upvotes?.length ?? 0}
            // value={formatLargeNumber(+upvotes?.length)}
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
            value={views ? +views : 0}
            title="مشاهده"
            textStyles="text-sm md:text-md"
          />
        </div>
      </div>
    </section>
  )
}

export default QuestionCard
