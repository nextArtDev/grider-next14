'use client'

import { FC, useState } from 'react'

import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { HomePageFilters } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { fromUrlQuery } from '@/lib/socialUtils'

interface HomeFiltersProps {}

const HomeFilters: FC<HomeFiltersProps> = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [active, setActive] = useState('')

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive('')
      const newUrl = fromUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: null,
      })
      router.push(newUrl, { scroll: false })
    } else {
      setActive(item)
      const newUrl = fromUrlQuery({
        params: searchParams.toString(),
        key: 'filter',
        value: item.toLowerCase(),
      })
      router.push(newUrl, { scroll: false })
    }
  }

  // const isActive = 'frequent'
  return (
    <section className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => (
        <Button
          key={item.value}
          onClick={() => handleTypeClick(item.value)}
          className={cn(
            ' rounded-lg px-6 py-3 capitalize shadow-none',
            active === item.value
              ? ' bg-gradient-to-tr from-slate-600 via-gray-800 to-slate-800 shadow-inner shadow-slate-200 text-slate-200'
              : ''
          )}
          // onClickCapture={() => handleTypeClick(item.value)}
        >
          {item.name}
        </Button>
      ))}
    </section>
  )
}

export default HomeFilters
