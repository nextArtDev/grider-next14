'use client'

import React, {
  startTransition,
  useEffect,
  useState,
  useTransition,
} from 'react'
import { useForm, Controller, SubmitHandler } from 'react-hook-form'

import { activation } from '@/actions/register'
import { useParams, useRouter } from 'next/navigation'
import { FormError } from '@/components/auth/form-error'
import { FormSuccess } from '@/components/auth/form-success'
import { sendSms } from '@/actions/sms'
import OtpInput from '../../../../../components/auth/otp-input'
import { Button } from '@/components/ui/button'
import { reactivate } from '@/actions/reactivate'

type FormData = {
  otp: string
}

export default function OtpForm({ params }: { params: { phone: string } }) {
  const router = useRouter()
  // console.log(params.phone)
  const [sentSms, setSentSms] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | undefined>('')
  const [success, setSuccess] = useState<string | undefined>('')
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      otp: '',
    },
  })
  // useEffect(() => {
  //   const sendReactiveSms = async () => {
  //     const Sms = await sendSms({ phone: params.phone })
  //     console.log(Sms)
  //   }
  //   sendReactiveSms()
  // }, [params.phone])

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setError('')
    setSuccess('')

    // setError(res?.error)
    // setSuccess(res?.success)
    startTransition(() => {
      activation({ phone: params.phone, verificationCode: data.otp }).then(
        (res) => {
          setError(res.error)
          setSuccess(res.success)
          if (res.success) {
            router.push(`/new-password/${params.phone}`)
          }
          if (res.error) {
            // router.push('/new-password')
            reset()
          }
        }
      )
    })

    // console.log(data) // Handle form submission
    // const res = await activation({ id: userID, verificationCode: data.otp })
    // console.log(res)
  }
  const smsSend = async () => {
    setError('')
    setSuccess('')

    // setError(res?.error)
    // setSuccess(res?.success)
    startTransition(() => {
      reactivate({ phone: params.phone }).then((res) => {
        setError(res.error)
        setSuccess(res.success)
        if (res.success) {
          setSentSms(true)
        }
      })
    })

    // console.log(data) // Handle form submission
    // const res = await activation({ id: userID, verificationCode: data.otp })
    // console.log(res)
  }

  // Function to trigger form submission programmatically
  const handleComplete = () => {
    handleSubmit(onSubmit)() // Invoke the submit handler
  }

  return (
    <>
      <form dir="ltr" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="otp"
          render={({ field: { onChange, value } }) => (
            <OtpInput
              disabled={isPending}
              value={value}
              valueLength={6}
              onChange={onChange}
              onComplete={handleComplete} // Pass the handleComplete function
            />
          )}
        />
        <FormError message={error} />
        <FormSuccess message={success} />
      </form>
    </>
  )
}
