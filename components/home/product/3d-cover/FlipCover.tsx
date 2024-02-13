import React from 'react'
import './flip-cover.scss'
import Image from 'next/image'
type Props = {
  url: string
  title: string
}

function FlipCover({ url, title }: Props) {
  return (
    <div className="book-items w-[296px] ">
      <div className="main-book-wrap">
        <div className="book-cover " style={{ rotate: ' y 180deg' }}>
          <div className="book-inside"></div>
          <div className="relative book-image">
            <img
              alt={title}
              src={url}
              style={{ rotate: ' y -180deg' }}
              className="img object-cover  "
            />
            <div style={{ rotate: ' y -180deg' }} className="effect"></div>
            <div className="light"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlipCover
