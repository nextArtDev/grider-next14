'use client'

import * as z from 'zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { ResetSchema } from '@/schemas'
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
import { reset } from '@/actions/reset'

export const ResetForm = () => {
  const router = useRouter()
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      phone: '',
    },
  })

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError('')
    setSuccess('')

    startTransition(() => {
      reset(values).then((data) => {
        setError(data?.error)
        setSuccess(data?.success)
        if (data?.success) {
          router.push(`/otp/${values.phone}/reset`)
        }
      })
    })
  }

  return (
    <CardWrapper
      headerLabel="ایجاد حساب"
      backButtonLabel="قبلا حساب ایجاد کرده‌اید؟"
      backButtonHref="/login"
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
                  <FormLabel>موبایل</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="0900000000"
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    کد تایید به این شماره ارسال خواهد شد.
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
            ارسال کد تایید
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
