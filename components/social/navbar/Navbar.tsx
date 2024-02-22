import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import SiteLogo from '../../../public/assets/images/site-logo.svg'
import MobileNav from './MobileNav'
// import GlobalSearch from '../search/GlobalSearch'

type Props = {}

const Navbar = (props: Props) => {
  return (
    <nav
      dir="ltr"
      className=" fixed z-50 flex w-full items-center justify-between gap-5 border-b border-gray-700 dark:bg-gray-900 bg-gray-400 dark:shadow-none sm:px-12 "
    >
      <Link href={'/'} className="flex items-center gap-1">
        <Image src={SiteLogo} width={23} height={23} alt="DevFlow" />
        <p className=" font-bold text-white/50 max-sm:hidden ">
          Dev <span className="text-secondary">Overflow</span>{' '}
        </p>
      </Link>
      {/* <GlobalSearch /> */}
      <div className="flex-between gap-5">
        <MobileNav />
      </div>
    </nav>
  )
}

export default Navbar
