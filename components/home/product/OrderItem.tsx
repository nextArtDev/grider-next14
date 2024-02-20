import Currency from '@/components/shared/Currency'
import { SingleProductFullStructure } from '@/lib/queries/home/products'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'
import AddToCart from './AddToCart'
import FlipCover from './3d-cover/FlipCover'

interface OrderItemProps {
  product: SingleProductFullStructure
  total: string
}

const OrderItem: FC<OrderItemProps> = ({ product, total }) => {
  return (
    <div>
      <li className="flex py-6 sm:py-10">
        <div className="flex-shrink-0">
          {/* <Image
            width={120}
            height={120}
            src={product.images?.[0].url}
            alt={product.title}
            className="h-24 w-24 rounded-lg object-cover object-center sm:h-32 sm:w-32"
          /> */}
          <FlipCover
            title={product.title}
            url={product.images?.[0].url}
            className="w-40 h-40"
          />
        </div>

        <div className="relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
          <div>
            <div className="flex justify-between sm:grid sm:grid-cols-2">
              <div className="pr-6">
                <h3 className="text-sm">
                  <Link
                    href={`/products/${product.id}`}
                    className="font-medium text-xl text-primary"
                  >
                    {product.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {product.writer.map((writer) => writer.name)}
                  {product.writer.length > 1 ? '...' : ''}
                </p>
                {product.translator ? (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {' '}
                    {product.translator[0].name}
                    {product.translator.length > 1 ? '...' : ''}{' '}
                  </p>
                ) : null}
              </div>

              <p className="text-left text-sm font-medium ">
                <Currency value={+total} />
              </p>
            </div>

            <div className="mt-4 flex items-center sm:absolute sm:left-1/2 sm:top-0 sm:mt-0 sm:block">
              <AddToCart product={product} />
            </div>
          </div>

          {/* <p className="mt-4 flex space-x-2 text-sm text-gray-700">
            {product.inStock ? (
              <CheckIcon
                className="h-5 w-5 flex-shrink-0 text-green-500"
                aria-hidden="true"
              />
            ) : (
              <ClockIcon
                className="h-5 w-5 flex-shrink-0 text-gray-300"
                aria-hidden="true"
              />
            )}

            <span>
              {product.inStock ? 'In stock' : `Ships in ${product.leadTime}`}
            </span>
          </p> */}
        </div>
      </li>
    </div>
  )
}

export default OrderItem
