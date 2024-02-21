'use server'

import { redirect } from 'next/navigation'
import { prisma } from '../prisma'
import ZarinPalCheckout from 'zarinpal-checkout'
import { toast } from 'sonner'
import { orderColumns } from '@tanstack/react-table'

const zarinpal = ZarinPalCheckout.create(
  'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  true
)

export async function getZibal({
  amount,
  productIds,
}: {
  amount: number
  productIds: string[]
}) {
  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  })

  //   const totalPrice = products.reduce((total, item) => {
  //     return total + Number(item.price)
  //   }, 0)
  const productQuantityMap = new Map()
  productIds.forEach((productId) => {
    productQuantityMap.set(
      productId,
      (productQuantityMap.get(productId) || 0) + 1
    )
  })

  const totalPrice = products.reduce((total, product) => {
    const quantity = productQuantityMap.get(product.id) || 0
    return total + Number(product.price) * quantity
  }, 0)
  if (totalPrice !== amount) return null
  //   console.log('Total Price:', totalPrice)

  let zarinpalUrl: string
  try {
    const res = await zarinpal.PaymentRequest({
      Amount: totalPrice,
      CallbackURL: 'http://localhost:3000/cart',
      Description: 'کتابفروشی فردا',
      Email: 'hi@siamak.work',
      Mobile: '09120000000',
    })
    //   console.log(res)
    if (res.status === 100) {
      const { authority, url } = res
      // console.log({ authority, url })

      const order = await prisma.order.create({
        data: {
          storeId: process.env.STORE_ID!,
          isPaid: false,
          Authority: authority,
          orderItems: {
            create: productIds.map((productId: string) => ({
              product: {
                connect: {
                  id: productId,
                },
              },
            })),
          },
        },
      })
      // console.log(order)
      return { authority, url }
    }
  } catch (error) {
    console.log(error)
  }
  // .then(function (response) {
  //   if (response.status == 100) {
  //     console.log(response)
  //     zarinpalUrl === response.url

  //     //   res.redirect(response.url)
  //     // redirect(response.url)
  //     return JSON.stringify(response)
  //   }
  //   console.log(zarinpalUrl)
  //   return zarinpalUrl
  // })
  // .catch(function (err) {
  //   console.log(err)
  // })
}

export async function verifyZibal({
  amount,
  Authority,
}: {
  amount: number
  Authority: string
}) {
  // console.log({ amount, Authority })
  try {
    const res = await zarinpal.PaymentVerification({
      Amount: amount, // In Tomans
      Authority,
    })
    // console.log(res)
    if (res.status !== 100) {
      // toast.error('کد شناسایی تکراری است!')
      // console.log(res.status)
      return null
    } else {
      const update = await prisma.order.update({
        where: {
          Authority,
        },
        data: {
          isPaid: true,
          RefID: res.RefID,
        },
      })
      // console.log(update)
      return res.RefID
    }
    //   .then((response) => {
    //     if (response.status !== 100) {
    //       console.log('Empty!')
    //     } else {
    //       console.log(`Verified! Ref ID: ${response.RefID}`)
    //     }
    //   })
    //   .catch((err) => {
    //     console.error(err)
    //   })
    //   console.log('verify', res)
  } catch (error) {
    console.log(error)
  }
}

// zarinpal
//   .RefreshAuthority({
//     Authority: '000000000000000000000000000000000000',
//     Expire: +'1800',
//   })
//   .then((response) => {
//     if (response.status === 100) {
//       console.log(response.status)
//     }
//   })
//   .catch((err) => {
//     console.error(err)
//   })
