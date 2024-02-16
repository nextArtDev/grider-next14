'use client'
import React, { useEffect, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { CategoryFullStructure } from '@/lib/queries/home/category'
import { Image } from '@prisma/client'

const ONE_SECOND = 1000
const AUTO_DELAY = ONE_SECOND * 3.5
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
    <div className="my-8 max-w-5xl w-full mx-auto relative overflow-hidden bg-transparent   rounded-xl py-8  ">
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
  }, [categoryNames, imgIndex])
  return (
    <>
      {images?.map((imgSrc, idx) => {
        return (
          <motion.div
            key={idx}
            style={{
              backgroundImage: `url(${imgSrc?.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            animate={{
              scale: imgIndex === idx ? 0.95 : 0.75,
            }}
            transition={SPRING_OPTIONS}
            className="relative aspect-video w-full shrink-0 rounded-md bg-bg-primary/25 object-cover"
          >
            <motion.p
              animate={{ opacity: imgIndex === idx ? 1 : 0 }}
              initial={{ opacity: 0 }}
              transition={SPRING_OPTIONS}
              style={{
                boxShadow:
                  ' rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset',
              }}
              className="absolute -top-8 w-fit left-1/2 -translate-x-[50%] text-2xl bg-secondary/40 px-4 py-2 rounded-xl bg-blur-2xl font-extrabold mix-blend-color-burn "
            >
              {categoryName}
            </motion.p>
          </motion.div>
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
    <div className="mt-5 flex w-full justify-center gap-1.5">
      {images?.map((_: any, idx: number) => {
        return (
          <button
            key={idx}
            onClick={() => setImgIndex(idx)}
            className={`  shadow-2xl w-2.5 h-2.5 md:h-3 md:w-3 rounded-full transition-all ${
              idx === imgIndex
                ? 'bg-primary/85 w-4 md:w-6  '
                : '  bg-primary/35'
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
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-r from-primary/45 dark:to-primary/0 " />
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-l from-primary/45 dark:to-primary/0" />
    </>
  )
}
