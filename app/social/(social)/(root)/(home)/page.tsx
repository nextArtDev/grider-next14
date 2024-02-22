// import { UserButton } from '@clerk/nextjs'

// import QuestionCard from '@/components/card/QuestionCard'
// import HomeFilters from '@/components/home/HomeFilters'
// import NoResult from '@/components/shared/NoResult'
// import Pagination from '@/components/shared/Pagination'
// import Filter from '@/components/shared/search/Filter'
// import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
// import { HomePageFilters } from '@/constants'
// import { getCurrentUser } from '@/lib/actions/getCurrentUser'
import NoResult from '@/components/social/NoResult'
import Pagination from '@/components/social/Pagination'
import QuestionCard from '@/components/social/card/QuestionCard'
import HomeFilters from '@/components/social/home/HomeFilters'
import Filter from '@/components/social/search/Filter'
import LocalSearchbar from '@/components/social/search/LocalSearchbar'
import { Button } from '@/components/ui/button'
import { currentUser } from '@/lib/auth'
import { HomePageFilters } from '@/lib/constants'
import { SearchParamsProps } from '@/types/social'
// import {
//   getQuestions,
//   getRecommendedQuestions,
// } from '@/lib/actions/question.action'
// import { SearchParamsProps } from '@/types'
import { Metadata } from 'next'
import Link from 'next/link'
import SearchIcon from '../../../../../public/assets/icons/search.svg'
import { Pen, PenLine, PenSquare, PenTool } from 'lucide-react'
// import SearchIcon from '/public/assets/icons/search.svg'

export const metadata: Metadata = {
  title: 'Home | DevFlow',
  description:
    'A community-driven platform for asking and answering programming questions',
}

const questions = [
  {
    id: 1,
    title: 'Cascading Deletes in SQLAlchemy',
    tags: [
      { id: 1, name: 'python' },
      { id: 2, name: 'sql' },
    ],
    author: 'John Doe',
    upvotes: 10,
    views: 100,
    answers: 2,
    created_at: '2023-09-01T12:00:00.000z',
  },
  {
    id: 2,
    title: 'How to create CSS grid',
    tags: [
      { id: 1, name: 'CSS' },
      { id: 2, name: 'TailwindCSS' },
    ],
    author: 'John Doe',
    upvotes: 14000000.5,
    views: 10,
    answers: 2,
    created_at: '2023-09-01T12:00:00.000z',
  },
]
export default async function Home({ searchParams }: SearchParamsProps) {
  const user = await currentUser()

  const userId = user?.id

  let result
  if (searchParams?.filter === 'پیشنهادی') {
    if (!userId) {
      //   result = await getRecommendedQuestions({
      //     userId,
      //     searchQuery: searchParams.q,
      //     page: searchParams.page ? +searchParams.page : 1,
      //   })
    } else {
      result = {
        questions: [],
        isNext: false,
      }
    }
  } else {
    // result = await getQuestions({
    //   searchQuery: searchParams.q,
    //   filter: searchParams.filter,
    //   page: searchParams.page ? +searchParams.page : 1,
    // })
  }

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center ">
        <h1 className="font-bold text-xl lg:text-2xl ">همه موضوعات</h1>
        <Link href={'/social/ask-question'} className="flex justify-end ">
          <Button
            variant={'destructive'}
            className="min-h-[46px] pr-2 py-3 pl-4 flex gap-x-1 "
          >
            <PenTool className="pb-1.5 -rotate-90 " />
            <p className="underline underline-offset-[6px] ">طرح موضوع</p>
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex flex-col justify-between gap-5 max-sm:flex-col sm:items-center ">
        <LocalSearchbar
          route="/social"
          iconPosition="left"
          imgSrc={SearchIcon}
          placeholder="جست‌وجوی سوالات"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />

        <HomeFilters />

        <div className="mt-10 flex w-full flex-col gap-6">
          {/* {result.questions?.length ? (
            result.questions.map((question) => (
              <QuestionCard
                key={question.id}
                id={question.id}
                title={question.title}
                tags={question.tags}
                author={question.author}
                upvotes={question.upvotes}
                views={question.views}
                answers={question.answers}
                createdAt={question.created_at}
              />
            )) */}
          {questions?.length ? (
            questions.map((question) => (
              <QuestionCard
                key={question.id}
                id={question.id}
                title={question.title}
                tags={question.tags}
                author={question.author}
                upvotes={question.upvotes}
                views={question.views}
                answers={question.answers}
                createdAt={question.created_at}
              />
            ))
          ) : (
            <NoResult
              title="بحثی برای نمایش وجود ندارد"
              description=""
              link="/social/ask-question"
              linkTitle="بحث مطرح کنید"
            />
          )}
        </div>
      </div>
      <div className="mt-10">
        {/* <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        /> */}
      </div>
    </>
  )
}
