import Profile from '@/components/forms/Profile'
import Question from '@/components/forms/Question'
import { getCurrentUser } from '@/lib/actions/getCurrentUser'
import { getQuestionById } from '@/lib/actions/question.action'
import { getUserByID } from '@/lib/actions/user.action'
import { ParamsProps } from '@/types'
import { notFound } from 'next/navigation'
import { FC } from 'react'

const page: FC<ParamsProps> = async ({ params }) => {
  // const {userId} = auth();
  // const userId = '12346'
  const currentUser = await getCurrentUser()
  const userId = currentUser?.id
  if (!userId) return notFound()

  // const mongoUser = await getUserByID({ userId })
  // const result = await getQuestionById({ questionId: params.id })

  return (
    <>
      <h1 className="text-xl font-bold">ویرایش اطلاعات</h1>
      <div className="mt-9">
        <Profile userId={userId} user={JSON.stringify(currentUser)} />
      </div>
    </>
  )
}

export default page
