'use client'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import GlobalFilters from './GlobalFilters'
import {
  globalHomeSearch,
  globalSearch,
} from '@/lib/actions/social/general.action'
import { GlobalHomeSearchFilters, GlobalSearchFilters } from '@/lib/constants'
import {
  translateGlobalHomeSearchFiltersType,
  translateGlobalSocialFilterType,
} from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
// import { globalSearch } from '@/lib/actions/general.action'

interface GlobalResultProps {
  social?: boolean
}

const GlobalResult: FC<GlobalResultProps> = ({ social }) => {
  const searchParams = useSearchParams()

  const [result, setResult] = useState([
    // { type: 'question', id: 1, title: 'Next.js' },
    // { type: 'tag', id: 1, title: 'Nextjs' },
    // { type: 'user', id: 1, title: 'jsm' },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const global = searchParams.get('global')
  const type = searchParams.get('type')

  useEffect(() => {
    const fetchResult = async () => {
      setResult([])
      setIsLoading(true)
      try {
        // Everything Everywhere all at once
        const res = social
          ? await globalSearch({ query: global, type })
          : await globalHomeSearch({ query: global, type })
        setResult(JSON.parse(res))
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }

    if (global) fetchResult()
  }, [global, type])
  const renderLink = (type: string, id: string) => {
    if (social) {
      switch (type) {
        case 'question':
          return `/social/question/${id}`
        case 'answer':
          return `/social/question/${id}`
        case 'user':
          return `/social/profile/${id}`
        case 'tag':
          return `/social/tags/${id}`

        default:
          return '/social'
      }
    } else {
      switch (type) {
        case 'product':
          return `/products/${id}`
        case 'contributor':
          return `/contributors/${id}`
        case 'category':
          return `/categories/${id}`

        default:
          return '/'
      }
    }
  }

  return (
    <div
      dir="rtl"
      className="absolute left-0 z-10 mt-3 w-full rounded-xl bg-muted-foreground/90  backdrop-blur-3xl py-5 shadow-sm"
    >
      <p className="px-5">
        <GlobalFilters
          filters={social ? GlobalSearchFilters : GlobalHomeSearchFilters}
        />
      </p>
      <div className="my-5 h-[1px] bg-muted " />
      <div className="space-y-5">
        <p className="px-5">بهترین نتایج</p>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center px-5">
            <Loader2 size={40} className="animate-spin" />
            <p className="animate-pulse">جست‌وجوی همه</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 ">
            {result.length > 0 ? (
              result.map((item: any, index: number) => (
                <Link
                  href={renderLink(item.type, item.id)}
                  key={item.type + item.id + index}
                  className="flex w-full cursor-pointer items-start gap-3 px-5 py-1.5"
                >
                  <Image
                    src="/assets/icons/tag.svg"
                    alt="tags"
                    width={18}
                    height={18}
                    className="mt-1 object-contain"
                  />
                  <div className="flex flex-col">
                    <p className="line-clamp-1">{item.title}</p>
                    <p className="mt-1 text-muted font-bold">
                      در{' '}
                      {social
                        ? translateGlobalSocialFilterType(item.type)
                        : translateGlobalHomeSearchFiltersType(item.type)}{' '}
                      ها
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center px-5 ">
                <p className="px-5 py-2.5">نتیجه‌ای یافت نشد!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default GlobalResult
