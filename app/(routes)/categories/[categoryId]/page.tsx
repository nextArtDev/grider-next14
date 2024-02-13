import CategoryPreview from '@/components/home/category/CategoryPreview'
import ProductCard from '@/components/home/product/ProductCard'
import { getCategoryById } from '@/lib/queries/home/category'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {
  params: { categoryId: string }
}

const page: FC<pageProps> = async ({ params: { categoryId } }) => {
  const category = await getCategoryById({ categoryId })
  if (!category) return notFound()
  //   console.log(category)

  return (
    <section className="flex flex-col">
      <CategoryPreview
        imageSrc={category.image?.url}
        billboardName={category.billboard.label}
        billboardId={category.billboardId}
        categoryName={category.name}
        description={category?.description}
      />
      {/* TODO:Filters  */}
      <ProductCard products={category?.products} />
    </section>
  )
}

export default page
