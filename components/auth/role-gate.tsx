'use client'

import { Role } from '@prisma/client'

import { useCurrentRole } from '@/hooks/use-current-role'
import { FormError } from './form-error'

interface RoleGateProps {
  children: React.ReactNode
  allowedRole: Role
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const role = useCurrentRole()

  if (role !== allowedRole) {
    return <FormError message="شما اجازه دسترسی به این صفحه را ندارید!" />
  }

  return <>{children}</>
}
