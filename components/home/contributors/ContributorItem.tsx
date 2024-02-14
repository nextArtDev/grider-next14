'use client'
import { ContributorWithImage } from '@/lib/queries/home/contributors'
import { FC } from 'react'
import { CardBody, CardContainer, CardItem } from '../3d-card-effect/3DCard'
import Image from 'next/image'
import Link from 'next/link'
import { translateArray } from '@/lib/utils'
import NoPic from '../../../public/images/no-profile.webp'

interface ContributorItemProps {
  contributor: ContributorWithImage
}

const ContributorItem: FC<ContributorItemProps> = ({ contributor }) => {
  return (
    <CardContainer className="inter-var">
      <CardBody className="flex-start bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[15rem] h-auto rounded-xl p-3 border  ">
        <CardItem
          translateZ="50"
          className="text-xl font-bold text-neutral-600 dark:text-white"
        >
          {contributor.name}
        </CardItem>
        <CardItem
          as="p"
          translateZ="60"
          className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
        >
          {translateArray(contributor.role.map((role) => role)).join(' | ')}
        </CardItem>

        <CardItem translateZ="100" className="w-full mt-4 place-self-start ">
          <Link href={`/contributors/${contributor.id}`}>
            <Image
              src={contributor.image?.url || NoPic.src}
              height="512"
              width="356"
              className="h-[512] w-[356] object-cover rounded-xl group-hover/card:shadow-xl"
              alt={contributor.name}
            />
          </Link>
        </CardItem>

        {/* <div className="flex justify-between items-center mt-20">
            <CardItem
              translateZ={20}
              as="button"
              className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
            >
              Try now →
            </CardItem>
            <CardItem
              translateZ={20}
              as="button"
              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
            >
              Sign up
            </CardItem>
          </div> */}
      </CardBody>
    </CardContainer>
  )
}

export default ContributorItem
