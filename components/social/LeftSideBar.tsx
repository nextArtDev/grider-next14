'use client'

import { usePathname } from 'next/navigation'
import { FC } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { sidebarLinks } from '@/lib/constants'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Button } from '../ui/button'
import Account from '../../public/assets/icons/account.svg'
interface LeftSideBarProps {
  userId: string | undefined
}

const LeftSideBar: FC<LeftSideBarProps> = ({ userId }) => {
  const pathname = usePathname()
  return (
    <section className="sticky left-0 top-0 flex h-screen flex-col justify-between overflow-y-auto border-l border-primary-foreground  p-6 pt-24 shadow   max-sm:hidden lg:w-[266px] ">
      <div className=" flex h-full flex-1 flex-col gap-6">
        {sidebarLinks.map((item) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            pathname === item.route

          if (item.route === '/social/profile') {
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
              className={`flex items-center justify-start gap-4 rounded-lg p-4 ${
                isActive
                  ? 'rounded-lg bg-muted-foreground text-muted font-semibold'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                style={{ transform: 'rotateY(180deg)' }}
                className={`${
                  isActive ? 'invert-0 dark:invert' : 'invert dark:invert-0'
                }`}
              />
              <p className={`max-lg:hidden ${isActive ? 'font-bold' : ''} `}>
                {item.label}
              </p>
            </Link>
          )
        })}
      </div>
      {!userId && (
        <div className="flex flex-col gap-3 mt-4 ">
          <Link href={'/login'}>
            <Button variant={'destructive'} className="w-full px-4 py-3 ">
              <Image
                src={Account}
                alt="login"
                width={20}
                height={20}
                className="invert-0 lg:hidden"
              />
              <span className="max-lg:hidden">ورود</span>
            </Button>
          </Link>
        </div>
      )}
    </section>
  )
}

export default LeftSideBar
