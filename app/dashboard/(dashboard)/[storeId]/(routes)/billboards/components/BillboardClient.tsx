'use client'

import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'

import { Button, buttonVariants } from '@/components/ui/button'

import { Separator } from '@/components/ui/separator'

import { columns, BillboardColumn } from './columns'
import { Heading } from '@/components/dashboard/Heading'
import { DataTable } from '@/components/dashboard/DataTable'
import { ApiList } from '@/components/dashboard/ApiList'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BillboardClientProps {
  data: BillboardColumn[]
}

export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const params = useParams()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`بیلبوردها (${data.length})`}
          description="بیلبوردهای فروشگاه خود را مدیریت کنید."
        />
        <Link
          className={cn(buttonVariants())}
          href={`/dashboard/${params.storeId}/billboards/new`}
        >
          <Plus className="ml-2 h-4 w-4 shadow-inner " /> اضافه کنید
        </Link>
      </div>
      <Separator />
      <DataTable searchKey="label" columns={columns} data={data} />
      <Heading title="API" description="فراخوانی API برای بیلبورد." />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardId" />
    </>
  )
}
