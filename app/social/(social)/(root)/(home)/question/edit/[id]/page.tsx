// import Question from '@/components/forms/Question'
// import { getCurrentUser } from '@/lib/actions/getCurrentUser'
// import { getQuestionById } from '@/lib/actions/question.action'
// import { getUserByID } from '@/lib/actions/user.action'
// import { ParamsProps } from '@/types'
import Question from '@/components/social/forms/Question'
import { getQuestionById } from '@/lib/actions/social/question.action'
import { currentUser } from '@/lib/auth'
import { ParamsProps } from '@/types/social'
import { notFound } from 'next/navigation'
import { FC } from 'react'

const page: FC<ParamsProps> = async ({ params }) => {
  // const {userId} = auth();
  const user = await currentUser()
  if (!user) return notFound()
  const userId = user.id
  if (!userId) return notFound()

  // const mongoUser = await getUserByID({ userId })
  const result = await getQuestionById({ questionId: params.id })

  return (
    <>
      <h1 className="text-xl font-bold">ویرایش موضوع</h1>
      <div className="mt-9">
        <Question
          type="Edit"
          userId={userId}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  )
}

export default page
