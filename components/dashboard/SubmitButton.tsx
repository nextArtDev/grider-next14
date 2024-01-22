'use client'

import { ReactNode } from 'react'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'

interface SubmitButtonProps {
  children: ReactNode
  className?: string
}
export const SubmitButton = ({ children, className }: SubmitButtonProps) => {
  const { pending } = useFormStatus()
  return (
    <Button className={className} disabled={pending} type="submit">
      {pending ? <Loader2 className="animate-spin" /> : children}
    </Button>
  )
}
