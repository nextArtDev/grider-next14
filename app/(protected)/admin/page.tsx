'use client'

import { admin } from '@/actions/admin'
import { FormSuccess } from '@/components/auth/form-success'
import { RoleGate } from '@/components/auth/role-gate'
// import { admin } from "@/actions/admin";
// import { RoleGate } from "@/components/auth/role-gate";
// import { FormSuccess } from "@/components/form-success";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Role } from '@prisma/client'
import { toast } from 'sonner'

const AdminPage = () => {
  const onServerActionClick = () => {
    admin().then((data) => {
      if (data.error) {
        toast.error(data.error)
      }
      if (data.success) {
        toast.success(data.success)
      }
    })
  }

  return (
    <Card className="mb-auto w-full max-w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">🔑 Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={Role.ADMIN}>
          <FormSuccess message="You are allowed to see this content!" />
        </RoleGate>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">تنها ادمین مجاز است</p>
          <Button onClick={onServerActionClick}>ادمین هستم</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AdminPage
