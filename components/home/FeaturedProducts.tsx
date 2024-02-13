import { getFeaturedProducts } from '@/lib/queries/home/products'
import { FC } from 'react'
import HorizontalScrollCarousel from './horizontal-carousel/HorizontalScrollCarousel '

interface FeaturedProductsProps {}

const FeaturedProducts: FC<FeaturedProductsProps> = async ({}) => {
  const featuredProducts = await getFeaturedProducts({ take: 7 })
  if (!featuredProducts)
    return (
      <p className="flex justify-center items-center text-muted text-2xl ">
        {' '}
        کتابهای منتخب موجود نیستند.{' '}
      </p>
    )

  const cards = featuredProducts.map((featuredProduct) => ({
    url: featuredProduct.images[0].url,
    title: featuredProduct.title,
    id: featuredProduct.id,
  }))
  return (
    <div>
      <HorizontalScrollCarousel
        cards={cards}
        rtl={true}
        className="overflow-x-hidden "
      />
      <HorizontalScrollCarousel
        cards={cards}
        rtl={false}
        className="overflow-x-hidden "
      />
    </div>
  )
}

export default FeaturedProducts
