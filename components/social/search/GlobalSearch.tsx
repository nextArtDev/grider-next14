'use client'
import { FC, useEffect, useRef, useState } from 'react'
import Search from '../../../public/assets/icons/search.svg'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { fromUrlQuery, removeKeysFromUrlQuery } from '@/lib/utils'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import GlobalResult from './GlobalResult'
interface GlobalSearchProps {}

const GlobalSearch: FC<GlobalSearchProps> = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const query = searchParams.get('q')

  const [search, setSearch] = useState(query || '')
  const [isOpen, setIsOpen] = useState(false)

  const searchContainerRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (
        searchContainerRef.current &&
        // @ts-ignore
        !searchContainerRef.current.contains(event.target)
      ) {
        setIsOpen(false)
        setSearch('')
      }
    }
    setIsOpen(false)

    document.addEventListener('click', handleOutsideClick)
    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [pathname])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = fromUrlQuery({
          params: searchParams.toString(),
          key: 'global',
          value: search,
        })
        router.push(newUrl, { scroll: false })
      } else {
        if (query) {
          const newUrl = removeKeysFromUrlQuery({
            params: searchParams.toString(),
            // we don't want to do global and local search at the same time
            keysToRemove: ['global', 'type'],
          })
          // to not scroll to top of the page
          router.push(newUrl, { scroll: false })
        }
      }
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [search, router, pathname, searchParams, query])

  return (
    <div
      ref={searchContainerRef}
      className="relative w-full max-w-[500px] max-lg:hidden "
    >
      <div className=" relative flex min-h-[56px] grow items-center gap-1 rounded-xl px-4 ">
        <Image
          src={Search}
          alt="Search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
        <Input
          dir="rtl"
          type="text"
          placeholder="جست‌وجوی کلی"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)

            if (!isOpen) setIsOpen(true)
            if (e.target.value === '' && isOpen) setIsOpen(false)
          }}
          className="ml-2 border-none text-slate-200 outline-none "
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  )
}

export default GlobalSearch
