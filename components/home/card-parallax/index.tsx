'use client'

import { useScroll } from 'framer-motion'
import { useEffect, useRef } from 'react'
import Lenis from '@studio-freight/lenis'
import Card from './Card'
import { projects } from './data'
import { Billboard, Category, Image, Product } from '@prisma/client'
import { CategoryFullStructure } from '@/lib/queries/home/category'

interface CardParallaxProps {
  categories: CategoryFullStructure[] | null
}
export default function CardParallax({ categories }: CardParallaxProps) {
  //   console.log(categories)

  //  const projects = [
  //   {
  //     title: 'Matthias Leidinger',
  //     description:
  //       'Originally hailing from Austria, Berlin-based photographer Matthias Leindinger is a young creative brimming with talent and ideas.',
  //     src: '1.jpg',
  //     link: 'https://www.ignant.com/2023/03/25/ad2186-matthias-leidingers-photographic-exploration-of-awe-and-wonder/',
  //     color: '#BBACAF',
  //   }
  // ]
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    const lenis = new Lenis()

    function raf(time: any) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  })

  return (
    <main ref={container} className="relative mt-[50vh]">
      {categories?.map((category, i) => {
        const targetScale = 1 - (projects.length - i) * 0.05
        return (
          <Card
            key={`p_${i}`}
            i={i}
            // {...project}
            category={category}
            progress={scrollYProgress}
            range={[i * 0.25, 1]}
            targetScale={targetScale}
          />
        )
      })}
    </main>
  )
}