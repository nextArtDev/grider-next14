'use client'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import Hamburger from '../../../public/assets/icons/hamburger.svg'
import SiteLogo from '../../../public/assets/images/site-logo.svg'

import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

import { usePathname } from 'next/navigation'
import { sidebarLinks } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { useCurrentUser } from '@/hooks/use-current-user'

const NavContent = () => {
  const pathname = usePathname()

  return (
    <section className=" flex  h-full flex-col gap-6 pt-16  ">
      {sidebarLinks.map((item) => {
        const isActive =
          (pathname.includes(item.route) && item.route.length > 1) ||
          pathname === item.route
        return (
          <SheetClose asChild key={item.route}>
            <Link
              href={item.route}
              className={`flex items-center justify-start gap-4 rounded-lg p-4 ${
                isActive
                  ? 'rounded-lg bg-muted-foreground text-muted font-semibold '
                  : 'bg-muted text-muted-foreground '
              }`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`${
                  isActive ? 'invert-0 dark:invert' : 'invert dark:invert-0'
                }`}
              />
              <p className={`${isActive ? 'font-bold' : ''}`}>{item.label}</p>
            </Link>
          </SheetClose>
        )
      })}
    </section>
  )
}
interface MobileNavProps {}

const MobileNav: FC<MobileNavProps> = () => {
  const user = useCurrentUser()
  return (
    <div className="rounded-lg bg-transparent ">
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src={Hamburger}
            alt="menu"
            width={36}
            height={36}
            className="cursor-pointer p-1 m-1 sm:hidden  "
          />
        </SheetTrigger>
        <SheetContent side={'right'} className="">
          <Link href={'/'} className="flex items-center gap-1">
            <Image src={SiteLogo} width={23} height={23} alt="DevFlow" />
            <p className="font-bold text-secondary">
              Dev <span className="text-primary">Overflow</span>{' '}
            </p>
          </Link>
          <div>
            <SheetClose asChild>
              <NavContent />
            </SheetClose>

            {/* <SignOut> */}
            {!user?.id && !user?.isVerified && (
              <div className="flex flex-col gap-3 mt-4 ">
                <SheetClose asChild>
                  <Link href={'/login'}>
                    <Button variant={'secondary'} className="w-full px-4 py-3 ">
                      <span>ورود</span>
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            )}
            {/* </SignOut> */}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNav
