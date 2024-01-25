// import { format } from 'date-fns'
import { format } from 'date-fns-jalali'
import { BillboardColumn } from './components/columns'
// import { BillboardClient } from './components/client'
import { prisma } from '@/lib/prisma'
import { BillboardClient } from './components/BillboardClient'
import { getAllBillboards } from '@/lib/queries/dashboard/billboards'
import { notFound } from 'next/navigation'

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  // const billboards = await prisma.billboard.findMany({
  //   where: {
  //     storeId: params.storeId,
  //   },
  //   orderBy: {
  //     createdAt: 'desc',
  //   },
  // })
  const billboards = await getAllBillboards(params.storeId)
  console.log(billboards)
  if (!billboards) {
    return notFound()
  }
  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, 'dd MMMM yyyy'),
    // createdAt: format(item.createdAt, ''yyyy/mm/dd''),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  )
}

export default BillboardsPage
