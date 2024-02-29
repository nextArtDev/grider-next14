import { getProductById } from '@/lib/queries/home/products'
import { notFound } from 'next/navigation'
import { FC } from 'react'
import ProductDialog from './ProductDialog'

interface pageProps {
  params: { productId: string }
}

const InterceptingProduct: FC<pageProps> = async ({
  params: { productId },
}) => {
  const product = await getProductById({ id: productId })
  if (!product.product) return notFound()

  return (
    <div>
      <ProductDialog product={product.product} rate={product.rate} />
    </div>
  )
}

export default InterceptingProduct
