'use client'
import { FC } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { Button } from '@/components/ui/button'

import { Product } from '@prisma/client'
import { removeItem } from '@/redux/slices/cardSlice'

interface RemoveFromCartProps {
  product: Product
}

const RemoveFromCart: FC<RemoveFromCartProps> = ({ product }) => {
  const cart = useAppSelector<Product[]>((state) => state.items)
  const dispatch = useDispatch<AppDispatch>()

  const handleRemove = () => {
    dispatch(removeItem(product))
  }
  return (
    <Button variant={'destructive'} onClick={handleRemove}>
      -
    </Button>
  )
}

export default RemoveFromCart
