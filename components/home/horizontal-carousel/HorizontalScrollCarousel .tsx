'use client'
import { motion, useTransform, useScroll } from 'framer-motion'
import { useRef } from 'react'
import { GoogleGeminiEffect } from './Gemini'
import FlipCover from '../product/3d-cover/FlipCover'
import { cn } from '@/lib/utils'
import Link from 'next/link'

type CardType = {
  url: string
  title: string
  id: string
}

interface HorizontalScrollCarouselProps {
  cards: CardType[]
  rtl?: boolean
  className?: string
}
const HorizontalScrollCarousel = ({
  rtl,
  cards,
  className,
}: HorizontalScrollCarouselProps) => {
  const targetRef = useRef<HTMLDivElement | null>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })
  const xTransform: string = rtl ? '75%' : '-75%'
  const x = useTransform(scrollYProgress, [0, 1], ['1%', xTransform])

  //   const geminiTransform: number[] = rtl ? [1.2,0.2] : [0.2, 1.2]
  //   const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2])
  //   const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2])
  //   const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2])
  //   const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2])
  //   const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2])
  const pathLengthFirst = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2])
  const pathLengthSecond = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2])
  const pathLengthThird = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2])
  const pathLengthFourth = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2])
  const pathLengthFifth = useTransform(scrollYProgress, [0, 0.8], [0, 1.2])
  //   for rtl
  //   const x = useTransform(scrollYProgress, [0, 1], ['1%', '75%'])

  return (
    <section
      dir={rtl ? 'rtl' : 'ltr'}
      ref={targetRef}
      className={cn('relative h-[300vh] bg-transparent')}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden  ">
        <GoogleGeminiEffect
          pathLengths={[
            pathLengthFirst,
            pathLengthSecond,
            pathLengthThird,
            pathLengthFourth,
            pathLengthFifth,
          ]}
        />
        <motion.div style={{ x }} className="flex gap-4">
          {cards.map((card) => {
            // return <Card card={card} key={card.id} />
            return (
              <Link
                href={`/products/${card.id}`}
                key={card.id}
                className=" bg-transparent flex items-center justify-center group relative h-fit w-fit md:w-fit overflow-hidden  "
              >
                <FlipCover
                  title={card.title}
                  url={card.url}
                  className="bg-transparent "
                />
              </Link>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

const Card = ({ card }: { card: CardType }) => {
  return (
    <div
      key={card.id}
      className="g-transparent group relative h-[450px] w-[250px] md:w-[450px] overflow-hidden  "
    >
      <FlipCover title={card.title} url={card.url} className="" />
      <div
        style={{
          backgroundImage: `url(${card.url})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        className="absolute inset-0 z-0 transition-transform duration-300 group-hover:scale-110"
      ></div>
      <div className="absolute inset-0 z-10 grid place-content-center">
        <p className="bg-gradient-to-br from-white/5 to-white/0 p-8 text-3xl font-black uppercase text-white backdrop-blur-sm">
          {card.title}
        </p>
      </div>
    </div>
  )
}

export default HorizontalScrollCarousel
