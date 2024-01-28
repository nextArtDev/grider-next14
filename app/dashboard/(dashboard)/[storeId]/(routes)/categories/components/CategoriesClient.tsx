'use client'

import { Plus } from 'lucide-react'
import { useParams } from 'next/navigation'

import { buttonVariants } from '@/components/ui/button'

import { Separator } from '@/components/ui/separator'

import { DataTable } from '@/components/dashboard/DataTable'
import { Heading } from '@/components/dashboard/Heading'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { CategoryColumn, columns } from './columns'

interface CategoriesClientProps {
  data: CategoryColumn[]
}

export const CategoriesClient: React.FC<CategoriesClientProps> = ({ data }) => {
  const params = useParams()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`دسته‌بندی‌ها (${data.length})`}
          description="دسته‌های فروشگاه خود را مدیریت کنید."
        />
        <Link
          className={cn(buttonVariants())}
          href={`/dashboard/${params.storeId}/categories/new`}
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
