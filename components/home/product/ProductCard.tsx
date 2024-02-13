import { Card } from '@/components/ui/card'
import { cn, formatter } from '@/lib/utils'
import { Product } from '@prisma/client'
import { StarIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import FlipCover from './3d-cover/FlipCover'

interface ProductCardProps {
  products: (Product & { images: { url: string }[] })[]
}

const ProductCard: FC<ProductCardProps> = ({ products }) => {
  return (
    <div className="">
      <div className="mx-auto max-w-7xl overflow-hidden sm:px-6 lg:px-8">
        <h2 className="sr-only">Products</h2>

        <div className=" mx-4 grid grid-cols-1 sm:mx-0 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <FlipCover
              key={product.id}
              url={product.images?.[0].url}
              title={product.title}
            />
          ))}
          {/* {products.map((product) => (
          ))} */}
        </div>
      </div>
    </div>
  )
}

export default ProductCard
