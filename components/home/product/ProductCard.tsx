import { Card } from '@/components/ui/card'
import { cn, formatter } from '@/lib/utils'
import { Product } from '@prisma/client'
import { StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import FlipCover from './3d-cover/FlipCover'
import LocalSearchbar from '@/components/social/search/LocalSearchbar'
import SearchIcon from '@/public/assets/icons/search.svg'
import Filter from '@/components/social/search/Filter'
import HomeFilters from '@/components/social/home/HomeFilters'
import { ProductPageFilters } from '@/lib/constants'
interface ProductCardProps {
  products: (Product & { images: { url: string }[] })[] | null
}

const ProductCard: FC<ProductCardProps> = ({ products }) => {
  if (!products) {
    return (
      <p className="flex text-2xl items-center justify-center text-center">
        هنوز کتابی در این دسته‌بندی موجود نیست.
      </p>
    )
  }
  return (
    <div className="">
      <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
        <h2 className="sr-only">Products</h2>
        <div className="my-8 flex flex-col gap-6 max-w-lg mx-auto">
          <LocalSearchbar
            route="/products"
            iconPosition="left"
            imgSrc={SearchIcon}
            placeholder="جست‌وجوی کتاب"
            otherClasses="flex-1 max-w-md mx-auto "
          />
          <Filter
            filters={ProductPageFilters}
            otherClasses="min-h-[56px] sm:min-w-[170px]"
            containerClasses="hidden max-w-sm mx-auto max-md:flex"
          />

          <HomeFilters filters={ProductPageFilters} />
        </div>
        <div className=" mx-4 grid grid-cols-1 sm:grid-cols-2 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              scroll={false}
              key={product.id}
              href={`/products/${product.id}`}
            >
              <FlipCover
                url={product.images?.[0].url}
                title={product.title}
                cover={product?.cover}
              />
            </Link>
          ))}
          {/* {products.map((product) => (
          ))} */}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
