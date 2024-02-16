import GridOptions from '@/components/shared/GridOptions'
import { BentoGrid, BentoGridItem } from '@/components/shared/BentoGrid'
import { getBillboardsWithCategories } from '@/lib/queries/home/billboard'
import { cn } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const billboards = await getBillboardsWithCategories()

  if (!billboards) notFound()

  return (
    <BentoGrid className="max-w-6xl mx-auto p-4 ">
      {billboards.map((billboard, i) => (
        <BentoGridItem
          key={i}
          href={`/billboards/${billboard.id}`}
          title={billboard.label}
          imageSrc={billboard.image?.url}
          // description={item.description}
          // header={item.header}
          // icon={item.icon}
          className={cn(
            i % 3 === 0 ? 'md:col-span-2 lg:col-span-3 ' : ''
            // i % 3 === 2 ? 'md:col-span-3 lg:col-span-2 ' : ''
          )}
          // className={i === 3 || i === 6 ? 'md:col-span-2' : ''}
        />
      ))}
    </BentoGrid>
  )
}

export default page
