import { formatDistanceToNowStrict } from 'date-fns-jalali'
import locale from 'date-fns/locale/fa-IR'
import qs from 'query-string'
import { BADGE_CRITERIA } from './constants'
import { BadgeCounts } from '@/types/social'

export function getTimestamp(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  })
}

export const getJoinedDate = (date: Date): string => {
  const month = date.toLocaleString('default', { month: 'long' })
  const year = date.getFullYear()

  return `${month} ${year}`
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

interface BadgeParam {
  criteria: {
    type: keyof typeof BADGE_CRITERIA
    count: number
  }[]
}

export const assignBadges = (params: BadgeParam) => {
  const badgeCounts: BadgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  }
  const { criteria } = params

  criteria.forEach((item) => {
    const { type, count } = item
    const badgeLevels: any = BADGE_CRITERIA[type]

    Object.keys(badgeLevels).forEach((level: any) => {
      if (count >= badgeLevels[level]) {
        badgeCounts[level as keyof BadgeCounts] += 1
      }
    })
  })
  return badgeCounts
}

const formatDistanceLocale = {
  lessThanXSeconds: 'همین الان',
  xSeconds: 'همین الان',
  halfAMinute: 'همین الان',
  lessThanXMinutes: '{{count}} دقیقه',
  xMinutes: '{{count}} دقیقه',
  aboutXHours: '{{count}} ساعت',
  xHours: '{{count}} ساعت',
  xDays: '{{count}} روز',
  aboutXWeeks: '{{count}} هفته',
  xWeeks: '{{count}} هفته',
  aboutXMonths: '{{count}} ماه',
  xMonths: '{{count}} ماه',
  aboutXYears: '{{count}} سال',
  xYears: '{{count}} سال',
  overXYears: '{{count}} سال',
  almostXYears: '{{count}} سال',
}

function formatDistance(token: string, count: number, options?: any): string {
  options = options || {}

  const result = formatDistanceLocale[
    token as keyof typeof formatDistanceLocale
  ].replace('{{count}}', count.toString())

  if (options.addSuffix) {
    if (options.comparison > 0) {
      return 'در ' + result
    } else {
      if (result === 'همین الان') return result
      return result + ' پیش '
    }
  }

  return result
}

export function formatTimeToNow(date: Date): string {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    locale: {
      ...locale,
      formatDistance,
    },
  })
}

export function formatLargeNumber(number: number): string {
  switch (true) {
    case number >= 1000000:
      return (number / 1000000).toFixed(1) + 'میلیون'
    case number >= 1000:
      return (number / 1000).toFixed(1) + 'هزار'
    default:
      return number + ''
  }
}
