'use client'
import { FC } from 'react'

import ContributorProfile from '@/components/home/contributors/ContributorProfile'
import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ContributorFullStructure } from '@/lib/queries/home/contributors'
import { useRouter } from 'next/navigation'

interface pageProps {
  rate: number | null
  contributor: ContributorFullStructure
}

const ContributorDrawer: FC<pageProps> = ({ contributor, rate }) => {
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
        <ScrollArea className="max-h-[80vh]">
          <DrawerContent className=" ">
            <ContributorProfile
              rate={rate}
              contributor={contributor}
              user={null}
              drawer={true}
            />
            {/* <RelatedProducts contributor={contributor} /> */}
            <Button
              className="mb-4 w-1/2 mx-auto "
              onClick={() =>
                window.location.assign(`/contributors/${contributor.id}`)
              }
            >
              مشاهده
            </Button>
          </DrawerContent>
        </ScrollArea>
      </Drawer>
    </div>
  )
}

export default ContributorDrawer
