export enum Size {
  Roghei = 'رقعی',
  Kheshti = 'خشتی',
  Rahli = 'رحلی',
  Vaziri = 'وزیری',
  Soltani = 'سلطانی',
  Gibi = 'جیبی',
  Paltoei = 'پالتویی',
  Hamayeli = 'حمایلی',
  Janamazi = 'جانمازی',
  Beyazee = 'بیاضی',
}

export enum Cover {
  Shomiz = 'شومیز',
  Kaghazi = 'کاغذی',
  Galingor = 'گلینگور',
  Sakht = 'سخت',
  Narm = 'نرم',
  Ghalaf = 'غلاف',
  Zarrin = 'زرین',
  Makhmal = 'مخمل',
  Cherm = 'چرم',
  Parcheh = 'پارچه',
}

export enum Contributor {
  'Writer',
  'Translator',
  'Editor',
  'Illustrator',
  'Photographer',
}
// export enum Contributor {
//   Writer = 'نویسنده',
//   Translator = 'مترجم',
//   Editor = 'ویراستار',
//   Illustrator = 'تصویرساز',
//   Photographer = 'عکاس',
// }

export const sizes = [
  { value: 'Roghei', label: 'رقعی' },
  { value: 'Kheshti', label: 'خشتی' },
  { value: 'Rahli', label: 'رحلی' },
  { value: 'Vaziri', label: 'وزیری' },
  { value: 'Soltani', label: 'سلطانی' },
  { value: 'Gibi', label: 'جیبی' },
  { value: 'Paltoei', label: 'پالتویی' },
  { value: 'Hamayeli', label: 'حمایلی' },
  { value: 'Janamazi', label: 'جانمازی' },
  { value: 'Beyazee', label: 'بیاضی' },
]

export const covers = [
  { value: 'Shomiz', label: 'شومیز' },
  { value: 'Kaghazi', label: 'کاغذی' },
  { value: 'Galingor', label: 'گلینگور' },
  { value: 'Sakht', label: 'سخت' },
  { value: 'Narm', label: 'نرم' },
  { value: 'Ghalaf', label: 'غلاف' },
  { value: 'Zarrin', label: 'زرین' },
  { value: 'Makhmal', label: 'مخمل' },
  { value: 'Cherm', label: 'چرم' },
  { value: 'Parcheh', label: 'پارچه' },
]

export const contributor = [
  { value: 'Writer', label: 'نویسنده' },
  { value: 'Translator', label: 'مترجم' },
  { value: 'Editor', label: 'ویراستار' },
  { value: 'Illustrator', label: 'تصویرساز' },
  { value: 'Photographer', label: 'عکاس' },
] as const
