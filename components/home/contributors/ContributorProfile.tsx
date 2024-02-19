'use client'
import AddRating from '@/components/shared/AddRating'
import ListRating from '@/components/shared/ListRating'
import { TypewriterEffectSmooth } from '@/components/shared/TypeWriterEffect'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ContributorFullStructure } from '@/lib/queries/home/contributors'
import { translateArray } from '@/lib/utils'
import { User } from '@prisma/client'
import Image from 'next/image'
import { FC, useEffect, useState } from 'react'
import NoPic from '../../../public/images/no-profile.webp'

interface ContributorProfileProps {
  contributor: ContributorFullStructure
  user: (User & { image: { url: string } | null }) | null
  beforeRated?: {
    rating: number
  } | null
}

const ContributorProfile: FC<ContributorProfileProps> = ({
  contributor,
  beforeRated,
  user,
}) => {
  // const splitedName = contributor.name.split(' ').map((word,i)=>
  // return []
  // )
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
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
  if (!isMounted) {
    return null
  }
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
      {!beforeRated && (
        <div className="py-12 px-4 ">
          <h2 className="text-xl font-semibold">
            نظر خود راجع به {contributor.name} را ثبت کنید.
          </h2>
          <AddRating
            reviews={contributor.Reviews}
            product={contributor}
            user={user}
          />
        </div>
      )}
      <ListRating reviews={contributor.Reviews} />
    </section>
  )
}

export default ContributorProfile
