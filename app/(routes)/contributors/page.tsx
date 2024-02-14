import ContributorList from '@/components/home/contributors/ContributorList'
import { getAllContributorsWithoutRole } from '@/lib/queries/home/contributors'
import React from 'react'

async function page() {
  const contributors = await getAllContributorsWithoutRole()
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
