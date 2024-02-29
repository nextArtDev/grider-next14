import RelatedBooks from '@/components/home/product/RelatedBooks'
import AboutBook from '@/components/home/product/product-page/AboutBook'
import ProductPage from '@/components/home/product/product-page/ProductPage'
import { currentUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  getProductById,
  getProductsByCategoryId,
} from '@/lib/queries/home/products'
import { notFound } from 'next/navigation'
import { FC } from 'react'

interface pageProps {
  params: { productId: string }
}

const page: FC<pageProps> = async ({ params: { productId } }) => {
  const product = await getProductById({ id: productId })

  if (!product.product) return notFound()

  const user = await currentUser()
  const beforeRated = await prisma.review.findFirst({
    where: {
      userId: user?.id,
      productId: product.product.id,
    },
    select: {
      rating: true,
    },
  })

  const relatedBooks = await getProductsByCategoryId({
    id: productId,
    categoryId: product.product.categoryId,
  })

  const userWithPic = await prisma.user.findFirst({
    where: { id: user?.id },
    include: { image: { select: { url: true } } },
  })

  return (
    <section className="flex flex-col">
      <ProductPage
        product={product.product}
        user={userWithPic}
        beforeRated={beforeRated}
        rate={product.rate}
      />
      {product?.product.description && (
        <AboutBook description={product?.product.description} />
      )}
      <RelatedBooks products={relatedBooks} />
    </section>
  )
}

export default page
