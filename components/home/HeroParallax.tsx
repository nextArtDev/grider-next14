'use client'
import React from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { CategoryFullStructure } from '@/lib/queries/home/category'
import FlipCover from './product/3d-cover/FlipCover'
import { Product } from '@prisma/client'

export const HeroParallax = ({
  categories,
}: {
  categories: CategoryFullStructure[] | null
}) => {
  const products = categories?.flatMap((category) =>
    category.products?.map((product) => product)
  )

  const firstRow = products?.slice(0, 4)
  const secondRow = products?.slice(4, 8)
  const thirdRow = products?.slice(8, 11)
  //   console.log({ firstRow })
  const ref = React.useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const springConfig = { stiffness: 300, damping: 30, bounce: 100 }

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 200]),
    springConfig
  )
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  )
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  )
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  )
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  )
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [-700, 500]),
    springConfig
  )
  return (
    <div
      ref={ref}
      className="h-[400vh] py-8 overflow-hidden  antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d]"
    >
      <Header />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className=""
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-4 mb-4">
          <h2>پرفروشترینها:</h2>
          {firstRow?.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product?.id}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row  space-x-4 mb-4 ">
          {secondRow?.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product?.id}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-8">
          {thirdRow?.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product?.id}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto py-20 md:py-40 px-4 w-full  left-0 top-0">
      <h1 className="text-2xl md:text-7xl font-bold dark:text-white">
        کتابفروشی فردا <br />
      </h1>
      <p className="max-w-2xl text-base md:text-xl mt-8 dark:text-neutral-200">
        کتابفروشی و لوازم تحریر فردا
      </p>
    </div>
  )
}

export const ProductCard = ({
  product,
  translate,
}: {
  product: (Product & { images: { url: string }[] }) | undefined
  translate: MotionValue<number>
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product?.title}
      className="relative group/product  flex-shrink-0"
    >
      <Link
        href={`/products/${product?.id}`}
        className="block group-hover/product:shadow-2xl "
      >
        {/* <Image
          src={product.images[0].url}
          fill
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        /> */}
        <FlipCover title={product?.title!} url={product?.images[0].url!} />
      </Link>
      {/* <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none"></div> */}
      {/* <h2 className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 text-white">
        {product.title}
      </h2> */}
    </motion.div>
  )
}
