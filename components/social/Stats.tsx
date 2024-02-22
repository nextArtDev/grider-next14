import Image from 'next/image'
import { FC } from 'react'
import GoldImage from '../../public/assets/icons/gold-medal.svg'
import SilverImage from '../../public/assets/icons/silver-medal.svg'
import BronzeImage from '../../public/assets/icons/bronze-medal.svg'
import { formatLargeNumber } from '@/lib/socialUtils'
import { BadgeCounts } from '@/types/social'

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
      <h4 className="font-semibold ">آمار - {reputation}</h4>
      <div className="xs:grid-cols-1 mt-5 grid grid-cols-2 gap-5 md:grid-cols-4 ">
        <div className="flex flex-wrap items-center justify-evenly gap-4 rounded-md border shadow-lime-200 ">
          <div>
            <p className="font-semibold">{formatLargeNumber(totalQuestions)}</p>
            <p>سوال</p>
          </div>
          <div>
            <p className="font-semibold">{formatLargeNumber(totalAnswers)}</p>
            <p>جواب</p>
          </div>
        </div>
        <StatsCard
          imgUrl={GoldImage.src}
          value={badges.GOLD}
          title="نشان‌های طلا"
        />
        <StatsCard
          imgUrl={SilverImage.src}
          value={badges.SILVER}
          title="نشان‌های نقره"
        />
        <StatsCard
          imgUrl={BronzeImage.src}
          value={badges.BRONZE}
          title="نشان‌های برنز"
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
    <div className="flex flex-wrap items-center justify-start gap-4 rounded-md border shadow-lime-200 ">
      <Image src={imgUrl} alt={title} width={40} height={50} />
      <div>
        <p className="font-semibold">{value}</p>
        <p className="font-semibold">{title}</p>
      </div>
    </div>
  )
}
