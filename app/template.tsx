import { MotionDiv } from '@/components/shared/MotionDiv'
import { ReactNode } from 'react'

export default function Template({ children }: { children: ReactNode }) {
  return (
    <MotionDiv
      className=""
      initial={{ y: '-50%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', duration: 1 }}
    >
      <div>{children}</div>
    </MotionDiv>
  )
}
