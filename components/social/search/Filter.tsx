'use client'
import { cn } from '@/lib/utils'
import { FC } from 'react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter, useSearchParams } from 'next/navigation'
import { fromUrlQuery } from '@/lib/socialUtils'

interface FilterProps {
  filters: { name: string; value: string }[]
  otherClasses?: string
  containerClasses?: string
}

const Filter: FC<FilterProps> = ({
  filters,
  otherClasses,
  containerClasses,
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const paramFilter = searchParams.get('filter')

  const handleUpdateParams = (value: string) => {
    const newUrl = fromUrlQuery({
      params: searchParams.toString(),
      key: 'filter',
      value,
    })

    router.push(newUrl, { scroll: false })
  }
  return (
    <article className={cn('relative', containerClasses)}>
      <Select
        onValueChange={(value) => handleUpdateParams(value)}
        defaultValue={paramFilter || undefined}
      >
        <SelectTrigger
          className={cn(
            ' bg-gradient-to-tr from-slate-700 via-slate-900 to-slate-500 text-slate-200 shadow-sm shadow-slate-400 outline-none placeholder:text-slate-300',
            otherClasses
          )}
        >
          <div className=" line-clamp-1 flex-1 pr-4 text-right ">
            <SelectValue placeholder="یک فیلتر انتخاب کنید" />
          </div>
        </SelectTrigger>
        <SelectContent
          dir="rtl"
          className=" bg-gradient-to-tr from-slate-700 via-slate-900 to-slate-500 text-slate-200 "
        >
          <SelectGroup>
            {filters.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </article>
  )
}

export default Filter
