'use client'

import * as z from 'zod'
// import axios from 'axios'
import {
  startTransition,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Loader, Trash, UploadCloud } from 'lucide-react'
import { Billboard, Category, Contributor } from '@prisma/client'
import { useParams, usePathname, useRouter } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { Separator } from '@/components/ui/separator'

import { AlertModal } from '@/components/dashboard/modals/alert-modal'
import { Heading } from '@/components/dashboard/Heading'
import { cn } from '@/lib/utils'

import NextImage from 'next/image'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'

import { SubmitButton } from '@/components/dashboard/SubmitButton'
import { createCategorySchema } from '@/lib/schema/category'
import {
  createCategory,
  deleteCategory,
  editCategory,
  upImage,
} from '@/lib/actions/dashboard/category'
import { Switch } from '@/components/ui/switch'
import { contributor } from '@/lib/constants'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createContributeSchema } from '@/lib/schema/contribute'

type ContributeFormValues = z.infer<typeof createContributeSchema>

//if there is any billboard its Billboard, else its null
interface ContributeFormProps {
  //there is a chance to have no initial data and in fact we're creating one.
  initialData: (Partial<Contributor> & { image: { url: string } | null }) | null
}

export const ContributeForm: React.FC<ContributeFormProps> = ({
  initialData,
}) => {
  const params = useParams()
  const storeId = params.soreId
  const categoryId = initialData?.id
  // console.log(params.storeId)
  const router = useRouter()
  const path = usePathname()

  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState(
    initialData?.imageId ? initialData.image?.url : ''
  )

  const [isPending, startTransition] = useTransition()

  const title = initialData ? 'ویرایش فعال' : 'ایجاد فعال'
  const description = initialData ? 'ویرایش فعال.' : 'اضافه کردن فعال جدید'
  const toastMessage = initialData ? 'فعال آپدیت شد.' : 'فعال ایجاد شد.'
  const action = initialData ? 'ذخیره تغییرات' : 'ایجاد'

  const form = useForm<ContributeFormValues>({
    resolver: zodResolver(createCategorySchema),
    // defaultValues: initialData || { contributors: [] },
    defaultValues: { name: '', bio: '', contributors: [] },
    // ? {
    //     name: initialData.name,
    //     bio: initialData.bio,
    //     description: initialData?.description || '',
    //     image: initialData?.image?.url || '',
    //   }
    // : {
    //     name: '',
    //     billboardId: '',
    //     description: '',
    //     // image: undefined,
    //   },
  })
  // const [formState, createAction] = useFormState(
  //   createCategory.bind(null, path, storeId as string),
  //   {
  //     errors: {},
  //   }
  // )
  // const [imageFormState, uploadAction] = useFormState(upImage, {
  //   errors: {},
  //   success: '',
  // })

  // const [editFormState, editAction] = useFormState(
  //   editCategory.bind(null, path, storeId as string, categoryId as string),
  //   {
  //     errors: {},
  //   }
  // )
  const [deleteState, deleteAction] = useFormState(
    deleteCategory.bind(
      null,
      path,
      params.storeId as string,
      categoryId as string
    ),
    {
      errors: {},
    }
  )

  const onSubmit = async (data: ContributeFormValues) => {
    console.log('45')
    // const formData = new FormData()

    // formData.append('image', data.image)
    // // formData.append('name', data.name)
    // // formData.append('bio', data.bio || '')
    // contributor.map((contribute, i) => {
    //   formData.append(`${contribute.value}`, data.contributors[i] || '')
    // })

    try {
      console.log(data)
      if (initialData) {
        // console.log({ data, initialData })
        // startTransition(() => {
        //   editCategory(
        //     formData,
        //     params.storeId as string,
        //     initialData.id as string,
        //     path
        //   )
        //     .then((res) => {
        //       if (res?.errors?.name) {
        //         form.setError('name', {
        //           type: 'custom',
        //           message: res?.errors.name?.join(' و '),
        //         })
        //         form.setError('billboardId', {
        //           type: 'custom',
        //           message: res?.errors.billboardId?.join(' و '),
        //         })
        //       } else if (res?.errors?.image) {
        //         form.setError('image', {
        //           type: 'custom',
        //           message: res?.errors.image?.join(' و '),
        //         })
        //       } else if (res?.errors?._form) {
        //         toast.error(res?.errors._form?.join(' و '))
        //         form.setError('root', {
        //           type: 'custom',
        //           message: res?.errors?._form?.join(' و '),
        //         })
        //       }
        //       // if (res?.success) {
        //       //    toast.success(toastMessage)
        //       // }
        //     })
        //     .catch(() => toast.error('مشکلی پیش آمده.'))
        // })
      } else {
        // startTransition(() => {
        //   createCategory(formData, params.storeId as string, path)
        //     .then((res) => {
        //       if (res?.errors?.name) {
        //         form.setError('name', {
        //           type: 'custom',
        //           message: res?.errors.name?.join(' و '),
        //         })
        //         form.setError('billboardId', {
        //           type: 'custom',
        //           message: res?.errors.billboardId?.join(' و '),
        //         })
        //       } else if (res?.errors?.image) {
        //         form.setError('image', {
        //           type: 'custom',
        //           message: res?.errors.image?.join(' و '),
        //         })
        //       } else if (res?.errors?._form) {
        //         toast.error(res?.errors._form?.join(' و '))
        //         form.setError('root', {
        //           type: 'custom',
        //           message: res?.errors?._form?.join(' و '),
        //         })
        //       }
        //       // if (res?.success) {
        //       //    toast.success(toastMessage)
        //       // }
        //     })
        //     .catch(() => toast.error('مشکلی پیش آمده.'))
        // })
      }
    } catch {
      toast.error('مشکلی پیش آمده، لطفا دوباره امتحان کنید!')
    }
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteAction}
        isPending={isPending}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {/* in case there is initial data it means we want to edit it */}
        {initialData && (
          <Button
            disabled={isPending}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />

      <Form {...form}>
        <form
          // action={initialData ? editAction : createAction}
          // action={async (data) => console.log(data.getAll('name'))}
          onSubmit={form.handleSubmit(onSubmit)}
          // action={(formData: FormData) => {
          //   console.log(formData.get('image'))
          // }}
          className="space-y-8 w-full"
        >
          {!!files && (
            <div
              aria-disabled={isPending}
              // ratio={}
              className="relative mx-auto h-40 w-40 rounded-full max-w-xl "
            >
              <NextImage
                alt="category-pic"
                src={files}
                // src={initialData?.image?.url}
                // src={URL.createObjectURL(files)}
                fill
                className="object-cover rounded-lg"
              />
              <Trash
                className={cn(
                  buttonVariants({ variant: 'destructive', size: 'sm' }),
                  'absolute -top-1 -left-1 w-10 h-10 cursor-pointer '
                )}
                onClick={() => {
                  form.reset({ ...form.getValues(), image: null })

                  setFiles('')
                }}
              />
            </div>
          )}
          <label
            htmlFor="image"
            className={cn(
              'max-w-md mx-auto cursor-pointer bg-transparent rounded-xl flex flex-col justify-center gap-4 items-center border-2 border-black/20 dark:border-white/20 border-dashed w-full h-24 shadow ',
              !!files ? 'hidden' : ''
            )}
          >
            <span
              className={cn(
                buttonVariants({ variant: 'ghost' }),

                'flex flex-col items-center justify-center gap-2 h-64 w-full'
              )}
            >
              <UploadCloud />
              انتخاب عکس
            </span>
          </label>
          <input
            // formAction={}

            name="image"
            id="image"
            className="hidden"
            type="file"
            onChange={(e) => {
              const file = e.target.files ? e.target.files[0] : null
              if (file) {
                form.setValue('image', file)
                setFiles(URL.createObjectURL(file))
              }
            }}
          />

          <FormMessage>
            {form.getFieldState('image')?.error?.message}
          </FormMessage>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>نام</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="نام و نام‌خانوادگی"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-8">
            <FormField
              control={form.control}
              name="contributors"
              render={({ field }) => (
                <FormItem className="max-w-md ">
                  {contributor.map((contribute) => (
                    <FormControl
                      key={contribute.value}
                      className="grid grid-cols-4"
                    >
                      <Label
                        htmlFor={contribute.value}
                        className="cursor-pointer flex justify-start items-center gap-4 "
                      >
                        <span>{contribute.label}</span>
                        <Switch
                          id={contribute.value}
                          dir="ltr"
                          // checked={form.setValue('contributors', [
                          //   ...field.value,
                          //   contribute.value,
                          // ])}
                          checked={field.value.includes(contribute.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              form.setValue('contributors', [
                                ...field.value,
                                contribute.value,
                              ])
                              // console.log(form.getValues('contributors'))
                            } else {
                              form.setValue(
                                'contributors',
                                field.value.filter(
                                  (v) => v !== contribute.value
                                )
                              )

                              // console.log(form.getValues('contributors'))
                            }
                          }}
                        />
                      </Label>
                    </FormControl>
                  ))}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>بیوگرافی</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isPending}
                    placeholder="درباره زندگی و فعالیت‌ها..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending} className="ml-auto">
            {isPending ? (
              <Loader className="animate-spin w-full h-full " />
            ) : (
              action
            )}
          </Button>
        </form>
      </Form>
    </>
  )
}
