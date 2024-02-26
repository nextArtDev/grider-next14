import ProductCard from '@/components/home/product/ProductCard'
import Pagination from '@/components/social/Pagination'
import { getAllProducts } from '@/lib/queries/home/products'
import { SearchParamsProps } from '@/types/social'

async function page({ searchParams }: SearchParamsProps) {
  const products = await getAllProducts({
    searchQuery: searchParams.q,
    filter: searchParams.filter,
    page: searchParams.page ? +searchParams.page : 1,
  })
  if (!products.products)
    return (
      <p className="w-full h-full flex items-center justify-center text-muted text-2xl">
        هیچ کتابی اضافه نشده است.
      </p>
    )
  return (
    <div>
      <ProductCard products={products.products} />
      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={products.isNext}
        />
      </div>
    </div>
  )
}

export default page
