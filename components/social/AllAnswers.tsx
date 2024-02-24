import { FC } from 'react'
import Filter from './search/Filter'

// import { getAnswers } from '@/lib/actions/answer.actions'
import Link from 'next/link'
import Image from 'next/image'

import ParseHTML from './ParseHTML'
import Votes from './Votes'
import Pagination from './Pagination'
import userImage from '@/public/assets/icons/user.svg'
import { AnswerFilters } from '@/lib/constants'
import { getAnswers } from '@/lib/actions/social/answer.actions'
import { getTimestamp } from '@/lib/socialUtils'
import UserAvatar from '../shared/Avatar'
interface AllAnswersProps {
  questionId: string
  userId: string
  totalAnswers: number
  page?: number
  filter?: string
}

const AllAnswers: FC<AllAnswersProps> = async ({
  questionId,
  userId,
  totalAnswers,
  page,
  filter,
}) => {
  const result = await getAnswers({
    questionId,
    page: page ? +page : 1,
    sortBy: filter,
  })
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="text-base">{totalAnswers} جواب</h3>
        <Filter filters={AnswerFilters} />
      </div>

      <div>
        {result.answers.map((answer) => (
          <article key={answer.id} className="border-b py-10">
            <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
              <Link
                href={`/profile/${answer.author.id}`}
                className="flex flex-1 items-start gap-1 sm:items-center"
              >
                <UserAvatar
                  src={answer.author.image?.url ?? userImage}
                  alt={answer.author.name}
                  // width={18}
                  // height={18}
                  className="rounded-full w-6 h-7 object-cover max-sm:mt-0.5"
                />
                <div className="flex flex-col sm:flex-row sm:items-center ">
                  <p className="font-semibold">{answer.author.name}</p>
                  <p className="mr-0.5 mt-0.5 line-clamp-1">
                    <span className="max-sm:hidden"> - </span>
                    {getTimestamp(answer.created_at)}
                  </p>
                </div>
              </Link>
              <div className="flex justify-end">
                <Votes
                  type="Answer"
                  itemId={answer.id}
                  userId={userId}
                  upvotes={answer.upvoters.length}
                  hasupVoted={answer.upvoters.some(
                    (upvote) => upvote.id === userId
                  )}
                  downvotes={answer.downvoters.length}
                  hasdownVoted={answer.downvoters.some(
                    (downvote) => downvote.id === userId
                  )}
                />
              </div>
            </div>
            {/* <div className=" text-right ">
              <ParseHTML data={answer.content} />
            </div> */}
            <article className="bg-muted rounded-md p-4 border border-primary/30 ">
              <div dangerouslySetInnerHTML={{ __html: answer.content }} />
            </article>
          </article>
        ))}
      </div>
      <div className="mt-10 w-full">
        <Pagination pageNumber={page ? +page : 1} isNext={result.isNext} />
      </div>
    </div>
  )
}

export default AllAnswers
