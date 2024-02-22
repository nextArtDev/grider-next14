import { Product } from '@prisma/client'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { SingleProductFullStructure } from './queries/home/products'
import qs from 'query-string'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatter = new Intl.NumberFormat('fa-IR', {
  style: 'decimal',
  //   style: 'currency',
  currency: 'IRT',
})

export function translateArray(inputArray: string[]): string[] {
  const translationMap: { [key: string]: string } = {
    Translator: 'مترجم',
    Editor: 'ویراستار',
    Writer: 'نویسنده',
    Illustrator: 'تصویرگر',
    Photographer: 'عکاس',
  }

  const translatedArray: string[] = []

  inputArray.forEach((item: string) => {
    const translatedItem: string = translationMap[item] || item

    translatedArray.push(translatedItem)
  })

  return translatedArray
}
export function translateCover(input: string): string {
  const translationMap: { [key: string]: string } = {
    Shomiz: 'شومیز',
    Kaghazi: 'کاغذی',
    Galingor: 'گلینگور',
    Sakht: 'سخت',
    Narm: 'نرم',
    Ghalaf: 'غلاف',
    Zarrin: 'زرین',
    Makhmal: 'مخمل',
    Cherm: 'چرم',
    Parcheh: 'پارچه',
  }

  return translationMap[input]
}
export function translateSize(input: string): string {
  const translationMap: { [key: string]: string } = {
    Roghei: 'رقعی',
    Kheshti: 'خشتی',
    Rahli: 'رحلی',
    Vaziri: 'وزیری',
    Soltani: 'سلطانی',
    Gibi: 'جیبی',
    Paltoei: 'پالتویی',
    Hamayeli: 'حمایلی',
    Janamazi: 'جانمازی',
    Beyazee: 'بیاضی',
  }

  return translationMap[input]
}

export function getFarsiBoolean(value: boolean): string {
  return value ? 'بلی' : 'خیر'
}

export function getBooleanFromFarsi(value: string): boolean {
  switch (value) {
    case 'بلی':
      return true
    case 'خیر':
      return false
    default:
      throw new Error('Invalid Farsi boolean value')
  }
}

export const productRating = (data: any) => {
  data.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
    data.reviews.length
}

export function getCartTotal(
  products: SingleProductFullStructure[] | Product[]
) {
  const total = products.reduce(
    (acc: number, currentProduct: SingleProductFullStructure | Product) =>
      acc + Number(currentProduct.price),
    0
  )
  return total.toFixed(0)
}

export function groupById(
  products: SingleProductFullStructure[]
): Record<string, SingleProductFullStructure[]> {
  return products?.reduce(
    (
      accumulator: Record<string, SingleProductFullStructure[]>,
      currentProduct: SingleProductFullStructure
    ) => {
      const id = currentProduct.id
      if (!accumulator[id]) {
        accumulator[id] = []
      }
      accumulator[id].push(currentProduct)
      return accumulator
    },
    {}
  )
}

interface UrlQueryParams {
  params: string
  key: string
  value: string | null
}

export const fromUrlQuery = ({ params, key, value }: UrlQueryParams) => {
  // accessing the current url
  const currentUrl = qs.parse(params)
  // query-string package automatically gives you the search params

  // it only updates the one we want to update, while keeping everything else the same in component's useState
  currentUrl[key] = value

  return qs.stringifyUrl(
    {
      // base url
      url: window.location.pathname,
      // current url
      query: currentUrl,
    },
    // options: we don't need null values
    { skipNull: true }
  )
}

interface RemoveUrlQueryParams {
  params: string
  keysToRemove: string[]
}
export const removeKeysFromUrlQuery = ({
  params,
  keysToRemove,
}: RemoveUrlQueryParams) => {
  const currentUrl = qs.parse(params)

  keysToRemove.forEach((key) => {
    delete currentUrl[key]
  })

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  )
}
