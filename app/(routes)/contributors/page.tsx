import ContributorList from '@/components/home/contributors/ContributorList'
import Pagination from '@/components/social/Pagination'
import { getAllContributorsWithoutRole } from '@/lib/queries/home/contributors'
import { SearchParamsProps } from '@/types/social'
import React from 'react'

async function page({ searchParams }: SearchParamsProps) {
  const contributors = await getAllContributorsWithoutRole({
    searchQuery: searchParams.q,
    page: searchParams.page ? +searchParams.page : 1,
  })
  if (!contributors.contributors)
    return (
      <p className="w-full h-full flex items-center justify-center text-muted text-2xl">
        هنوز هیچ کدام از عوامل انتشار کتاب اضافه نشده است.
      </p>
    )
  // console.log(contributors)
  return (
    <div>
      <ContributorList contributors={contributors.contributors} />
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={contributors.isNext}
        />
      </div>
    </div>
  )
}

export default page
