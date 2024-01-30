'use client'

import { ColumnDef } from '@tanstack/react-table'

import { CellAction } from './CellAction'

export type ProductColumn = {
  id: string
  title: string
  price: string
  writer: string | undefined
  translator: string | undefined
  category: string
  createdAt: string
  isFeatured: boolean
  isArchived: boolean
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'title',
    header: 'عنوان',
  },
  {
    accessorKey: 'writer',
    header: 'نویسنده',
  },
  {
    accessorKey: 'translator',
    header: 'مترجم',
  },
  {
    accessorKey: 'isArchived',
    header: 'آرشیو شده',
  },
  {
    accessorKey: 'isFeatured',
    header: 'ویژه',
  },
  {
    accessorKey: 'price',
    header: 'قیمت',
  },
  {
    accessorKey: 'category',
    header: 'دسته‌بندی',
  },
  {
    accessorKey: 'createdAt',
    header: 'تاریخ',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
