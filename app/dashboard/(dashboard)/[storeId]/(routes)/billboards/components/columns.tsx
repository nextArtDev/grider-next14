'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CellAction } from './CellAction'

export type BillboardColumn = {
  id: string
  label: string
  createdAt: string
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: 'label',
    header: 'عنوان',
  },
  {
    accessorKey: 'createdAt',
    header: 'تاریخ',
  },
  {
    id: 'actions',
    //This is tanstack react table, this is how we can access the original object that this cell is working with (which here is: id: string; label: string;  createdAt: string)
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
