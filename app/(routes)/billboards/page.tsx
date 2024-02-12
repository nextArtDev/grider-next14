import GridOptions from '@/components/shared/GridOptions'
import { getBillboardsWithCategories } from '@/lib/queries/home/billboard'
import { cn } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const billboards = await getBillboardsWithCategories()

  if (!billboards) notFound()

  return (
    <div className="grid grid-col-2 grid-flow-row-dense md:grid-cols-4 gap-3 m-6">
      {billboards.map((billboard, i) => (
        <GridOptions
          key={billboard.id}
          href={`/billboards/${billboard.id}`}
          title={billboard.label}
          image={billboard.image?.url}
          className={cn(
            i % 3 === 0 && 'col-span-3 row-span-3 h-32 ',
            i % 3 === 1 && 'col-span-2 row-span-3',
            i % 3 === 2 && 'col-span-2 row-span-2'
          )}
        />
      ))}
    </div>
  )
}

export default page
