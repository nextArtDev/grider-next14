'use client'

import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useState } from 'react'
import RouteSwitcher from './StoreMenu'
import StoreMenu from './StoreMenu'

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()
  const params = useParams()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  // we can use `/${params.storeId}` because we use it inside <Navbar> component which is inside dynamic routes!
  const routes = [
    {
      //just redirecting to dashboard, it can be home or everything
      href: `/${params.storeId}`,
      label: 'وضعیت',
      active: pathname === `/dashboard/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/billboards`,
      label: 'بیلبوردها',
      active: pathname === `/dashboard/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: 'دسته‌بندی‌ها',
      active: pathname === `/dashboard/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: 'سایزها',
      active: pathname === `/dashboard/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/colors`,
      label: 'رنگ‌ها',
      active: pathname === `/dashboard/${params.storeId}/colors`,
    },
    {
      href: `/${params.storeId}/products`,
      label: 'محصولات',
      active: pathname === `/dashboard/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: 'سفارشات',
      active: pathname === `/dashboard/${params.storeId}/orders`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: 'تنظیمات',
      active: pathname === `/dashboard/${params.storeId}/settings`,
    },
  ]

  return (
    <nav
      className={cn(
        'flex items-center gap-4 lg:gap-6 max-w-sm:overflow-x-scroll',
        className
      )}
      {...props}
    >
      <div className="md:hidden">
        <StoreMenu routes={routes} />
      </div>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'hidden md:block text-sm font-medium transition-colors hover:text-primary',
            route.active
              ? 'text-black underline underline-offset-8 dark:text-white'
              : 'text-muted-foreground'
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
