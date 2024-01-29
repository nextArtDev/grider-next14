'use client'

import { Plus } from 'lucide-react'
import { useParams } from 'next/navigation'

import { buttonVariants } from '@/components/ui/button'

import { Separator } from '@/components/ui/separator'

import { DataTable } from '@/components/dashboard/DataTable'
import { Heading } from '@/components/dashboard/Heading'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ContributorColumn, columns } from './columns'

interface ContributorsClientProps {
  data: ContributorColumn[]
}

export const ContributorsClient: React.FC<ContributorsClientProps> = ({
  data,
}) => {
  const params = useParams()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`عوامل کتاب (${data.length})`}
          description="نویسنده‌ها، مترجمها، ویراستاران، تصویرسازان و عکاسان کتابها"
        />
        <Link
          className={cn(buttonVariants())}
          href={`/dashboard/${params.storeId}/contributors/new`}
        >
          <Plus className="ml-2 h-4 w-4 shadow-inner " /> اضافه کنید
        </Link>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      {/* <Heading title="API" description="فراخوانی API برای دسته." />
      <Separator /> */}
      {/* <ApiList entityName="billboards" entityIdName="billboardId" /> */}
    </>
  )
}
