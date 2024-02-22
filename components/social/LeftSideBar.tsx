'use client'

import { usePathname } from 'next/navigation'
import { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { sidebarLinks } from '@/lib/constants'

interface LeftSideBarProps {
  userId: string | undefined
}

const LeftSideBar: FC<LeftSideBarProps> = ({ userId }) => {
  const pathname = usePathname()
  // const userId = useAuth()
  // const userId = '12346'
  // console.log(userId)
  return (
    <section className="sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-r border-gray-700 bg-slate-400 p-6 pt-36 shadow dark:bg-gray-900 dark:text-slate-200 max-sm:hidden lg:w-[266px] ">
      <div className=" flex h-full flex-1 flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route

          if (item.route === '/profile') {
            if (userId) {
              item.route = `${item.route}/${userId}`
            } else {
              return null
            }
          }
          return (
            <Link
              key={item.route}
              href={item.route}
              className={`flex items-center justify-start gap-4 rounded-lg bg-black/20  p-4 ${
                isActive
                  ? 'rounded-lg bg-gray-700 text-slate-200 dark:text-slate-300'
                  : 'text-slate-300 dark:text-slate-400'
              }`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={``}
              />
              <p
                className={`max-lg:hidden ${isActive ? 'font-semibold' : ''} `}
              >
                {item.label}
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default LeftSideBar
