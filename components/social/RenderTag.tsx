import Link from 'next/link'
import { FC } from 'react'
import { Badge } from '../ui/badge'

interface RenderTagProps {
  id: string | string
  name: string
  totalQuestions?: number
  showCount?: boolean
}

const RenderTag: FC<RenderTagProps> = ({
  id,
  name,
  totalQuestions,
  showCount,
}) => {
  return (
    <Link href={`/social/tags/${id}`} className="flex items-center gap-2 ">
      <Badge className="rounded-md border-none px-4 py-2 uppercase">
        {name}
      </Badge>
      {showCount && (
        <p className="ml-32 mr-auto text-secondary-foreground/70">
          {totalQuestions}
        </p>
      )}
    </Link>
  )
}

export default RenderTag
