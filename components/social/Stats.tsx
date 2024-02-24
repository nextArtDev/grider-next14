'use client'
import Image from 'next/image'
import { FC } from 'react'
import GoldImage from '@/public/assets/icons/gold-medal.svg'
import SilverImage from '@/public/assets/icons/silver-medal.svg'
import BronzeImage from '@/public/assets/icons/bronze-medal.svg'
import { formatLargeNumber } from '@/lib/socialUtils'
import { BadgeCounts } from '@/types/social'
import { BackgroundGradient } from '../shared/BackgrounGradient'

interface StatsProps {
  totalQuestions: number
  totalAnswers: number
  badges: BadgeCounts
  reputation: number
}

const Stats: FC<StatsProps> = ({
  totalQuestions,
  totalAnswers,
  badges,
  reputation,
}) => {
  return (
    <div className="mt-10">
      <h4 className="font-semibold ">امتیاز - {reputation}</h4>
      <div className="xs:grid-cols-1 mt-5 grid grid-cols-2 gap-5 md:grid-cols-4 ">
        <BackgroundGradient className=" max-w-sm p-4 sm:p-10 flex flex-wrap items-center justify-evenly align-middle gap-4  ">
          <div className="flex gap-1 flex-wrap">
            <p className="font-semibold">{formatLargeNumber(totalQuestions)}</p>
            <p>سوال</p>
          </div>
          <div className="flex gap-1 flex-wrap">
            <p className="font-semibold">{formatLargeNumber(totalAnswers)}</p>
            <p>جواب</p>
          </div>
        </BackgroundGradient>
        <StatsCard
          imgUrl={GoldImage.src}
          value={badges.GOLD}
          title="نشان‌ طلا"
        />
        <StatsCard
          imgUrl={SilverImage.src}
          value={badges.SILVER}
          title="نشان‌ نقره"
        />
        <StatsCard
          imgUrl={BronzeImage.src}
          value={badges.BRONZE}
          title="نشان‌ برنز"
        />
      </div>
    </div>
  )
}

export default Stats

interface statsCardProps {
  imgUrl: string
  value: number
  title: string
}
export const StatsCard = ({ imgUrl, value, title }: statsCardProps) => {
  return (
    // <div className="flex flex-wrap items-center justify-start gap-4 rounded-md border shadow-lime-200 ">
    <BackgroundGradient className=" max-w-sm p-4 sm:p-10 flex flex-wrap items-center justify-start gap-4 rounded-md ">
      <Image src={imgUrl} alt={title} width={40} height={50} />
      <div className="flex gap-1 md:flex-col font-semibold text-xs md:text-sm text-secondary-foreground ">
        <p className="text-sm md:text-base">{value}</p>
        <p>{title}</p>
      </div>
    </BackgroundGradient>
  )
}
