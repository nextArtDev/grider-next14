import { MotionDiv } from '@/components/shared/MotionDiv'
import { ReactNode } from 'react'

export default function Template({ children }: { children: ReactNode }) {
  return (
    <MotionDiv
      className="overflow-hidden"
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', duration: 1 }}
    >
      {children}
    </MotionDiv>
  )
}
