import AboutBook from '@/components/home/product/product-page/AboutBook'
import ProductPage from '@/components/home/product/product-page/ProductPage'
import { getProductById } from '@/lib/queries/home/products'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {
  params: { productId: string }
}

const page: FC<pageProps> = async ({ params: { productId } }) => {
  const product = await getProductById({ id: productId })
  if (!product) return notFound()

  // console.log(product)

  return (
    <section className="flex flex-col">
      <ProductPage product={product} />
      {product.description && <AboutBook description={product.description} />}
    </section>
  )
}

export default page
