import Image from 'next/image'
import { FC } from 'react'
import darkIllustration from '../../public/assets/images/dark-illustration.png'
import lightIllustration from '../../public/assets/images/light-illustration.png'
import Link from 'next/link'
import { buttonVariants } from '../ui/button'
import { cn } from '@/lib/utils'

interface NoResultProps {
  title: string
  description: string
  link: string
  linkTitle: string
}

const NoResult: FC<NoResultProps> = ({
  title,
  description,
  link,
  linkTitle,
}) => {
  return (
    <section className=" mt-10 flex w-full flex-col items-center justify-center text-slate-300 ">
      <Image
        src={darkIllustration.src}
        alt="no results"
        width={270}
        height={200}
        className="hidden object-contain dark:flex "
      />
      <Image
        src={lightIllustration.src}
        alt="no results"
        width={270}
        height={200}
        className="flex object-contain dark:hidden "
      />
      <h2 className="mt-4 text-2xl font-bold text-slate-200 ">{title}</h2>
      <p className="my-3.5 max-w-md">{description}</p>
      <Link href={link} className={cn(buttonVariants(), 'metalize ')}>
        {linkTitle}
      </Link>
    </section>
  )
}

export default NoResult
