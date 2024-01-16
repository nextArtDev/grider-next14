'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { UserButton } from '@/components/auth/user-button'

export const Navbar = () => {
  const pathname = usePathname()

  return (
    <nav className="mb-auto bg-secondary flex  justify-between items-center p-4 rounded-xl w-full max-w-[600px] shadow-sm">
      <div className="flex flex-wrap gap-2">
        <Button
          asChild
          variant={pathname === '/settings' ? 'default' : 'outline'}
        >
          <Link href="/settings">تنظیمات</Link>
        </Button>
        <Button
          asChild
          variant={pathname === '/server' ? 'default' : 'outline'}
        >
          <Link href="/server">سرور</Link>
        </Button>
        <Button
          asChild
          variant={pathname === '/client' ? 'default' : 'outline'}
        >
          <Link href="/client">کلاینت</Link>
        </Button>
        <Button asChild variant={pathname === '/admin' ? 'default' : 'outline'}>
          <Link href="/admin">ادمین</Link>
        </Button>
      </div>
      <div className="mr-auto">
        <UserButton />
      </div>
    </nav>
  )
}
