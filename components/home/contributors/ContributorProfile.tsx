'use client'
import { FC } from 'react'
import LampHeader from './LampHeader'
import { ContributorFullStructure } from '@/lib/queries/home/contributors'
import Image from 'next/image'
import { BackgroundGradient } from '@/components/shared/BackgrounGradient'
import NoPic from '../../../public/images/no-profile.webp'
import { translateArray } from '@/lib/utils'
import { LampContainer } from '@/components/shared/LampEffect'
import { motion } from 'framer-motion'
import { TypewriterEffectSmooth } from '@/components/shared/TypeWriterEffect'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

interface ContributorProfileProps {
  contributor: ContributorFullStructure
}

const ContributorProfile: FC<ContributorProfileProps> = ({ contributor }) => {
  // const splitedName = contributor.name.split(' ').map((word,i)=>
  // return []
  // )
  function createWordObjectsFromSentence(sentence: string) {
    const wordsArray = sentence.split(' ').map((word, i) => {
      // return { text: word }
      if (i % 3 === 0) {
        return {
          text: word,
          className: 'text-blue-500 dark:text-blue-500',
        }
      } else {
        return { text: word }
      }
    })

    return wordsArray
  }

  const workWords = translateArray(contributor.role.map((role) => role)).join(
    ' | '
  )
  // const words = contributor.name
  return (
    <section className="flex flex-col">
      <div className="p-4 max-w-7xl flex items-center justify-evenly flex-col md:flex-row gap-4">
        {/* <BackgroundGradient className="w-[250px] h-[250px] rounded-[22px] max-w-sm">
        <Image
          src={contributor.image?.url || NoPic.src}
          alt={contributor.name}
          height={250}
          width={250}
          className="object-contain"
        />
      </BackgroundGradient> */}
        <Card className="relative flex-shrink-0 w-80 h-80 overflow-hidden ">
          <Image
            fill
            src={contributor.image?.url || NoPic.src}
            alt={contributor.name}
            className="object-cover"
          />
        </Card>
        <div className="">
          <span>
            {' '}
            <TypewriterEffectSmooth
              words={createWordObjectsFromSentence(contributor.name)}
            />
          </span>
          <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
            <TypewriterEffectSmooth
              words={createWordObjectsFromSentence(workWords)}
            />
          </p>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {contributor.bio}
          </p>
        </div>
        {/* <LampContainer>
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className=" flex flex-col mt-4 bg-gradient-to-br from-slate-300 to-slate-500 py-12 bg-clip-text text-center text-2xl font-medium tracking-tight text-transparent md:text-5xl"
        >

          <h2 className="py-4">{contributor.name}</h2>
        </motion.div>
      </LampContainer> */}
      </div>
      <Separator />
    </section>
  )
}

export default ContributorProfile
