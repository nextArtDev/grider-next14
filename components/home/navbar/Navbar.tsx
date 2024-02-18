import { getBillboardsWithCategories } from '@/lib/queries/home/billboard'
import MobileMenu from './MobileMenu'
import { DesktopNavigationMenu } from './NavigationMenu'
import { getAllContributors } from '@/lib/queries/home/contributors'
import { getAllContributions } from '@/lib/queries/dashboard/contributors'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { HomeIcon, User } from 'lucide-react'

import { FloatingNav } from '@/components/shared/FloatingNavbar'
import { LuLogIn } from 'react-icons/lu'

type Props = {}
const navItems = [
  {
    name: 'ورود',
    link: '/login',
    icon: (
      <LuLogIn className="mx-auto h-4 w-4 text-neutral-500 dark:text-white" />
    ),
  },
  {
    name: 'تغییر تم',
    // link: '/about',
    icon: <ThemeToggle />,
  },
  {
    name: 'صفحه اصلی',
    link: '/',
    icon: <HomeIcon className="h-4 w-4 text-neutral-500 dark:text-white" />,
  },
]

async function Navbar({}: Props) {
  const billboards = await getBillboardsWithCategories()
  const contributors = await getAllContributors()
  // console.log(contributors)
  return (
    <div className="flex justify-between items-center">
      <MobileMenu billboards={billboards} />
      <DesktopNavigationMenu
        contributors={contributors}
        billboards={billboards}
      />
      <div className=" flex gap-x-4 items-center justify-between  ml-8 ">
        <Link
          href={'/dashboard'}
          className={cn(buttonVariants({ variant: 'outline' }))}
        >
          دشبورد
        </Link>
        {/* <ThemeToggle /> */}
      </div>
      <div className="relative w-full ">
        <FloatingNav navItems={navItems} />
      </div>
    </div>
  )
}

export default Navbar
