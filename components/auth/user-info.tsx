import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExtendedUser } from '@/types/next-auth'
import { ShieldCheck, ShieldX } from 'lucide-react'

interface UserInfoProps {
  user?: ExtendedUser
  label: string
}

export const UserInfo = ({ user, label }: UserInfoProps) => {
  return (
    <Card className="mb-auto w-full max-w-[600px] shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">{label}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">آیدی</p>
          <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
            {user?.id}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">نام</p>
          <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
            {user?.name}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">شماره</p>
          <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
            {user?.phone}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">رول</p>
          <p className="truncate text-xs max-w-[180px] font-mono p-1 bg-slate-100 rounded-md">
            {user?.role}
          </p>
        </div>

        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
          <p className="text-sm font-medium">تایید شماره</p>
          {/* <Badge variant={user?.isVerified ? 'default' : 'destructive'}> */}
          {user?.isVerified ? (
            <ShieldCheck className="text-green-500 w-10 h-10" />
          ) : (
            <ShieldX className="text-red-500 w-10 h-10" />
          )}
          {/* </Badge> */}
        </div>
      </CardContent>
    </Card>
  )
}
