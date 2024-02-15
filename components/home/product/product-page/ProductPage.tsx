import FlipCover from '@/components/home/product/3d-cover/FlipCover'
import { SingleProductFullStructure } from '@/lib/queries/home/products'
import { formatter } from '@/lib/utils'
import Link from 'next/link'

import React, { FC } from 'react'
import ProductTable from './ProductTable'
import { Badge } from '@/components/ui/badge'
import Currency from '@/components/shared/Currency'

interface ProductPageProps {
  product: SingleProductFullStructure
}

const ProductPage: FC<ProductPageProps> = ({ product }) => {
  return (
    <article className="max-w-7xl  mx-auto mt-8 grid gap-4 grid-cols-1 place-items-center md:grid-cols-2 lg:grid-cols-3">
      <div className="">
        <FlipCover
          url={product.images?.[0].url}
          title={product.title}
          cover={product?.cover}
        />
      </div>
      <div className="flex flex-col gap-y-4 justify-center items-start pr-8 md:pr-0 ">
        <p className="text-lg font-bold md:text-2xl ">{product.title}</p>
        <p className="text-sm text-muted-foreground font-semibold md:text-base ">
          {product.subTitle}
        </p>
        <div className="flex items-center gap-4">
          <p>نویسنده:</p>
          {product.writer.map((writer) => (
            <Link href={`/contributors/${writer.id}`} key={writer.id}>
              <Badge className="px-6 ml-6 text-base ">{writer.name}</Badge>
            </Link>
          ))}
        </div>
        <div className="flex items-center  gap-4">
          <p>ترجمه:</p>
          {product.translator.map((translator) => (
            <Link href={`/contributors/${translator.id}`} key={translator.id}>
              <Badge className="px-5 ml-5 text-base">{translator.name}</Badge>
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {product.price && <Currency value={+product?.price} />}
          تومان
        </div>
      </div>
      <div className="">
        <ProductTable product={product} />
      </div>
    </article>
  )
}

export default ProductPage
