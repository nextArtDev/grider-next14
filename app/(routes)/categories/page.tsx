import { BentoGrid, BentoGridItem } from '@/components/shared/BentoGrid'
import { getAllCategories } from '@/lib/queries/home/category'
import { notFound } from 'next/navigation'
import { FC } from 'react'
import SearchIcon from '@/public/assets/icons/search.svg'
import LocalSearchbar from '@/components/social/search/LocalSearchbar'
import { SearchParamsProps } from '@/types/social'

async function page({ searchParams }: SearchParamsProps) {
  const categories = await getAllCategories({ searchQuery: searchParams.q })
  if (!categories) return notFound()
  return (
    <section>
      <div className="my-8 max-w-sm mx-auto">
        <LocalSearchbar
          route="/categories"
          iconPosition="left"
          imgSrc={SearchIcon}
          placeholder="جست‌وجوی دسته‌بندی کتاب"
          otherClasses="flex-1"
        />
      </div>
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
    </section>
  )
}

export default page
