import FeaturedProducts from '@/components/home/FeaturedProducts'
import { SwipeCarousel } from '@/components/home/SwipeCarousel'
import CardParallax from '@/components/home/card-parallax'
import { getAllCategories } from '@/lib/queries/home/category'

export default async function Home() {
  const categories = await getAllCategories()
  return (
    <main className="flex-1">
      <div dir="ltr" className="w-[94vw] overflow-x-hidden">
        <SwipeCarousel categories={categories} />
      </div>
      <FeaturedProducts />
      <CardParallax categories={categories} />
    </main>
  )
}
