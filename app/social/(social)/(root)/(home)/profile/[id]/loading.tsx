import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

function Loading() {
  return (
    <section>
      <h1 className="text-xl font-semibold">All Users</h1>
      <div className="mb-12 mt-11 flex flex-wrap gap-5  ">
        <Skeleton className="h-14 flex-1 bg-slate-600" />
        <Skeleton className="h-14 w-28 bg-slate-600" />
      </div>
      <div className="flex flex-wrap gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((item) => (
          <Skeleton
            key={item}
            className="h-60 w-full rounded-2xl bg-slate-600 sm:w-[260px]"
          />
        ))}
      </div>
    </section>
  )
}

export default Loading
