import Question from '@/components/social/forms/Question'
import { currentUser } from '@/lib/auth'

// import { getUserByID } from '@/lib/actions/user.action'
import { redirect } from 'next/navigation'
import React from 'react'

type Props = {}

const page = async (props: Props) => {
  const user = await currentUser()

  const userId = user?.id
  // we should get it from clerk
  if (!userId) redirect('/sign-in')

  // const mongoUser = await getUserByID({ userId })

  return (
    <div>
      <h1 className="text-2xl font-bold "> موضوعی مطرح کنید.</h1>
      <div className="mt-9">
        <Question userId={userId} />
        {/* <Question mongoUserId={JSON.stringify(mongoUser._id)} /> */}
      </div>
    </div>
  )
}

export default page
