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
export function getFarsiBoolean(value: boolean): string {
  return value ? 'بلی' : 'خیر'
}
