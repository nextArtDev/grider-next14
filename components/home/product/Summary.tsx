'use client'
import Currency from '@/components/shared/Currency'
import { getZibal, verifyZibal } from '@/lib/actions/zibal'
import { useCartStore } from '@/store'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FC, useEffect } from 'react'
import { toast } from 'sonner'

interface SummaryProps {
  basketTotal: string
}

const Summary: FC<SummaryProps> = ({ basketTotal }) => {
  const searchParams = useSearchParams()
  const [cart, removeAll] = useCartStore((state) => [
    state.cart,
    state.removeAll,
  ])

  // console.log(cart)

  const ZibalVerification = async (amount: number, Authority: string) => {
    const res = await verifyZibal({ amount: +basketTotal, Authority })
    console.log(res)
  }

  useEffect(() => {
    if (searchParams.get('Status') === 'OK') {
      toast.success('پرداخت موفقیت آمیز بود!')
      const Authority = searchParams.get('Authority')

      const res = ZibalVerification(Number(basketTotal), Authority!)
      console.log(res)
      // removeAll()
    }

    if (searchParams.get('Status') === 'NOK') {
      toast.error('مشکلی پیش آمده!')
    }
  }, [searchParams, removeAll])

  const onCheckout = async () => {
    const res = await getZibal({
      amount: +basketTotal,
      productIds: cart.map((item) => item.id),
    })
    // console.log(res)
    // const response = await axios.post(
    //   `${process.env.NEXT_PUBLIC_API_URL}/checkout`,
    //   {
    //     productIds: items.map((item) => item.id),
    //   }
    // )
    window.location = res?.url! as unknown as Location
  }

  return (
    <div>
      {' '}
      <div className="mt-10 sm:ml-32 mx-auto sm:pl-6">
        <div className="rounded-lg bg-gray-50 dark:bg-gray-600 px-4 py-6 sm:p-6 lg:p-8">
          <h2 className="sr-only">خلاصه وضعیت سفارش</h2>

          <div className="flow-root">
            <dl className="-my-4 divide-y divide-gray-200 text-sm">
              {/* <div className="flex items-center justify-between py-4">
                <dt className="text-gray-600">Subtotal</dt>
                <dd className="font-medium text-gray-900">$99.00</dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-gray-600">Shipping</dt>
                <dd className="font-medium text-gray-900">$5.00</dd>
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-gray-600">Tax</dt>
                <dd className="font-medium text-gray-900">$8.32</dd>
              </div> */}
              <div className="flex items-center justify-between py-4">
                <dt className="text-base font-medium ">مجموع سفارش</dt>
                <dd className="text-base font-medium flex gap-2 ">
                  <Currency value={basketTotal} />
                  تومان
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            onClick={onCheckout}
            disabled={cart.length === 0}
            className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
          >
            تسویه
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            <Link
              href="/"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              <span aria-hidden="true"> &rarr;</span>
              ادامه خرید
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Summary
