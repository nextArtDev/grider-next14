'use client'

import { useEffect, useState } from 'react'

const formatter = new Intl.NumberFormat('fa-IR', {
  style: 'decimal',
  //   style: 'currency',
  currency: 'IRT',
})

interface CurrencyProps {
  value?: string | number
}

const Currency: React.FC<CurrencyProps> = ({ value = 0 }) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div dir="ltr" className="font-semibold">
      {formatter.format(Number(value))}
    </div>
  )
}

export default Currency
