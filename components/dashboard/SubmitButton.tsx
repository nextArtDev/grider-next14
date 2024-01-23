'use client'

import { ReactNode } from 'react'
import { Button, ButtonProps } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { useFormStatus } from 'react-dom'

interface SubmitButtonProps extends ButtonProps {
  children: ReactNode
  className?: string
}
export const SubmitButton = ({
  children,
  className,
  variant,
}: SubmitButtonProps) => {
  const { pending } = useFormStatus()
  return (
    <Button
      variant={variant}
      className={className}
      disabled={pending}
      type="submit"
    >
      {pending ? <Loader2 className="animate-spin" /> : children}
    </Button>
  )
}
