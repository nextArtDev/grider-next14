'use client'
import { FC } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { Button } from '@/components/ui/button'
import { addItem } from '@/redux/slices/cardSlice'
import { Product } from '@prisma/client'
import { getCartTotal, groupById } from '@/lib/utils'
interface BasketProps {}

const Basket: FC<BasketProps> = ({}) => {
  const dispatch = useDispatch<AppDispatch>()
  const cart = useAppSelector<Product[]>((state) => state.cardReducer.items)

  const grouped = groupById(cart)
  const basketTotal = getCartTotal(cart)

  return (
    <div className="max-w-7xl mx-auto">
      <ul className="space-y-5 divide-y-2 ">
        {Object.keys(grouped).map((id) => {
          const item = grouped[id][0]
          const total = getCartTotal(grouped[id])

          return <li></li>
        })}
      </ul>
    </div>
  )
}

export default Basket
