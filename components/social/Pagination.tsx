'use client'
import { FC } from 'react'
import { Button } from '../ui/button'
import { fromUrlQuery } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'

interface PaginationProps {
  pageNumber: number
  isNext: boolean
}

const Pagination: FC<PaginationProps> = ({ pageNumber = 1, isNext }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleNavigation = (direction: string) => {
    const nextPageNumber =
      direction === 'prev' ? pageNumber - 1 : pageNumber + 1

    const newUrl = fromUrlQuery({
      params: searchParams.toString(),
      key: 'page',
      value: nextPageNumber.toString(),
    })
    router.push(newUrl)
  }
  if (!isNext && pageNumber === 1) return null
  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button
        disabled={pageNumber === 1}
        onClick={() => handleNavigation('prev')}
        className="flex min-h-[36px] items-center justify-center gap-2 border"
      >
        <p>قبلی</p>
      </Button>
      <div className="flex items-center  justify-center rounded-md bg-rose-500 px-3.5 py-2">
        <p className="font-semibold text-slate-200 ">{pageNumber}</p>
      </div>
      <Button
        disabled={!isNext}
        onClick={() => handleNavigation('next')}
        className="flex min-h-[36px] items-center justify-center gap-2 border"
      >
        <p>بعدی</p>
      </Button>
    </div>
  )
}

export default Pagination
