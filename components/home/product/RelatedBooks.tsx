import { FC } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ContributorFullStructure } from '@/lib/queries/home/contributors'

import Link from 'next/link'
import { SingleProductFullStructure } from '@/lib/queries/home/products'
import FlipCover from './3d-cover/FlipCover'
import { Separator } from '@/components/ui/separator'

interface RelatedBooksProps {
  products: SingleProductFullStructure[] | null
}

const RelatedBooks: FC<RelatedBooksProps> = ({ products }) => {
  if (products) {
    return (
      <section>
        <Separator className="my-2" />
        <h2 className="py-2 text-xl font-semibold">کتابهای مرتبط:</h2>

        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <FlipCover
                title={product.title}
                cover={product.cover}
                url={product.images?.[0].url!}
              />
            </Link>
          ))}
        </div>
      </section>
    )
  } else {
    return null
  }
}

export default RelatedBooks
