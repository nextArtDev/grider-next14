'use client'

// import axios from 'axios'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import { useState, useTransition } from 'react'

import { useParams, usePathname, useRouter } from 'next/navigation'

import { Button, buttonVariants } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { AlertModal } from '@/components/dashboard/modals/alert-modal'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { toast } from 'sonner'
import { CategoryColumn } from './columns'
import { deleteCategory } from '@/lib/actions/dashboard/category'
import { useFormState } from 'react-dom'

interface CellActionProps {
  data: CategoryColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()
  const path = usePathname()
  const [open, setOpen] = useState(false)

  const [isPending, startTransition] = useTransition()
  // const [loading, setLoading] = useState(false)

  // console.log(params)

  //How to delete by AlertModal and a button
  // const onConfirm = async () => {
  //   try {
  //     setLoading(true)
  //     // we don't have access to "billboadrId" here
  //     // await axios.delete(`/api/${params.storeId}/billboards/${data.id}`)
  //     toast({
  //       title: 'بیلبورد حذف شد.',
  //       variant: 'default',
  //     })
  //     router.refresh()
  //   } catch (error) {
  //     toast({
  //       title:
  //         'مطمئن شوید ابتدا همه دسته‌بندی‌هایی که از این بیلبود استفاده می‌کنند را حذف کرده‌اید.',
  //       variant: 'destructive',
  //     })
  //   } finally {
  //     setOpen(false)
  //     setLoading(false)
  //   }
  // }
  const [deleteState, deleteAction] = useFormState(
    deleteCategory.bind(
      null,
      path,
      params.storeId as string,
      data.id as string
    ),
    {
      errors: {},
    }
  )
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    toast.success('ID کپی شد')
  }

  return (
    <>
      {/* How we delete by using button and AlertModal that we created */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteAction}
        // loading={loading}
        isPending={isPending}
      />
      <DropdownMenu dir="rtl">
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            {/* just for screen readers */}
            <span className="sr-only">باز کردن منو</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* <DropdownMenuLabel>عملیات</DropdownMenuLabel> */}
          <DropdownMenuItem
          // onClick={() =>
          //   // we just redirect to form that we created, but instead of new, we go to the billboardId page, it equals edit not create
          //   router.push(`/dashboard/${params.storeId}/billboards/${data.id}`)
          // }
          >
            <Link
              href={`/dashboard/${params.storeId}/categories/${data.id}`}
              className={cn(buttonVariants(), 'w-full')}
            >
              <Edit className="ml-2 h-4 w-4" /> آپدیت
            </Link>
          </DropdownMenuItem>
          {/* just open AlertModal for deleting */}
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Button className="w-full" variant={'destructive'}>
              <Trash className="ml-2 h-4 w-4" /> حذف
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Button variant={'ghost'}>
              <Copy className="ml-2 h-4 w-4" /> کپی کردن Id
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
