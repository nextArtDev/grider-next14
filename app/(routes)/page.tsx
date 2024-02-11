import { SwipeCarousel } from '@/components/home/SwipeCarousel'
import CardParallax from '@/components/home/card-parallax'
import { getAllCategories } from '@/lib/queries/home/category'

export default async function Home() {
  const categories = await getAllCategories()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div dir="ltr" className="w-[94vw] overflow-x-hidden">
        <SwipeCarousel categories={categories} />
      </div>
      <CardParallax categories={categories} />
    </main>
  )
}
