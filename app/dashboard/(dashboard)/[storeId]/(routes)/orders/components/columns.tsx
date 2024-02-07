'use client'

import { ColumnDef } from '@tanstack/react-table'

export type OrderColumn = {
  id: string
  phone: string
  address: string
  isPaid: boolean
  totalPrice: string
  products: string
  createdAt: string
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: 'products',
    header: 'محصولا',
  },
  {
    accessorKey: 'phone',
    header: 'موبایل',
  },
  {
    accessorKey: 'address',
    header: 'آدرس',
  },
  {
    accessorKey: 'totalPrice',
    header: 'قیمت کل',
  },
  {
    accessorKey: 'isPaid',
    header: 'پرداخت',
  },
]
