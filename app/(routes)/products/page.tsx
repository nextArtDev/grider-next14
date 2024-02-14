import ProductCard from '@/components/home/product/ProductCard'
import { getAllProducts } from '@/lib/queries/home/products'

async function page() {
  const products = await getAllProducts()
  if (!products)
    return (
      <p className="w-full h-full flex items-center justify-center text-muted text-2xl">
        هیچ کتابی اضافه نشده است.
      </p>
    )
  return (
    <div>
      <ProductCard products={products} />
    </div>
  )
}

export default page
