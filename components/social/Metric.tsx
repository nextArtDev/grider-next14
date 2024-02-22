import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

interface MetricProps {
  imgUrl: string
  alt: string
  value: string | number
  title: string
  href?: string
  textStyles?: string
  isAuthor?: boolean
}

const Metric: FC<MetricProps> = ({
  imgUrl,
  alt,
  title,
  textStyles,
  value,
  href,
  isAuthor,
}) => {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        width={16}
        height={16}
        alt={alt}
        className={`object-contain ${href ? 'rounded-full' : ''}`}
      />
      <p className={`${textStyles} flex items-center gap-1`}>
        {value}
        <span
          className={`line-clamp-1 text-sm ${isAuthor ? 'max-sm:hidden' : ''} `}
        >
          {title}
        </span>
      </p>
    </>
  )

  if (href) {
    return (
      <Link href={href} className="flex items-center justify-center gap-1">
        {metricContent}
      </Link>
    )
  }
  return (
    <div className="flex flex-wrap items-center justify-center gap-1">
      {metricContent}
    </div>
  )
}

export default Metric
