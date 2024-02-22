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
              className={`flex items-center justify-start gap-4 rounded-lg bg-black/20  p-4 ${
                isActive
                  ? 'rounded-lg bg-black/60 font-semibold text-gray-200 '
                  : 'text-gray-400'
              }`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className={`invert-0`}
              />
              <p>{item.label}</p>
            </Link>
          </SheetClose>
        )
      })}
    </section>
  )
}
interface MobileNavProps {}

const MobileNav: FC<MobileNavProps> = () => {
  return (
    <div className="rounded-lg bg-transparent ">
      <Sheet>
        <SheetTrigger asChild>
          <Image
            src={Hamburger}
            alt="menu"
            width={36}
            height={36}
            className="text-black sm:hidden  "
          />
        </SheetTrigger>
        <SheetContent side={'left'} className="bg-gray-900 text-white">
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
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default MobileNav
