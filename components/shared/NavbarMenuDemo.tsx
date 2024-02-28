'use client'
import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import { HoveredLink, Menu, MenuItem, ProductItem } from './NavbarMenu'
import { BillboardsWithImagesAndCategories } from '@/lib/queries/home/billboard'
import { GlobalSearchDriver } from './GlobalSearchDriver'
import { Search } from 'lucide-react'
import ButtonBorderMagic from './ButtonBorderMagic'
import Link from 'next/link'

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
        {/* <GlobalSearchDriver /> */}
        {/* <Link href={'social'}>
          <ButtonBorderMagic>شبکه اجتماعی</ButtonBorderMagic>
        </Link> */}
      </Menu>
    </div>
  )
}
