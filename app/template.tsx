import { MotionDiv } from '@/components/shared/MotionDiv'
import { ReactNode } from 'react'

export default function Template({ children }: { children: ReactNode }) {
  return (
    <MotionDiv
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', duration: 1 }}
    >
      {children}
    </MotionDiv>
  )
}
