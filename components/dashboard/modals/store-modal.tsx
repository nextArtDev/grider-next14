'use client'

import * as z from 'zod'
// import axios, { AxiosError } from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { ErrorOption, useForm } from 'react-hook-form'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'

import { useAppSelector } from '@/redux/store'
import { AppDispatch } from '@/redux/store'
import { useDispatch } from 'react-redux'

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
// import { useStoreModal } from '@/hooks/use-store-modal'
import { Button } from '@/components/ui/button'
import { Modal } from '../modal'
import { onClose } from '@/redux/slices/modalSlice'
// import { useMutation } from '@tanstack/react-query'
// import { toast } from '../ui/use-toast'
import { useCustomToasts } from '@/hooks/use-custom-toasts'
import { createStoreSchema } from '@/lib/schema/store'
import { useFormState, useFormStatus } from 'react-dom'
import { createStore } from '@/lib/actions/dashboard/store'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { SubmitButton } from '../SubmitButton'

// const createStoreSchema = z.object({
//   name: z.string().min(1, { message: 'نام فروشگاه باید بیش از یک حرف باشد.' }),
// })

export const StoreModal = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { isOpen } = useAppSelector((state) => state.modalReducer)

  //   const storeModal = useStoreModal()
  const router = useRouter()
  const pathname = usePathname()
  const { loginToast } = useCustomToasts()

  const form = useForm<z.infer<typeof createStoreSchema>>({
    resolver: zodResolver(createStoreSchema),
    defaultValues: {
      name: '',
    },
  })
  // const { pending } = useFormStatus()

  const [formState, action] = useFormState(createStore.bind(null, pathname), {
    errors: {},
  })

  useEffect(() => {
    if (formState.errors?.name) {
      form.setError('name', {
        type: 'custom',
        message: formState.errors.name?.join(' و'),
      })
    } else if (formState.errors?._form) {
      toast.error(formState.errors._form?.join(' و'))
      form.setError('root', {
        type: 'custom',
        message: formState.errors?._form?.join(' و'),
      })
    }
    return () => form.clearErrors()
  }, [form, formState])
  // console.log()
  // console.log(formState.errors.name)
  // console.log(form.formState.errors)
  // if (formState.errors?.name) {
  //   form.formState.errors.name?.message === formState.errors.name.join(' و')
  //   // form.formState.errors=formState.errors
  // }
  // useEffect(() => {
  //   if (formState.errors) {
  //     // form.formState.errors.name?.message === formState.errors.name?.join(' و')
  //     form.setError('name', {
  //       type: 'custom',
  //       message: formState.errors.name?.join(' و'),
  //     })
  //     // form.formState.errors=formState.errors
  //   }
  //   return () => form.clearErrors()
  // }, [form, formState.errors])
  // if (formState.errors?.name) {
  //   form.setError('root', {
  //     type: 'custom',
  //     // message: formState.errors.name,
  //     message: 'نام مجاز نیست!',
  //   })
  //   // form.formState.errors=formState.errors
  // }

  //React Query

  // const { mutate: createStore, isLoading } = useMutation({
  //   mutationFn: async ({ name }: z.infer<typeof createStoreSchema>) => {
  //     const payload: z.infer<typeof createStoreSchema> = { name }
  //     const { data } = await axios.post('/api/stores', payload)
  //     return data
  //   },
  //   onError: (err) => {
  //     if (err instanceof AxiosError) {
  //       if (err.response?.status === 403) {
  //         return loginToast()
  //       }
  //     }
  //     return toast({
  //       title: 'مشکلی پیش آمده.',
  //       description: 'لطفا بعدا امتحان کنید.',
  //       variant: 'destructive',
  //     })
  //   },
  //   onSuccess: (data) => {
  //     window.location.assign(`/${data.id}`)
  //     return toast({
  //       title: 'فروشگاه اضافه شد.',
  //       // description: '',
  //       variant: 'default',
  //     })
  //   },
  // })
  const onSubmit = async (data: z.infer<typeof createStoreSchema>) => {
    // const payload: z.infer<typeof createStoreSchema> = {
    //   name: data.name,
    // }
    // if (formState.errors.name) {
    //   // form.formState.errors.name?.message === formState.errors.name?.join(' و')
    //   form.setError('name', {
    //     type: 'custom',
    //     message: formState.errors.name?.join(' و'),
    //   })
    // }
    // createStore(payload)
  }

  return (
    <Modal
      title="ایجاد فروشگاه"
      description="فروشگاه جدیدی ایجاد کنید."
      isOpen={isOpen}
      onClose={() => dispatch(onClose())}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Form {...form}>
              <form action={action}>
                {/* <form onSubmit={form.handleSubmit(onSubmit)}> */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نام فروشگاه</FormLabel>
                      <FormControl>
                        <Input
                          disabled={form.formState.isLoading}
                          placeholder="مثلا: کتاب فروشی فردا"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage
                      // resource={formState.errors.name?.join(' و')}
                      // content={formState.errors.name?.join(' و')}
                      // title={formState.errors.name?.join(' و')}
                      />
                      {/* <FormMessage>
                        {formState.errors.name?.join(' و ')}
                      </FormMessage> */}
                    </FormItem>
                  )}
                />
                {/* <FormMessage>{formState.errors._form?.join(' و ')}</FormMessage> */}
                {/* {formState.errors._form
                  ? // <div className="rounded p-2 bg-red-200 border border-red-400">
                    //   {formState.errors._form?.join(', ')}
                    // </div>
                    toast.error(formState.errors._form?.join(' و'))
                  : null} */}

                <div className="pt-6 space-x-2 gap-2 flex items-center justify-start w-full">
                  {/* <Button disabled={pending} type="submit">
                    {pending ? <Loader2 className="animate-spin" /> : 'تایید'}
                  </Button> */}
                  <SubmitButton>{'تایید'}</SubmitButton>
                  <Button
                    // disabled={pending}
                    disabled={form.formState.isLoading}
                    variant="outline"
                    onClick={() => dispatch(onClose())}
                  >
                    انصراف
                  </Button>
                  {/* {form.formState.isLoading} */}
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  )
}
