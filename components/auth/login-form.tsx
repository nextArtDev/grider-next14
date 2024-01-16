'use client'

import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'

import { LoginSchema } from '@/schemas'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { Button } from '@/components/ui/button'
import { FormError } from './form-error'
import { FormSuccess } from './form-success'

import { login } from '@/actions/login'

export const LoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')
  const urlError =
    searchParams.get('error') === 'OAuthAccountNotLinked'
      ? 'Email already in use with different provider!'
      : ''

  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [activation, setActivation] = useState<boolean | undefined>(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      phone: '',
      password: '',
    },
  })

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (
            data?.error ===
            'شما اکانت خود را از طریق کد ارسال شده فعال نکرده‌اید.'
          ) {
            setError(data.error)
            setActivation(true)
          } else if (data?.error) {
            // form.reset()
            setError(data.error)
          }
          // form.reset()
          // router.push('/')

          // if (data?.success) {
          //   setSuccess(data.success)
          // }
          //     if (data?.twoFactor) {
          //       setShowTwoFactor(true)
          //     }
        })
        .catch(() => setError('Something went wrong'))
    })
  }

  return (
    <CardWrapper
      headerLabel="خوش آمدید"
      backButtonLabel="هنوز اکانت نساخته‌اید؟"
      backButtonHref="/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>شماره موبایل</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="09000000000"
                      type="string"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رمز عبور</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="******"
                      type="password"
                    />
                  </FormControl>
                  <Button
                    size="sm"
                    variant="link"
                    asChild
                    className="px-0 font-normal"
                  >
                    <Link href="/reset">رمز عبور را فراموش کرده‌اید؟</Link>
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          {activation ? (
            <Button variant={'destructive'} className="w-full">
              <Link href={`/otp/${form.getValues('phone')}/reactive`}>
                فعالسازی اکانت
              </Link>
            </Button>
          ) : (
            <Button disabled={isPending} type="submit" className="w-full">
              {showTwoFactor ? 'تایید' : 'ورود'}
            </Button>
          )}
        </form>
      </Form>
    </CardWrapper>
  )
}
