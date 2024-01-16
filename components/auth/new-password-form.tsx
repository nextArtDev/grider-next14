'use client'

import * as z from 'zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { NewPasswordSchema } from '@/schemas'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Button } from '@/components/ui/button'
import { FormError } from './form-error'
import { FormSuccess } from './form-success'

import { register } from '@/actions/register'
import { useRouter } from 'next/navigation'
import { resetPass } from '@/actions/reset'
import { signIn } from '@/auth'

export const NewPasswordForm = ({ phone }: { phone: string }) => {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: '',
    },
  })

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      resetPass({ values, phone }).then((data) => {
        setError(data?.error)
        setSuccess(data?.success)
        if (data?.success) {
          // signIn('credentials', {
          //   redirect: false, // Do not redirect after signin
          //   phone,
          //   password: values.password,
          // }).then((data) => {
          //   router.push(`/`)
          // })
          router.push('/')
        }
      })
    })
  }

  return (
    <CardWrapper
      headerLabel="تغییر رمز عبور"
      backButtonLabel="برگشت به صفحه اصلی"
      backButtonHref="/"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رمز عبور جدید</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            تایید
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
