import { SidebarLink } from '@/types/social'

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

//Social Constants

export const themes = [
  { value: 'light', label: 'روز', icon: '/assets/icons/sun.svg' },
  { value: 'dark', label: 'شب', icon: '/assets/icons/moon.svg' },
  { value: 'system', label: 'سیستم', icon: '/assets/icons/computer.svg' },
]
export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: '/assets/icons/home.svg',
    route: '/social',
    label: 'خانه',
  },
  {
    imgURL: '/assets/icons/users.svg',
    route: '/social/community',
    label: 'کامیونیتی',
  },
  {
    imgURL: '/assets/icons/star.svg',
    route: '/social/collection',
    label: 'کلکسیون',
  },
  {
    imgURL: '/assets/icons/suitcase.svg',
    route: '/social/jobs',
    label: 'شغلها',
  },
  {
    imgURL: '/assets/icons/tag.svg',
    route: '/social/tags',
    label: 'تگها',
  },
  {
    imgURL: '/assets/icons/user.svg',
    route: '/social/profile',
    label: 'پروفایل',
  },
  {
    imgURL: '/assets/icons/question.svg',
    route: '/social/ask-question',
    label: 'سوال پرسیدن',
  },
]
export const BADGE_CRITERIA = {
  QUESTION_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_COUNT: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  QUESTION_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  ANSWER_UPVOTES: {
    BRONZE: 10,
    SILVER: 50,
    GOLD: 100,
  },
  TOTAL_VIEWS: {
    BRONZE: 1000,
    SILVER: 10000,
    GOLD: 100000,
  },
}

export const AnswerFilters = [
  { name: 'بیشترین لایک', value: 'highestUpvotes' },
  { name: 'کمترین لایک', value: 'lowestUpvotes' },
  { name: 'جدیدترین', value: 'recent' },
  { name: 'قدیمی‌ترین', value: 'old' },
]
export const UserFilters = [
  { name: 'کاربر جدید', value: 'new_users' },
  {
    name: 'کاربر قدیمی',
    value: 'old_users',
  },
  {
    name: 'بیشترین مشارکت',
    value: 'top_contributors',
  },
]
export const QuestionFilters = [
  {
    name: 'جدیدترین',
    value: 'most_recent',
  },
  {
    name: 'قدیمی‌ترین',
    value: 'oldest',
  },
  {
    name: 'بیشترین رای',
    value: 'most_voted',
  },
  {
    name: 'بیشترین بازدید',
    value: 'most_viewed',
  },
  {
    name: 'بیشترین جواب',
    value: 'most_answered',
  },
]
export const TagFilters = [
  {
    name: 'محبوب',
    value: 'popular',
  },
  {
    name: 'اخیر',
    value: 'recent',
  },
  {
    name: 'نام',
    value: 'name',
  },
  {
    name: 'قدیمی‌تر',
    value: 'old',
  },
]
export const HomePageFilters = [
  {
    name: 'جدیدترین',
    value: 'newest',
  },
  {
    name: 'پیشنهادی',
    value: 'recommended',
  },
  {
    name: 'پرتکرار',
    value: 'frequent',
  },
  {
    name: 'بدون جواب',
    value: 'unanswered',
  },
]
export const GlobalSearchFilters = [
  {
    name: 'سوال',
    value: 'question',
  },
  {
    name: 'جواب',
    value: 'answer',
  },
  {
    name: 'کاربر',
    value: 'user',
  },
  {
    name: 'تگ',
    value: 'tag',
  },
]
export const GlobalHomeSearchFilters = [
  {
    name: 'کتاب',
    value: 'product',
  },
  {
    name: 'نویسنده/مترجم',
    value: 'contributor',
  },
  {
    name: 'دسته‌بندی',
    value: 'category',
  },
]

export const ProductPageFilters = [
  {
    name: 'پرفروشترین',
    value: 'ordered',
  },
  {
    name: 'جدیدترین',
    value: 'newest',
  },
  {
    name: 'پیشنهادی',
    value: 'recommended',
  },
  // {
  //   name: 'محبوبترین',
  //   value: 'popular',
  // },
  {
    name: 'قدیمی‌ترین',
    value: 'oldest',
  },
]

export const WebsiteSearchFilters = [
  {
    name: 'عنوان کتاب',
    value: 'book_title',
  },
  {
    name: 'نویسنده',
    value: 'writer',
  },
  {
    name: 'دسته‌بندی',
    value: 'billboard',
  },
  {
    name: 'ناشر',
    value: 'publisher',
  },
]

export const homeSidebarLinks: SidebarLink[] = [
  {
    imgURL: '/assets/icons/home.svg',
    route: '/',
    label: 'خانه',
  },
  {
    imgURL: '/assets/icons/social.svg',
    route: '/socisl',
    label: 'شبکه اجتماعی',
  },
  {
    imgURL: '/assets/icons/book.svg',
    route: '/products',
    label: 'کتاب‌ها',
  },
  {
    imgURL: '/assets/icons/category.svg',
    route: '/categories',
    label: 'دسته‌بندی‌ها',
  },
  {
    imgURL: '/assets/icons/suitcase.svg',
    route: '/billboards',
    label: 'گروه‌ها',
  },
  {
    imgURL: '/assets/icons/location.svg',
    route: '/about-us',
    label: 'درباره ما',
  },
  {
    imgURL: '/assets/icons/contact.svg',
    route: '/connect-us',
    label: 'ارتباط با ما',
  },
  {
    imgURL: '/assets/icons/question.svg',
    route: '/dashboard',
    label: 'داشبورد',
  },
]
