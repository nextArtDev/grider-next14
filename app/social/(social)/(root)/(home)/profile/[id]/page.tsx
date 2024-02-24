// import AnswerTab from '@/components/shared/AnswerTab'
// import ProfileLink from '@/components/shared/ProfileLink'
// import QuestionTab from '@/components/shared/QuestionTab'
// import Stats from '@/components/shared/Stats'
// import { getCurrentUser } from '@/lib/actions/getCurrentUser'
// import { getUserInfo } from '@/lib/actions/user.action'
// import { URLProps } from '@/types'
// import { getTimestamp } from '@/lib/utils'
import UserAvatar from '@/components/shared/Avatar'
import AnswerTab from '@/components/social/AnswerTab'
import ProfileLink from '@/components/social/ProfileLink'
import QuestionTab from '@/components/social/QuestionTab'
import Stats from '@/components/social/Stats'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getUserInfo } from '@/lib/actions/social/user.action'
import { currentUser } from '@/lib/auth'
import { getTimestamp } from '@/lib/socialUtils'
import { URLProps } from '@/types/social'
// import { getJoinedDate } from '@/lib/utils'
import { Phone } from 'lucide-react'

import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FC } from 'react'

const page: FC<URLProps> = async ({ params, searchParams }) => {
  const user = await currentUser()
  if (!user) redirect('/login')

  const userId = user?.id
  const userInfo = await getUserInfo({ userId: params.id })
  if (!userInfo) return
  return (
    <>
      <div className="flex flex-col-reverse items-start justify-between sm:flex-row ">
        <div className="flex flex-col items-start gap-4 lg:flex-row ">
          <UserAvatar
            src={userInfo?.user.image?.url || '/assets/icons/user.svg'}
            alt={userInfo.user.name}
            className="w-48 h-48 rounded-full object-cover"
          />
        </div>
        <div className="mt-3 space-y-2">
          <h2 className="font-semibold">{userInfo?.user.name}</h2>
          <p className="flex items-center gap-2">
            <Phone size={15} className="rotate-[270deg]" />
            {userInfo?.user.phone}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
            {userInfo?.user.portfolioWebsite && (
              <ProfileLink
                imgUrl="/assets/icons/link.svg"
                title="portfolio"
                href={userInfo.user.portfolioWebsite}
              />
            )}
            {userInfo?.user.location && (
              <ProfileLink
                imgUrl="/assets/icons/location.svg"
                title={userInfo.user.location}
              />
            )}
            {/* {getTimestamp(userInfo?.user.createdAt)} */}
            <ProfileLink
              imgUrl="/assets/icons/calendar.svg"
              title={getTimestamp(userInfo?.user.createdAt)}
            />
          </div>
          {userInfo?.user.bio && <p className="mt-8">{userInfo.user.bio}</p>}
        </div>
        <div className="max-xm:w-full flex justify-end max-sm:mb-5 sm:mt-3 ">
          {userId === userInfo?.user.id && (
            <Link href={'/social/profile/edit'}>
              <Button variant={'outline'}>ویرایش پروفایل</Button>
            </Link>
          )}
        </div>
      </div>

      <Stats
        reputation={userInfo.reputation}
        totalQuestions={userInfo?.totalQuestions}
        totalAnswers={userInfo?.totalAnswers}
        badges={userInfo?.badgeCounts}
      />

      <div className="mt-10 flex gap-10">
        <Tabs dir="rtl" defaultValue="top-posts" className="w-full flex-1">
          <TabsList className="min-h-[42px] w-full p-1 py-8 ">
            <TabsTrigger className="w-full py-4" value="top-posts">
              پست‌های پربحث
            </TabsTrigger>
            <TabsTrigger className="w-full py-4" value="answers">
              جوابها
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <QuestionTab
              searchParams={searchParams}
              userId={userInfo.user.id}
            />
          </TabsContent>
          <TabsContent value="answers" className="flex w-full flex-col gap-6">
            <AnswerTab searchParams={searchParams} userId={userInfo.user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default page
