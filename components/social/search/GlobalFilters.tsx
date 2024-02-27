'use client'
import { Button } from '@/components/ui/button'
import { GlobalSearchFilters } from '@/lib/constants'
import { fromUrlQuery } from '@/lib/socialUtils'

import { cn } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { FC, useState } from 'react'

interface GlobalFiltersProps {
  filters: {
    name: string
    value: string
  }[]
}

const GlobalFilters: FC<GlobalFiltersProps> = ({ filters }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const typeParams = searchParams.get('type')
  const [active, setActive] = useState(typeParams || '')

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive('')
      const newUrl = fromUrlQuery({
        params: searchParams.toString(),
        key: 'type',
        value: null,
      })
      router.push(newUrl, { scroll: false })
    } else {
      setActive(item)
      const newUrl = fromUrlQuery({
        params: searchParams.toString(),
        key: 'type',
        value: item.toLowerCase(),
      })
      router.push(newUrl, { scroll: false })
    }
  }
  return (
    <div className=" flex items-center gap-5 px-5">
      <div className="flex items-center gap-6">
        <p className="font-semibold">نوع:</p>
        {filters.map((item) => (
          <Button
            key={item.value}
            onClick={() => handleTypeClick(item.value)}
            className={cn(
              `rounded-full hover:text-slate-500 hover:bg-rose-300`,
              active === item.value ? 'bg-rose-400 text-slate-200 ' : ''
            )}
            variant={'secondary'}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default GlobalFilters
