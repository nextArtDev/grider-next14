import { BentoGrid, BentoGridItem } from '@/components/shared/BentoGrid'
import { getAllCategories } from '@/lib/queries/home/category'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {}

const page: FC<pageProps> = async ({}) => {
  const categories = await getAllCategories()
  if (!categories) return notFound()
  return (
    <BentoGrid className="max-w-6xl mx-auto p-4 ">
      {categories.map((category, i) => (
        <BentoGridItem
          key={i}
          href={`/categories/${category.id}`}
          title={category.name}
          imageSrc={category.image?.url}
          // description={item.description}
          // header={item.header}
          // icon={item.icon}
          className={i % 3 === 0 ? 'md:col-span-2' : ''}
          //   className={i === 3 || i === 6 ? 'md:col-span-2' : ''}
        />
      ))}
    </BentoGrid>
  )
}

export default page
