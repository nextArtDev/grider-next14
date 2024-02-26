import ContributorList from '@/components/home/contributors/ContributorList'
import { getAllContributorsWithoutRole } from '@/lib/queries/home/contributors'
import { SearchParamsProps } from '@/types/social'
import React from 'react'

async function page({ searchParams }: SearchParamsProps) {
  const contributors = await getAllContributorsWithoutRole({
    searchQuery: searchParams.q,
  })
  if (!contributors)
    return (
      <p className="w-full h-full flex items-center justify-center text-muted text-2xl">
        هنوز هیچ کدام از عوامل انتشار کتاب اضافه نشده است.
      </p>
    )
  // console.log(contributors)
  return (
    <div>
      <ContributorList contributors={contributors} />
    </div>
  )
}

export default page
