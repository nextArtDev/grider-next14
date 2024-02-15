'use client'
import { FC } from 'react'
import { Minus, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useRouter } from 'next/navigation'
import ContributorProfile from '@/components/home/contributors/ContributorProfile'
import { ContributorFullStructure } from '@/lib/queries/home/contributors'
import RelatedProducts from '@/components/home/RelatedProducts'
import { ScrollArea } from '@/components/ui/scroll-area'

interface pageProps {
  contributor: ContributorFullStructure
}

const ContributorDrawer: FC<pageProps> = ({ contributor }) => {
  const router = useRouter()
  const onDismiss = () => {
    router.back()
  }
  return (
    <div>
      <Drawer
        open
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            onDismiss()
          }
        }}
      >
        <ScrollArea className="h-[80vh]">
          <DrawerContent>
            <ContributorProfile contributor={contributor} />
            {/* <RelatedProducts contributor={contributor} /> */}
          </DrawerContent>
        </ScrollArea>
      </Drawer>
    </div>
  )
}

export default ContributorDrawer
