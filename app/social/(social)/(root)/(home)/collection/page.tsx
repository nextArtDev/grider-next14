// import { UserButton } from '@clerk/nextjs'

// import QuestionCard from '@/components/card/QuestionCard'
// import NoResult from '@/components/shared/NoResult'
// import Pagination from '@/components/shared/Pagination'
// import Filter from '@/components/shared/search/Filter'
// import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
// import { QuestionFilters } from '@/constants'
// import { getCurrentUser } from '@/lib/actions/getCurrentUser'
// import { getSavedQuestions } from '@/lib/actions/user.action'
// import { SearchParamsProps } from '@/types'
import { redirect } from 'next/navigation'
import searchImage from '@/public/assets/icons/search.svg'
import { currentUser } from '@/lib/auth'
import { SearchParamsProps } from '@/types/social'
import { getSavedQuestions } from '@/lib/actions/social/user.action'
import LocalSearchbar from '@/components/social/search/LocalSearchbar'
import Filter from '@/components/social/search/Filter'
import { QuestionFilters } from '@/lib/constants'
import QuestionCard from '@/components/social/card/QuestionCard'
import NoResult from '@/components/social/NoResult'
import Pagination from '@/components/social/Pagination'

export default async function Home({ searchParams }: SearchParamsProps) {
  // const {userId} = auth()
  const user = await currentUser()
  if (!user) redirect('/login')

  const userId = user?.id

  const result = await getSavedQuestions({
    userId,
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  })
  // const { question, isNext } = result
  // console.log(result?.questions)
  return (
    <>
      <h1 className="font-bold ">مباحث ذخیره شده</h1>

      <div className="mt-11 flex flex-col justify-between gap-5 max-sm:flex-col sm:items-center ">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc={searchImage}
          placeholder="جست و جوی سوال"
          otherClasses="flex-1"
        />
        <Filter
          filters={QuestionFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
        <div className="mt-10 flex w-full flex-col gap-6">
          {result?.questions?.length ? (
            result?.questions?.map((question) => (
              <QuestionCard
                key={question.id}
                id={question.id}
                title={question.title}
                tags={question.tags}
                author={question.author}
                upvotes={question.upvoters}
                views={question?.views}
                answers={question.answers}
                createdAt={question.created_at}
              />
            ))
          ) : (
            <NoResult
              title="بحث ذخیره شده‌ای برای نمایش وجود ندارد."
              description=""
              link="/ask-question"
              linkTitle="Ask A Question"
            />
          )}
        </div>
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </>
  )
}
