'use client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ProfileSchema } from '@/lib/social-validations'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Textarea } from '../ui/textarea'
import { usePathname, useRouter } from 'next/navigation'
import { updateUser } from '@/lib/actions/user.action'

interface ProfileProps {
  userId: string
  user: string
}

const Profile: FC<ProfileProps> = ({ userId, user }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const parsedUser = JSON.parse(user)

  // 1. Define your form.
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: parsedUser.name || '',
      // password: parsedUser.password || '',
      portfolioWebsite: parsedUser.portfolioWebsite || '',
      location: parsedUser.location || '',
      bio: parsedUser.bio || '',
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    setIsSubmitting(true)
    try {
      await updateUser({
        userId,
        updateData: {
          name: values.name,
          // password: values.password,
          portfolioWebsite: values?.portfolioWebsite,
          location: values?.location,
          bio: values?.bio,
        },
        path: pathname,
      })
      router.back()
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
      // console.log(values)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-9 flex w-full gap-9 flex-col "
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>
                نام <span className="text-primary-500">*</span>{' '}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="نام"
                  {...field}
                  className="bg-slate-400 min-h-[56px] border placeholder:text-slate-800"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>
                رمز عبور<span className="text-primary-500">*</span>{' '}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="رمز عبور"
                  type="password"
                  {...field}
                  className="bg-slate-400 min-h-[56px] border  placeholder:text-slate-800"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        /> */}
        <FormField
          control={form.control}
          name="portfolioWebsite"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>وبسایت</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="وبسایت"
                  {...field}
                  className="bg-slate-400 min-h-[56px] border placeholder:text-slate-800"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>موقعیت</FormLabel>
              <FormControl>
                <Input
                  placeholder="آدرس"
                  {...field}
                  className="bg-slate-400 min-h-[56px] border placeholder:text-slate-800"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="space-y-3.5">
              <FormLabel>بیوگرافی</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="بیوگرافی"
                  {...field}
                  className="bg-slate-400 min-h-[56px] border placeholder:text-slate-800"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-7 flex justify-start">
          <Button disabled={isSubmitting} type="submit" className="w-full">
            {isSubmitting ? ' ذخیره...' : 'ذخیره'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default Profile
