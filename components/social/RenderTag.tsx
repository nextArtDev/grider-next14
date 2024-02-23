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
      <Badge
        variant={'secondary'}
        className="border bg-muted border-muted rounded-md border-none px-3 py-1.5 uppercase"
      >
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
