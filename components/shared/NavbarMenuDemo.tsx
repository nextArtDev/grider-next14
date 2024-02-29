'use client'
import { cn, getCartTotal } from '@/lib/utils'
import React, { useState } from 'react'
import { HoveredLink, Menu, MenuItem, ProductItem } from './NavbarMenu'
import { BillboardsWithImagesAndCategories } from '@/lib/queries/home/billboard'
import { GlobalSearchDriver } from './GlobalSearchDriver'
import { Search, ShoppingCart } from 'lucide-react'
import ButtonBorderMagic from './ButtonBorderMagic'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { useCartStore } from '@/store'

// export function NavbarDemo() {
//   return (
//     <div className="relative w-full flex items-center justify-center">
//       <Navbar className="top-2" />
//       <p className="text-black dark:text-white">
//         The Navbar will show on top of the page
//       </p>
//     </div>
//   )
// }
interface NavbarProps {
  className?: string
  billboards: BillboardsWithImagesAndCategories[] | null
}
export function Navbar({ className, billboards }: NavbarProps) {
  const [active, setActive] = useState<string | null>(null)
  const cart = useCartStore((state) => state.cart)

  const total = getCartTotal(cart)
  return (
    <div
      className={cn('fixed top-10 inset-x-0 max-w-2xl mx-auto z-50', className)}
    >
      <Menu setActive={setActive}>
        <MenuItem setActive={setActive} active={active} item="گروه‌ها">
          <div className="  text-sm grid grid-cols-2 gap-10 p-4">
            {billboards?.map((billboard) => (
              <ProductItem
                key={billboard.id}
                title={billboard.label}
                href={`/billboards/${billboard.id}`}
                src={billboard.image?.url || ''}
                description={billboard.categories
                  .slice(0, 5)
                  .map((category) => category.name)
                  .join('، ')}
              />
            ))}
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="بخش‌ها">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/categories">دسته‌بندی‌ها</HoveredLink>
            <HoveredLink href="/billboards">گروهها</HoveredLink>
            <HoveredLink href="/products">کتابها</HoveredLink>
            <HoveredLink href="/contributors">
              نویسندگان/مترجمان/...
            </HoveredLink>
          </div>
        </MenuItem>
        <MenuItem setActive={setActive} active={active} item="ما">
          <div className="flex flex-col space-y-4 text-sm">
            <HoveredLink href="/about-us">درباره‌ ما</HoveredLink>
            <HoveredLink href="/connect-us">ارتباط با ما</HoveredLink>
            {/* <HoveredLink href="/team">Team</HoveredLink>
            <HoveredLink href="/enterprise">Enterprise</HoveredLink> */}
          </div>
        </MenuItem>

        <div className="flex justify-self-end gap-x-2 mr-12 ">
          <Link href="/cart" className="relative flex items-center space-x-2">
            <ShoppingCart size={30} className="mt-2" />
            <p className="text-rose-500 absolute top-0 right-1.5 rounded-full text-center dark:border-rose-300 ">
              {cart.length}
            </p>
          </Link>
          <Link
            href={'/dashboard'}
            className={cn(buttonVariants({ variant: 'secondary' }), 'my-0')}
          >
            دشبورد
          </Link>
          <Link
            href={'/social'}
            className={cn(buttonVariants({ variant: 'destructive' }), 'my-0')}
          >
            شبکه اجتماعی
          </Link>
          {/* <GlobalSearchDriver /> */}
          {/* <Link href={'social'}>
          <ButtonBorderMagic>شبکه اجتماعی</ButtonBorderMagic>
        </Link> */}
        </div>
      </Menu>
    </div>
  )
}
