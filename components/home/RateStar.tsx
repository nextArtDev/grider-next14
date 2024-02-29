import { FC } from 'react'
import { Rating } from '@mui/material'
import { StarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RateStarProps {
  rate: number
  reviewCounts: number
  className?: string
}

const RateStar: FC<RateStarProps> = ({ rate, reviewCounts, className }) => {
  return (
    <div
      className={cn(
        'flex items-center pb-6 justify-center w-full gap-1 text-center ',
        className
      )}
    >
      <Rating
        value={rate}
        readOnly
        precision={0.5}
        defaultValue={5}
        icon={
          <StarIcon
            fontSize="inherit"
            className={cn(
              'text-center text-yellow-500 fill-yellow-400 h-5 w-5 flex-shrink-0'
            )}
          />
        }
        emptyIcon={
          <StarIcon
            fontSize="inherit"
            className="text-gray-200 h-5 w-5 flex-shrink-0"
          />
        }
      />
      <p className="text-sm mr-1">{`(از ${reviewCounts} نظر)`}</p>
    </div>
  )
}

export default RateStar
