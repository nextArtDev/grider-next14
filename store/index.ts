import { SingleProductFullStructure } from '@/lib/queries/home/products'
import { Product } from '@prisma/client'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface CartState {
  cart: SingleProductFullStructure[]
  addToCart: (product: SingleProductFullStructure) => void
  removeFromCart: (product: SingleProductFullStructure) => void
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],
        addToCart(product) {
          set((state) => ({
            cart: [...state.cart, product],
          }))
        },
        removeFromCart(product) {
          const productToRemove = get().cart.findIndex(
            (p) => p.id === product.id
          )
          set((state) => {
            const newCart = [...state.cart]

            newCart.splice(productToRemove, 1)
            return { cart: newCart }
          })
        },
      }),
      {
        name: 'shopping-cart-storage',
      }
    )
  )
)
