import { buttonVariants } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'

import Link from 'next/link'

export const useCustomToasts = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: 'وارد حساب کاربری خود شوید.',
      description:
        'شما برای انجام این عملیات باید عضو شده و وارد حساب کاربری شوید.',
      variant: 'destructive',
      action: (
        <Link
          onClick={() => dismiss()}
          href="/login"
          className={cn(buttonVariants({ variant: 'default' }))}
        >
          ورود/عضویت
        </Link>
      ),
    })
  }

  return { loginToast }
}
