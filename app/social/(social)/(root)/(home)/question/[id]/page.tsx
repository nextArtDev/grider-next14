// import Answer from '@/components/forms/Answer'
// import AllAnswers from '@/components/shared/AllAnswers'
// import Metric from '@/components/shared/Metric'
// import ParseHTML from '@/components/shared/ParseHTML'
// import RenderTag from '@/components/shared/RenderTag'
// import Votes from '@/components/shared/Votes'
// import { getCurrentUser } from '@/lib/actions/getCurrentUser'
// import { getQuestionById } from '@/lib/actions/question.action'
// import { getTimestamp } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'
import userImage from '@/public/assets/icons/user.svg'
import { getQuestionById } from '@/lib/actions/social/question.action'
import { currentUser } from '@/lib/auth'
import Votes from '@/components/social/Votes'
import Metric from '@/components/social/Metric'
import { getTimestamp } from '@/lib/socialUtils'
import ParseHTML from '@/components/social/ParseHTML'
import RenderTag from '@/components/social/RenderTag'
import AllAnswers from '@/components/social/AllAnswers'
import Answer from '@/components/social/forms/Answer'
import UserAvatar from '@/components/shared/Avatar'
type Props = {
  params: { id: string }
  searchParams: string
}

const page = async ({ params, searchParams }: Props) => {
  const result = await getQuestionById({ questionId: params.id })

  const user = await currentUser()
  if (!user) return
  const userId = user.id

  // const {userId} = auth()
  // const hasupVoted = result?.question?.upvoters.includes(
  //   result?.question?.userId
  // )
  // console.log('hasupVoted', hasupVoted)
  // const hasdownVoted = result?.question?.downvoters?.some(
  //   (downvote) => downvote.id === userId
  // )
  // console.log('hasdownVoted', hasdownVoted)

  if (!result.question) return notFound()

  return (
    <>
      <div className="flex flex-start  w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-end  sm:gap-6">
          <Link
            href={`/social/profile/${result.question.author.id}`}
            className="flex items-center justify-start gap-1"
          >
            <UserAvatar
              src={result.question.author.image?.url ?? userImage}
              alt={result.question.author.name}
            />
            <p className="font-semibold  ">{result.question.author.name}</p>
          </Link>
          <div className="flex justify-start ">
            <Votes
              type="Question"
              itemId={result.question.id}
              userId={userId}
              upvotes={result.question.upvoters.length}
              // If our current user has upvoted
              // hasupVoted={result.question.upvoters.includes(userId)}
              hasupVoted={result.question.upvoters.some(
                (upvote) => upvote.id === userId
              )}
              downvotes={result.question.downvoters.length}
              hasdownVoted={result.question.downvoters?.some(
                (downvote) => downvote.id === userId
              )}
              // hasdownVoted={result.question.downvotes.includes(userId)}
              hasSaved={result.question.usersWhoSaved?.some(
                (user) => user.id === userId
              )}
            />
          </div>
          <h2 className="mt-3.5 w-full text-canter  text-lg font-semibold">
            {result.question.title}
          </h2>
        </div>

        <div className="mb-8 mt-5 flex flex-wrap gap-4">
          <Metric
            imgUrl="/assets/icons/clock.svg"
            alt="clock icon"
            value={`${getTimestamp(result.question.created_at)}`}
            title=""
            textStyles="text-sm md:text-md"
          />
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="Message"
            value={result.question.answers.length}
            title="جواب"
            textStyles="text-sm md:text-md"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="Views"
            value={+result.question.views}
            title="مشاهده"
            textStyles="text-sm md:text-md"
          />
        </div>
      </div>
      {/* <ParseHTML data={result?.question.content} /> */}
      <article className="bg-muted rounded-md p-4 border border-primary/30 ">
        <div dangerouslySetInnerHTML={{ __html: result?.question.content }} />
      </article>

      <div className="mt-8 flex flex-wrap gap-2">
        {result.question.tags.map((tag: any) => (
          <RenderTag
            key={tag.id}
            id={tag.id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>

      <AllAnswers
        questionId={result.question.id}
        userId={userId}
        totalAnswers={result.question.answers.length}
        page={searchParams?.page}
        filter={searchParams?.filter}
      />
      <Answer
        question={result.question.content}
        questionId={JSON.stringify(result.question.id)}
        authorId={JSON.stringify(userId)}
      />
    </>
  )
}

export default page
