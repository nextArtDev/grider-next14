'use client'
import { FC } from 'react'

import { useRouter } from 'next/navigation'
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'
import ProductPage from '@/components/home/product/product-page/ProductPage'
import { SingleProductFullStructure } from '@/lib/queries/home/products'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import Currency from '@/components/shared/Currency'
import { Button } from '@/components/ui/button'
import AddToCart from '@/components/home/product/AddToCart'
import RateStar from '@/components/home/RateStar'

interface pageProps {
  rate: number | null
  product: SingleProductFullStructure
}

const ProductDialog: FC<pageProps> = ({ product, rate }) => {
  const router = useRouter()
  const onDismiss = () => {
    router.back()
  }
  return (
    <div>
      <Dialog
        open
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            onDismiss()
          }
        }}
      >
        <DialogContent>
          <div className="flex flex-col gap-y-4 justify-center items-start pr-8 md:pr-0 ">
            <p className="text-lg font-bold md:text-2xl ">{product.title}</p>
            <p className="text-sm text-muted-foreground font-semibold md:text-base ">
              {product.subTitle}
            </p>
            {product.Reviews.length > 0 && rate && (
              <RateStar rate={rate} reviewCounts={product.Reviews.length} />
            )}
            <div className="flex items-center gap-4">
              <p>نویسنده:</p>
              {product.writer.map((writer) => (
                <Link href={`/contributors/${writer.id}`} key={writer.id}>
                  <Badge className="px-6 ml-6 text-base ">{writer.name}</Badge>
                </Link>
              ))}
            </div>
            <div className="flex items-center  gap-4">
              <p>ترجمه:</p>
              {product.translator.map((translator) => (
                <Link
                  href={`/contributors/${translator.id}`}
                  key={translator.id}
                >
                  <Badge className="px-5 ml-5 text-base">
                    {translator.name}
                  </Badge>
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {product.price && <Currency value={+product?.price} />}
              تومان
            </div>
          </div>
          <div className="w-full">
            <AddToCart product={product} />
          </div>
          <Button
            onClick={() => window.location.assign(`/products/${product.id}`)}
          >
            مشاهده
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProductDialog
