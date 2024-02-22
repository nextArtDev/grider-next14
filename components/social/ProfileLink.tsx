import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

interface ProfileLinkProps {
  imgUrl: string
  title: string
  href?: string
}

const ProfileLink: FC<ProfileLinkProps> = ({ imgUrl, title, href }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <Image src={imgUrl} alt="icon" width={20} height={20} />

      {href ? (
        <Link href={href} target="_blank" className="text-blue-400 ">
          {title}
        </Link>
      ) : (
        <p>{title}</p>
      )}
    </div>
  )
}

export default ProfileLink
