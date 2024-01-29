'use client'

import { ColumnDef } from '@tanstack/react-table'

import { CellAction } from './CellAction'

export type ContributorColumn = {
  id: string
  name: string
  role: string
}

export const columns: ColumnDef<ContributorColumn>[] = [
  {
    accessorKey: 'name',
    header: 'نام',
  },
  {
    accessorKey: 'role',
    header: 'فعالیت',
  },
  // {
  //   accessorKey: 'createdAt',
  //   header: 'تاریخ',
  // },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
]
