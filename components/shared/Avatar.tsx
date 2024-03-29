import { UserCircle, UserCircle2Icon } from 'lucide-react'
import Image from 'next/image'
import { FC } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { cn } from '@/lib/utils'

interface AvatarProps {
  src?: string | null | undefined
  alt?: string
  className?: string
}

const UserAvatar: FC<AvatarProps> = ({ src, alt, className }) => {
  if (src) {
    return (
      // <Image
      //   src={src}
      //   alt="Avatar"
      //   className="rounded-full"
      //   width={30}
      //   height={30}
      // />
      <Avatar className={cn(className, '')}>
        <AvatarImage className="object-cover" src={src} alt={alt || 'Avatar'} />
        <AvatarFallback>کاربر</AvatarFallback>
      </Avatar>
    )
  }
  return <UserCircle2Icon size={30} className="w-[30px] h-[30px]" />
}

export default UserAvatar
