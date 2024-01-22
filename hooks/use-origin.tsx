import { useEffect, useState } from 'react'

export const useOrigin = () => {
  const [mounted, setMounted] = useState(false)
  //if window is not undefined "and" we have window.location.origin, return window.location.origin else return nothing
  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : ''

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return ''
  }

  return origin
}
