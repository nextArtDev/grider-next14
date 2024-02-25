// import { getUserAnswers } from '@/lib/actions/user.action'

import { FC } from 'react'

import Pagination from './Pagination'
import AnswerCard from './card/AnswerCard'
import { SearchParamsProps } from '@/types/social'
import { getUserAnswers } from '@/lib/actions/social/user.action'
import { Role } from '@prisma/client'

interface AnswerTabProps extends SearchParamsProps {
  userId: string
  userRole: Role
}

const AnswerTab: FC<AnswerTabProps> = async ({
  userId,
  searchParams,
  userRole,
}) => {
  const result = await getUserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page : 1,
  })
  return (
    <>
      {result.answers.map((item) => (
        <AnswerCard
          key={item.id}
          userId={userId}
          id={item.id}
          question={item.Question}
          author={item.author}
          upvotes={item.upvoters}
          createdAt={item.created_at}
          role={userRole}
        />
      ))}
      <Pagination
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      />
    </>
  )
}

export default AnswerTab
