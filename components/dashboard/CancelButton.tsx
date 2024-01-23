// 'use client'

// import { ReactNode } from 'react'
// import { Button, ButtonProps } from '../ui/button'
// import { Loader2 } from 'lucide-react'
// import { useFormStatus } from 'react-dom'

// interface CancelButtonProps extends ButtonProps {
//   children: ReactNode
//   className?: string
//   onClose?:()=>boolean
// }
// export const CancelButton = ({
//   children,
//   className,
//   variant,
//   onClick,
//   onClose
// }: CancelButtonProps) => {
//   const { pending } = useFormStatus()
//   return (
//     <Button
//       onClick={onClose=>false}
//       variant={variant}
//       className={className}
//       disabled={pending}
//     >
//       {children}
//     </Button>
//   )
// }
