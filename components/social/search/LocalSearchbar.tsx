'use client'
import { Input } from '@/components/ui/input'
import { cn, fromUrlQuery, removeKeysFromUrlQuery } from '@/lib/utils'
import Image, { type ImageProps } from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

interface LocalSearchbarProps {
  route: string
  iconPosition: string
  imgSrc: ImageProps
  otherClasses?: string
  placeholder?: string
}

const LocalSearchbar: FC<LocalSearchbarProps> = ({
  route,
  iconPosition,
  imgSrc,
  otherClasses,
  placeholder,
}) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const query = searchParams.get('q')

  // initial value is "(query || '')" because we want to automatically populate alder "query" with new search
  const [search, setSearch] = useState(query || '')

  // to reflect search input values to url query
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = fromUrlQuery({
          // we pass params because there could be other params like category, filtering and ...
          params: searchParams.toString(),
          key: 'q',
          value: search,
        })
        router.push(newUrl, { scroll: false })
      } else if (pathname === route) {
        // if we clear up the search input
        const newUrl = removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ['q'],
        })
        // to not scroll to top of the page
        router.push(newUrl, { scroll: false })
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [search, route, pathname, router, searchParams, query])

  return (
    <article
      className={cn(
        'flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4 bg-muted',
        otherClasses
      )}
    >
      {iconPosition === 'left' && (
        <Image
          src={imgSrc.src}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
        }}
        className="border-none outline-none "
      />
      {iconPosition === 'right' && (
        <Image
          src={imgSrc.src}
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </article>
  )
}

export default LocalSearchbar
