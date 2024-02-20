import { SingleProductFullStructure } from '@/lib/queries/home/products'
import { Product } from '@prisma/client'
import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'

interface CartState {
  cart: SingleProductFullStructure[]
  addToCart: (product: SingleProductFullStructure) => void
  removeFromCart: (product: SingleProductFullStructure) => void
  removeAll: () => void
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
        removeItem: (id: string) => {
          set({ cart: [...get().cart.filter((item) => item.id !== id)] })
          // toast.success('Item removed from cart.')
        },
        removeAll: () => set({ cart: [] }),
      }),
      {
        name: 'shopping-cart-storage',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
)
