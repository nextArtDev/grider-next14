'use client'

// import axios from 'axios'
import { useState } from 'react'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'

import { useParams, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { BillboardColumn } from './columns'
import { toast } from '@/components/ui/use-toast'
import { AlertModal } from '@/components/dashboard/modals/alert-modal'

interface CellActionProps {
  data: BillboardColumn
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  //How to delete by AlertModal and a button
  const onConfirm = async () => {
    try {
      setLoading(true)
      // we don't have access to "billboadrId" here
      // await axios.delete(`/api/${params.storeId}/billboards/${data.id}`)
      toast({
        title: 'بیلبورد حذف شد.',
        variant: 'default',
      })
      router.refresh()
    } catch (error) {
      toast({
        title:
          'مطمئن شوید ابتدا همه دسته‌بندی‌هایی که از این بیلبود استفاده می‌کنند را حذف کرده‌اید.',
        variant: 'destructive',
      })
    } finally {
      setOpen(false)
      setLoading(false)
    }
  }

  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    toast({ title: 'ID کپی شد', variant: 'default' })
  }

  return (
    <>
      {/* How we delete by using button and AlertModal that we created */}
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {}}
        // onConfirm={onConfirm}
        // loading={loading}
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
          <DropdownMenuLabel>عملیات</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="ml-2 h-4 w-4" /> کپی کردن Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              // we just redirect to form that we created, but instead of new, we go to the billboardId page, it equals edit not create
              router.push(`/${params.storeId}/billboards/${data.id}`)
            }
          >
            <Edit className="ml-2 h-4 w-4" /> آپدیت
          </DropdownMenuItem>
          {/* just open AlertModal for deleting */}
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="ml-2 h-4 w-4" /> حذف
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
