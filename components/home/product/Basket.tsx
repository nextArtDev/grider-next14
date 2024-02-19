'use client'
import { FC } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { Button } from '@/components/ui/button'
import { addItem } from '@/redux/slices/cardSlice'
import { Product } from '@prisma/client'
import { getCartTotal, groupById } from '@/lib/utils'
import AddToCart from './AddToCart'
import { Separator } from '@/components/ui/separator'
import { useCartStore } from '@/store'
import Currency from '@/components/shared/Currency'
import { Badge } from '@/components/ui/badge'
interface BasketProps {}

const Basket: FC<BasketProps> = ({}) => {
  // const dispatch = useDispatch<AppDispatch>()
  // const cart = useAppSelector<Product[]>((state) => state.items)
  const cart = useCartStore((state) => state.cart)

  const grouped = groupById(cart)
  const basketTotal = getCartTotal(cart)

  return (
    <div className="max-w-7xl mx-auto">
      <ul className="space-y-5 divide-y-2 ">
        {Object.keys(grouped).map((id) => {
          const item = grouped[id][0]
          const total = getCartTotal(grouped[id])

          return (
            <li key={id} className="p-5 my-2 flex items-center justify-between">
              <div className="flex space-x-4 pr-4 ">
                <div>
                  <p className="line-clamp-2 font-bold"> {item.title}</p>
                </div>
              </div>
              <div className="flex flex-col border rounded-md ">
                <AddToCart product={item} />
              </div>
              <Badge
                variant={'secondary'}
                className="mt-4 font-bold text-canter"
              >
                <Currency value={total} />
              </Badge>
            </li>
          )
        })}
      </ul>
      <Separator />
      <div className="flex items-center justify-center gap-x-8 text-bold text-center mx-auto py-4">
        {/* <p className="">{basketTotal} تومان </p> */}
        <Currency value={basketTotal} />
        <Button variant={'destructive'}>تسویه</Button>
      </div>
    </div>
  )
}

export default Basket
