import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

interface GridOptionsProps {
  href: string
  title: string
  className?: string
  image?: string
}

const GridOptions: FC<GridOptionsProps> = ({
  title,
  className,
  image,
  href,
}: GridOptionsProps) => {
  return (
    <Link
      href={href}
      className={cn('grid-option relative overflow-hidden', className)}
    >
      <h2 className="text-xl font-bold ">{title}</h2>
      {image && (
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover opacity-30  "
        />
      )}
    </Link>
  )
}

export default GridOptions

// GridOptions:
{
  /* 
  grid-flow-row-dense finds another one to fill that
  return (
<div className='grid grid-col-1 grid-flow-row-dense md:grid-cols-4 gap-6 m-6' >
      <GridOptions title='', image='url' className='bg-pink-200 h-full md:h-32' />
      <GridOptions title='', image='url' className='bg-pink-200 col-span-2 row-span-2' />
      <GridOptions title='', image='url' className='bg-pink-200 row-span-2' />
      <GridOptions title='', image='url' className='bg-pink-200 row-span-2' />
      <GridOptions title='', image='url' className='bg-pink-200 h-64' />
      <GridOptions title='', image='url' className='bg-pink-200 h-64 col-span-2 ' />
      <GridOptions title='', image='url' className='bg-pink-200 h-64 col-span-2 ' />
      <GridOptions title='', image='url' className='bg-pink-200 h-64 col-span-2 ' /> 
      </div>
      )
      */
}
