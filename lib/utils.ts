import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatter = new Intl.NumberFormat('fa-IR', {
  style: 'decimal',
  //   style: 'currency',
  currency: 'IRT',
})
