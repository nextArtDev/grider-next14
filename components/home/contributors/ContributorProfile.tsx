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
    <div className=" w-[90%] mx-auto ">
      {/* <BackgroundGradient className="w-[250px] h-[250px] rounded-[22px] max-w-sm">
        <Image
          src={contributor.image?.url || NoPic.src}
          alt={contributor.name}
          height={250}
          width={250}
          className="object-contain"
        />
      </BackgroundGradient> */}
      <div className="pr-8">
        <span>
          {' '}
          <TypewriterEffectSmooth
            words={createWordObjectsFromSentence(contributor.name)}
          />
        </span>
        <p className="text-base sm:text-xl text-black mt-4 mb-2 dark:text-neutral-200">
          {/* {translateArray(contributor.role.map((role) => role)).join('| ')} */}
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
  )
}

export default ContributorProfile
