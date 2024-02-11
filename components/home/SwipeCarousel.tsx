'use client'
import React, { useEffect, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { CategoryFullStructure } from '@/lib/queries/home/category'
import { Image } from '@prisma/client'

const imgs = [
  '/imgs/nature/1.jpg',
  '/imgs/nature/2.jpg',
  '/imgs/nature/3.jpg',
  '/imgs/nature/4.jpg',
  '/imgs/nature/5.jpg',
  '/imgs/nature/6.jpg',
  '/imgs/nature/7.jpg',
]

const ONE_SECOND = 1000
const AUTO_DELAY = ONE_SECOND * 3
const DRAG_BUFFER = 50

const SPRING_OPTIONS = {
  type: 'spring',
  mass: 3,
  stiffness: 400,
  damping: 50,
}

interface SwipeCarouselProps {
  categories: CategoryFullStructure[] | null
}

export const SwipeCarousel = ({ categories }: SwipeCarouselProps) => {
  const images = categories?.map((category) => category.image)
  const categoryNames = categories?.map((category) => category.name)
  // images?.map((image) => image?.url)
  // console.log(images?.map((image) => image?.url))

  const [imgIndex, setImgIndex] = useState(0)
  // console.log(categoryNames?.[imgIndex])

  const dragX = useMotionValue(0)

  useEffect(() => {
    const intervalRef = setInterval(() => {
      const x = dragX.get()
      if (x === 0) {
        setImgIndex((pv) => {
          if (pv === images?.length! - 1) {
            return 0
          }
          return pv + 1
        })
      }
    }, AUTO_DELAY)

    return () => clearInterval(intervalRef)
  }, [dragX, images?.length])

  const onDragEnd = () => {
    const x = dragX.get()

    if (x <= -DRAG_BUFFER && imgIndex < images?.length! - 1) {
      setImgIndex((pv) => pv + 1)
    } else if (x >= DRAG_BUFFER && imgIndex > 0) {
      setImgIndex((pv) => pv - 1)
    }
  }

  return (
    <div className="max-w-5xl w-full mx-auto relative overflow-hidden bg-transparent dark:bg-primary/5 rounded-xl py-8">
      <motion.div
        drag="x"
        dragConstraints={{
          left: 0,
          right: 0,
        }}
        style={{
          x: dragX,
        }}
        animate={{
          translateX: `-${imgIndex * 100}%`,
        }}
        transition={SPRING_OPTIONS}
        onDragEnd={onDragEnd}
        className="flex cursor-grab items-center active:cursor-grabbing"
      >
        <Images
          imgIndex={imgIndex}
          images={images}
          categoryNames={categoryNames}
        />
      </motion.div>

      <Dots imgIndex={imgIndex} setImgIndex={setImgIndex} images={images} />
      <GradientEdges />
    </div>
  )
}

interface ImagesProps {
  images: (Partial<Image> | null)[] | undefined
  imgIndex: number
  categoryNames: string[] | undefined
}
const Images = ({ imgIndex, images, categoryNames }: ImagesProps) => {
  const [categoryName, setCategoryName] = useState(categoryNames?.[0])
  useEffect(() => {
    setCategoryName(categoryNames?.[imgIndex])
  }, [imgIndex])
  return (
    <>
      {images?.map((imgSrc, idx) => {
        return (
          <>
            <motion.div
              key={idx}
              style={{
                backgroundImage: `url(${imgSrc?.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              animate={{
                scale: imgIndex === idx ? 0.95 : 0.85,
              }}
              transition={SPRING_OPTIONS}
              className="relative aspect-video w-full shrink-0 rounded-md bg-transparent object-cover"
            >
              <motion.p
                animate={{ opacity: imgIndex === idx ? 1 : 0 }}
                initial={{ opacity: 0.5 }}
                transition={SPRING_OPTIONS}
                className="absolute bottom-7 w-fit left-1/2 -translate-x-[50%] text-2xl bg-secondary/40 px-4 py-2 rounded-xl bg-blur-2xl font-extrabold "
              >
                {categoryName}
              </motion.p>
            </motion.div>
          </>
        )
      })}
    </>
  )
}

interface DotsProps {
  images: (Partial<Image> | null)[] | undefined
  imgIndex: number
  setImgIndex: React.Dispatch<React.SetStateAction<number>>
}
const Dots = ({ imgIndex, setImgIndex, images }: DotsProps) => {
  return (
    <div className="mt-4 flex w-full justify-center gap-2">
      {images?.map((_: any, idx: number) => {
        return (
          <button
            key={idx}
            onClick={() => setImgIndex(idx)}
            className={`h-3 w-3 rounded-full transition-colors ${
              idx === imgIndex
                ? 'bg-neutral-500 dark:bg-neutral-50'
                : 'dark:bg-neutral-500 bg-neutral-200'
            }`}
          />
        )
      })}
    </div>
  )
}

const GradientEdges = () => {
  return (
    <>
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-r from-neutral-950/50 to-neutral-950/0 " />
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-l from-neutral-950/50 to-neutral-950/0" />
    </>
  )
}
