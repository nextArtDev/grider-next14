'use client'
import { ElementRef, FC, useRef } from 'react'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

interface StoreMenuProps {
  routes: {
    href: string
    label: string
    active: boolean
  }[]
}

const StoreMenu: FC<StoreMenuProps> = ({ routes }) => {
  const closeSheetRef = useRef<ElementRef<'button'>>(null)
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col pt-16 gap-y-8 items-start ">
        {routes.map((route) => (
          <Link
            key={route.href}
            onClick={() => closeSheetRef.current?.click()}
            href={route.href}
            className={cn(
              buttonVariants({ variant: 'ghost' }),
              'text-sm w-full font-medium transition-colors hover:text-primary',
              route.active
                ? 'text-black underline underline-offset-8 dark:text-white'
                : 'text-muted-foreground'
            )}
          >
            {route.label}
          </Link>
        ))}
        <SheetClose ref={closeSheetRef} />
      </SheetContent>
    </Sheet>
  )
}

export default StoreMenu
