import React from 'react'
import './flip-cover.scss'
import Image from 'next/image'
import { cn } from '@/lib/utils'
type Props = {
  url: string
  title: string
  cover?: string | null
  className?: string
}

function FlipCover({ url, title, cover, className }: Props) {
  return (
    <div className={cn('book-items w-[296px]  ', className)}>
      <div className="main-book-wrap">
        <div className="book-cover " style={{ rotate: ' y 180deg' }}>
          <div className="book-inside "></div>
          <div
            className="book-image"
            style={{ borderRadius: cover === 'Narm' ? '2px' : '' }}
          >
            <Image
              width={296}
              height={356}
              alt={title}
              src={url}
              style={{
                rotate: ' y -180deg',
                borderRadius: cover === 'Narm' ? '2px' : '',
              }}
              className="img object-cover  w-full h-full  "
            />
            <div style={{ rotate: ' y -180deg' }} className="effect"></div>
            <div className="lighting" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlipCover
