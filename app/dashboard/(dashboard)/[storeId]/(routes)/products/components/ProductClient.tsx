'use client'

import { Plus } from 'lucide-react'
import { useParams } from 'next/navigation'

import { buttonVariants } from '@/components/ui/button'

import { Separator } from '@/components/ui/separator'

import { DataTable } from '@/components/dashboard/DataTable'
import { Heading } from '@/components/dashboard/Heading'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { ProductColumn, columns } from './columns'

interface ProductsClientProps {
  data: ProductColumn[]
}

export const ProductsClient: React.FC<ProductsClientProps> = ({ data }) => {
  const params = useParams()

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`محصولات (${data.length})`}
          description="محصولات فروشگاه را مدیریت کنید."
        />
        <Link
          className={cn(buttonVariants())}
          href={`/dashboard/${params.storeId}/products/new`}
        >
          <Plus className="ml-2 h-4 w-4 shadow-inner " /> اضافه کنید
        </Link>
      </div>
      <Separator />
      <DataTable searchKey="title" columns={columns} data={data} />
      {/* <Heading title="API" description="فراخوانی API برای دسته." />
      <Separator /> */}
      {/* <ApiList entityName="billboards" entityIdName="billboardId" /> */}
    </>
  )
}
