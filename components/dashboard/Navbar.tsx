import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { MainNav } from './MainNav'
import StoreSwitcher from './StoreSwitcher'
import { ThemeToggle } from '../ui/theme-toggle'
import { auth } from '@/auth'
import { UserButton } from '../auth/user-button'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'

// import StoreSwitcher from '@/components/store-switcher'
// import { MainNav } from '@/components/main-nav'
// import { ThemeToggle } from '@/components/theme-toggle'

const Navbar = async () => {
  // const session = await getAuthSession()
  const session = await auth()
  const userId = session?.user.id

  if (!userId || session.user.role !== 'ADMIN') {
    redirect('/')
  }
  // //fetching all stores which this user owns
  const stores = await prisma.store.findMany({
    where: {
      userId,
    },
  })

  return (
    <div className="border-b">
      <ScrollArea dir="rtl">
        <div className="flex h-16 items-center px-4 ">
          <StoreSwitcher items={stores} />
          <MainNav className="px-8" />
          <ScrollBar orientation="horizontal" />
          {/* ml-auto push everything to the right */}
          <div className="mr-auto flex items-center text-right gap-4 space-x-4">
            <UserButton />
            {/* <div className="hidden sm:block">{session.user.name}</div> */}
            <ThemeToggle />
            {/* <UserButton afterSignOutUrl="/" /> */}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export default Navbar
