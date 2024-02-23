// import QuestionCard from '@/components/card/QuestionCard'
// import NoResult from '@/components/shared/NoResult'
// import Pagination from '@/components/shared/Pagination'
// import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
// import { IQuestion } from '@/database/question.model'
// import { getQuestionsByTagId } from '@/lib/actions/tag.actions'
// import { URLProps } from '@/types'
import { FC } from 'react'
import SearchImage from '@/public/assets/icons/search.svg'
import { getQuestionsByTagId } from '@/lib/actions/social/tag.actions'
import { URLProps } from '@/types/social'
import LocalSearchbar from '@/components/social/search/LocalSearchbar'
import QuestionCard from '@/components/social/card/QuestionCard'
import NoResult from '@/components/social/NoResult'
import Pagination from '@/components/social/Pagination'
// interface pageProps {
//   params: { id: string }
//   searchParams: string
// }

const page: FC<URLProps> = async ({ params, searchParams }) => {
  const result = await getQuestionsByTagId({
    tagId: params.id,
    page: searchParams.page ? +searchParams.page : 1,
    searchQuery: searchParams.q,
  })

  // console.log(result)
  return (
    <>
      <h1 className="font-bold text-gray-100"> {result?.tagTitle}</h1>

      <div className="mt-11 w-full">
        <LocalSearchbar
          route={`/tags/${params.id}`}
          iconPosition="left"
          imgSrc={SearchImage}
          placeholder="جست‌وجوی سوال تگ"
          otherClasses="flex-1"
        />

        <div className="mt-10 flex w-full flex-col gap-6">
          {result?.questions?.length ? (
            result?.questions.map((question: any) => (
              <QuestionCard
                key={question.id}
                id={question.id}
                title={question.title}
                tags={question.tags}
                author={question.author}
                upvotes={question.upvoters}
                views={question.views}
                answers={question.answers}
                createdAt={question.created_at}
              />
            ))
          ) : (
            <NoResult
              title="سوال تگی برای نمایش وجود ندارد."
              description="Lorem ipsum dolor, sit amet consectetur adipisicing elit. Provident
        quibusdam tempora veritatis id facere animi sequi ipsam adipisci, error
        repudiandae, repellendus debitis omnis ab iusto, explicabo quia quod
        quos. Corporis."
              link="/ask-question"
              linkTitle="Ask A Question"
            />
          )}
        </div>
      </div>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result?.isNext}
        />
      </div>
    </>
  )
}

export default page
