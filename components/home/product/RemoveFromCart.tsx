'use client'
import { FC } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { Button } from '@/components/ui/button'

import { Product } from '@prisma/client'
import { removeItem } from '@/redux/slices/cardSlice'
import { useCartStore } from '@/store'
import { SingleProductFullStructure } from '@/lib/queries/home/products'

interface RemoveFromCartProps {
  product: SingleProductFullStructure
}

const RemoveFromCart: FC<RemoveFromCartProps> = ({ product }) => {
  // const cart = useAppSelector<Product[]>((state) => state.items)
  // const dispatch = useDispatch<AppDispatch>()
  const removeFromCart = useCartStore((state) => state.removeFromCart)

  const handleRemove = () => {
    // dispatch(removeItem(product))
    removeFromCart(product)
  }
  return (
    <Button variant={'destructive'} onClick={handleRemove}>
      -
    </Button>
  )
}

export default RemoveFromCart
