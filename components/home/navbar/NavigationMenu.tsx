'use client'

import * as React from 'react'
import Link from 'next/link'

import { cn, getCartTotal } from '@/lib/utils'
// import { Icons } from '@/components/icons'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Billboard, Contributor, Product } from '@prisma/client'
import { ShoppingBasket } from 'lucide-react'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { useCartStore } from '@/store'
const components: { title: string; href: string; description: string }[] = [
  {
    title: 'Alert Dialog',
    href: '/docs/primitives/alert-dialog',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Hover Card',
    href: '/docs/primitives/hover-card',
    description:
      'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Progress',
    href: '/docs/primitives/progress',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Scroll-area',
    href: '/docs/primitives/scroll-area',
    description: 'Visually or semantically separates content.',
  },
  {
    title: 'Tabs',
    href: '/docs/primitives/tabs',
    description:
      'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
  },
  {
    title: 'Tooltip',
    href: '/docs/primitives/tooltip',
    description:
      'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
  },
]

interface NavigationMenuProps {
  contributors: {
    writers: Contributor[] | null
    translators: Contributor[] | null
    editors: Contributor[] | null
    photographers: Contributor[] | null
    illustrators: Contributor[] | null
  } | null
  billboards:
    | (Billboard & { categories: { id: string; name: string }[] })[]
    | null
}
export function DesktopNavigationMenu({
  contributors,
  billboards,
}: NavigationMenuProps) {
  // console.log(contributors?.writers)
  // const cart = useAppSelector<Product[]>((state) => state.items)
  const cart = useCartStore((state) => state.cart)

  const total = getCartTotal(cart)
  // const [mounted, setMounted] = React.useState(false)
  // React.useEffect(() => {
  //   setMounted(true)
  // }, [])

  // if (!mounted) {
  //   return ''
  // }
  return (
    <NavigationMenu
      dir="rtl"
      className="hidden md:flex p-4 pr-8 w-1/2 justify-evenly items-center "
    >
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>کتابها</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {billboards?.map((billboard) => (
                <ListItem
                  key={billboard.id}
                  title={billboard.label}
                  href={billboard.id}
                >
                  {billboard.label}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>عوامل کتاب</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {contributors?.writers?.map((writer) => (
                <ListItem key={writer.id} title={writer.name} href={writer.id}>
                  {writer.name}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              درباره ما
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              ارتباط با ما
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/cart" legacyBehavior passHref>
            <NavigationMenuLink
              className={cn(
                navigationMenuTriggerStyle(),
                'relative flex items-center space-x-2'
              )}
            >
              <ShoppingBasket size={20} />
              {/* <p>{total}</p> */}
              <p className="text-rose-500 absolute -top-1 right-[35%] border rounded-full border-rose-400 text-center dark:border-rose-300 w-[16px] h-[16px] ">
                {cart.length}
              </p>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
