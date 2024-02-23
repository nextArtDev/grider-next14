// import NoResult from '@/components/shared/NoResult'
// import Pagination from '@/components/shared/Pagination'
// import Filter from '@/components/shared/search/Filter'
// import LocalSearchbar from '@/components/shared/search/LocalSearchbar'
// import { TagFilters } from '@/constants'
// import { getAllTags } from '@/lib/actions/tag.actions'
// import { SearchParamsProps } from '@/types'
import NoResult from '@/components/social/NoResult'
import Pagination from '@/components/social/Pagination'
import Filter from '@/components/social/search/Filter'
import LocalSearchbar from '@/components/social/search/LocalSearchbar'
import { getAllTags } from '@/lib/actions/social/tag.actions'
import { TagFilters } from '@/lib/constants'
import { SearchParamsProps } from '@/types/social'
import Link from 'next/link'
import SearchImage from '@/public/assets/icons/search.svg'

async function page({ searchParams }: SearchParamsProps) {
  const result = await getAllTags({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  })
  // console.log(result.tags)
  return (
    <div className="text-slate-200">
      <h1 className="font-bold text-gray-100"> همه تگ‌ها</h1>

      <div className="mt-11 flex flex-col justify-between gap-5 max-sm:flex-col sm:items-center ">
        <LocalSearchbar
          route="/tags"
          iconPosition="left"
          imgSrc={SearchImage}
          placeholder="جست‌وجوی تگها"
          otherClasses="flex-1"
        />
        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <section className="mt-12 flex flex-wrap gap-4">
        {result.tags.length > 0 ? (
          result.tags.map((tag) => (
            <Link href={`/social/tags/${tag.id}`} key={tag.id} className=" ">
              <article className="flex w-full flex-col items-center justify-center rounded-2xl border bg-slate-600 px-8 py-10 sm:w-[260px]">
                <div className="w-fit rounded-sm bg-slate-200 px-5 py-1.5">
                  <p className="font-semibold text-slate-700 ">{tag.name}</p>
                </div>
                <p className="mt-3.5 text-slate-400 ">
                  <span className="ml-1.5 font-semibold ">
                    {tag.questions.length}+
                  </span>
                  بحث
                </p>
              </article>
            </Link>
          ))
        ) : (
          <NoResult
            title="تگی پیدا نشد"
            description="بنظر می‌رسد تگی وجود ندارد."
            link="/social/ask-question"
            linkTitle="Ask a question"
          />
        )}
      </section>
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={result.isNext}
        />
      </div>
    </div>
  )
}

export default page
