'use client'

import { FC, useState } from 'react'

import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { HomePageFilters } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { fromUrlQuery } from '@/lib/socialUtils'

interface HomeFiltersProps {
  filters: { name: string; value: string }[]
}

const HomeFilters: FC<HomeFiltersProps> = ({ filters }) => {
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
        value: item,
      })
      router.push(newUrl, { scroll: false })
    }
  }

  // const isActive = 'frequent'
  return (
    <section className="mt-10 hidden flex-wrap gap-3 md:flex">
      {filters.map((item) => (
        <Button
          key={item.value}
          onClick={() => handleTypeClick(item.value)}
          variant={active === item.value ? 'destructive' : 'outline'}
          className={cn(' rounded-lg px-6 py-3 capitalize shadow-none')}
        >
          {item.name}
        </Button>
      ))}
    </section>
  )
}

export default HomeFilters
