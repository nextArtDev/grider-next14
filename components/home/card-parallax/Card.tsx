'use client'
import NextImage from 'next/image'
import styles from './style.module.scss'
import { useTransform, motion, useScroll, MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { Billboard, Category, Image } from '@prisma/client'
import { CategoryFullStructure } from '@/lib/queries/home/category'

interface CardProps {
  i: number
  // title: string
  // description: string
  // src: string
  // url?: string
  // color: string
  category: CategoryFullStructure | null
  progress: MotionValue<number>
  range: number[]
  targetScale: number
}
const Card = ({
  i,
  // title,
  // description,
  // src,
  // url,
  // color,
  progress,
  range,
  targetScale,
  category,
}: CardProps) => {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])
  //   const imageRotate = useTransform(scrollYProgress, [0, 1], [360, 0])
  const scale = useTransform(progress, range, [1, targetScale])

  return (
    <div ref={container} className={styles.cardContainer}>
      <motion.div
        style={{
          backgroundImage: `url(${category?.billboard.image?.url})`,
          // backgroundImage: `url(/parallax-images/${src})`,
          backgroundBlendMode: 'multiply',
          // backgroundColor: color,
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
          boxShadow:
            'rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px, rgba(10, 37, 64, 0.35) 0px -2px 6px 0px inset',
        }}
        className={`${styles.card} `}
      >
        <h2>{category?.billboard.label}</h2>
        <div className={styles.body}>
          <div className={styles.description}>
            <p>{category?.name}</p>
            {/* <span>
              <a href={url} target="_blank">
                See more
              </a>
              <svg
                width="22"
                height="12"
                viewBox="0 0 22 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21.5303 6.53033C21.8232 6.23744 21.8232 5.76256 21.5303 5.46967L16.7574 0.696699C16.4645 0.403806 15.9896 0.403806 15.6967 0.696699C15.4038 0.989592 15.4038 1.46447 15.6967 1.75736L19.9393 6L15.6967 10.2426C15.4038 10.5355 15.4038 11.0104 15.6967 11.3033C15.9896 11.5962 16.4645 11.5962 16.7574 11.3033L21.5303 6.53033ZM0 6.75L21 6.75V5.25L0 5.25L0 6.75Z"
                  fill="black"
                />
              </svg>
            </span> */}
          </div>

          <div className={styles.imageContainer}>
            <motion.div
              className={styles.inner}
              style={{
                scale: imageScale,
              }}
            >
              <NextImage
                fill
                src={category?.products?.[0]?.images?.[0]?.url || ''}
                alt="image"
                className=""
              />
              {/* <NextImage fill src={`/parallax-images/${src}`} alt="image" /> */}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Card
