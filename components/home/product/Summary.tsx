import Currency from '@/components/shared/Currency'
import { FC } from 'react'

interface SummaryProps {
  basketTotal: string
}

const Summary: FC<SummaryProps> = ({ basketTotal }) => {
  return (
    <div>
      {' '}
      <div className="mt-10 sm:ml-32 sm:pl-6">
        <div className="rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:p-8">
          <h2 className="sr-only">Order summary</h2>

          <div className="flow-root">
            <dl className="-my-4 divide-y divide-gray-200 text-sm">
              <div className="flex items-center justify-between py-4">
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
              </div>
              <div className="flex items-center justify-between py-4">
                <dt className="text-base font-medium text-gray-900">
                  Order total
                </dt>
                <dd className="text-base font-medium text-gray-900">
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
            className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
          >
            تسویه
          </button>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            or
            <a
              href="#"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Continue Shopping
              <span aria-hidden="true"> &rarr;</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Summary
