import FlipCover from '@/components/home/product/3d-cover/FlipCover'
import { SingleProductFullStructure } from '@/lib/queries/home/products'
import { formatter } from '@/lib/utils'
import Link from 'next/link'

import React, { FC } from 'react'
import ProductTable from './ProductTable'

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
      <div className="flex flex-col gap-2 justify-center items-start pr-8 md:pr-0 ">
        <div className="text-base font-bold md:text-lg ">{product.title}</div>
        <div className="text-sm text-muted font-semibold md:text-base ">
          {product.subTitle}
        </div>
        <div className="flex gap-1">
          {product.writer.map((writer) => (
            <Link href={`/contributors/${writer.id}`} key={writer.id}>
              <span>{writer.name}</span>
            </Link>
          ))}
        </div>
        <div className="flex gap-1">
          ترجمه:{' '}
          {product.translator.map((translator) => (
            <Link href={`/contributors/${translator.id}`} key={translator.id}>
              <span>{translator.name}</span>
            </Link>
          ))}
        </div>
        <div>
          قیمت: {product.price && formatter.format(product.price?.toNumber())}{' '}
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
