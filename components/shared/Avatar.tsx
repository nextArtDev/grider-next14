import { UserCircle, UserCircle2Icon } from 'lucide-react'
import Image from 'next/image'
import { FC } from 'react'

interface AvatarProps {
  src?: string | null | undefined
}

const Avatar: FC<AvatarProps> = ({ src }) => {
  if (src) {
    return (
      <Image
        src={src}
        alt="Avatar"
        className="rounded-full"
        width={30}
        height={30}
      />
    )
  }
  return <UserCircle2Icon size={30} className="w-[30px] h-[30px]" />
}

export default Avatar
