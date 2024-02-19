'use client'
import { Product } from '@prisma/client'
import { FC, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch, useAppSelector } from '@/redux/store'
import { Button } from '@/components/ui/button'
import { addItem } from '@/redux/slices/cardSlice'
import RemoveFromCart from './RemoveFromCart'
import { useCartStore } from '@/store'
import { SingleProductFullStructure } from '@/lib/queries/home/products'
interface AddToCartProps {
  product: SingleProductFullStructure
}

const AddToCart: FC<AddToCartProps> = ({ product }) => {
  // const cart = useAppSelector<Product[]>((state) => state.items)
  // const dispatch = useDispatch<AppDispatch>()
  // const [mounted, setMounted] = useState(false)

  // useEffect(() => {
  //   setMounted(true)
  // }, [])
  const [cart, addToCart] = useCartStore((state) => [
    state.cart,
    state.addToCart,
  ])

  const howManyInCart = cart.filter((item) => item.id === product.id).length
  //   console.log({ howManyInCart })

  const handleAdd = () => {
    // dispatch(addItem(product))
    addToCart(product)
  }
  // dispatch(removeItem(data))

  // if (!mounted) {
  //   return ''
  // }

  if (howManyInCart > 0) {
    return (
      <div className="flex gap-x-4 p-1 items-center outline-none">
        <Button variant={'destructive'} onClick={handleAdd}>
          +
        </Button>
        <span>{howManyInCart}</span>
        <RemoveFromCart product={product} />
      </div>
    )
  }

  return (
    <Button variant={'destructive'} onClick={handleAdd}>
      افزودن به سبد
    </Button>
  )
}

export default AddToCart
