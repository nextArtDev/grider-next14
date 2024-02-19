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
interface BasketProps {}

const Basket: FC<BasketProps> = ({}) => {
  const dispatch = useDispatch<AppDispatch>()
  const cart = useAppSelector<Product[]>((state) => state.items)

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
              <div className="flex flex-col border rounded-md p-5 ">
                <AddToCart product={item} />
                <p className="mt-4 font-bold text-right">{total}</p>
              </div>
            </li>
          )
        })}
      </ul>
      <Separator />
      <div className="text-bold text-center mx-auto py-4">
        <p className="">{basketTotal} تومان </p>
        <Button variant={'destructive'}>تسویه</Button>
      </div>
    </div>
  )
}

export default Basket
