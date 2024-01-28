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
import { Billboard, Category, Image as PrismaImage } from '@prisma/client'
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

// import ImageUpload from "@/components/ui/image-upload"
// import { toast } from '@/components/ui/use-toast'

// import ImageUpload from '@/components/ImageUpload'
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

type CategoryFormValues = z.infer<typeof createCategorySchema>

//if there is any billboard its Billboard, else its null
interface CategoryFormProps {
  //there is a chance to have no initial data and in fact we're creating one.
  initialData: (Partial<Category> & { image: { url: string } | null }) | null
  billboards: Billboard[]
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards,
}) => {
  // console.log(initialData?.image?.url)

  const params = useParams()
  const storeId = params.soreId
  const categoryId = initialData?.id

  const router = useRouter()
  const path = usePathname()

  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState(
    initialData?.imageId ? initialData.image?.url : ''
  )

  const [isPending, startTransition] = useTransition()

  // const [files, setFiles] = useState<File | null>(null)

  //Based on we get "new" or no billboard data, or we get billboardId as params we create or update billboard

  const title = initialData ? 'ویرایش دسته‌بندی' : 'ایجاد دسته‌بندی'
  const description = initialData
    ? 'ویرایش دسته‌بندی.'
    : 'اضافه کردن دسته‌بندی جدید'
  const toastMessage = initialData
    ? 'دسته‌بندی آپدیت شد.'
    : 'دسته‌بندی ایجاد شد.'
  const action = initialData ? 'ذخیره تغییرات' : 'ایجاد'

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          billboardId: initialData.billboardId,
          description: initialData?.description || '',
          image: initialData?.image?.url || '',
        }
      : {
          name: '',
          billboardId: '',
          description: '',
          // image: undefined,
        },
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

  const [editFormState, editAction] = useFormState(
    editCategory.bind(null, path, storeId as string, categoryId as string),
    {
      errors: {},
    }
  )
  const [deleteState, deleteAction] = useFormState(
    deleteCategory.bind(null, path, storeId as string, categoryId as string),
    {
      errors: {},
    }
  )

  // useEffect(() => {
  //   if (formState?.errors?.name) {
  //     form.setError('name', {
  //       type: 'custom',
  //       message: formState?.errors.name?.join(' و '),
  //     })
  //     form.setError('billboardId', {
  //       type: 'custom',
  //       message: formState?.errors.billboardId?.join(' و '),
  //     })
  //   } else if (formState?.errors?.image) {
  //     form.setError('image', {
  //       type: 'custom',
  //       message: formState?.errors.image?.join(' و '),
  //     })
  //   } else if (formState?.errors?._form) {
  //     toast.error(formState?.errors._form?.join(' و '))
  //     form.setError('root', {
  //       type: 'custom',
  //       message: formState?.errors?._form?.join(' و '),
  //     })
  //   }
  //   return () => form.clearErrors()
  // }, [form, formState])

  // useEffect(() => {
  //   if (editFormState?.errors?.name) {
  //     form.setError('name', {
  //       type: 'custom',
  //       message: editFormState?.errors.name?.join(' و '),
  //     })
  //     form.setError('billboardId', {
  //       type: 'custom',
  //       message: editFormState?.errors.billboardId?.join(' و '),
  //     })
  //   } else if (editFormState?.errors?.image) {
  //     form.setError('image', {
  //       type: 'custom',
  //       message: editFormState?.errors.image?.join(' و '),
  //     })
  //   } else if (editFormState?.errors?._form) {
  //     toast.error(editFormState?.errors._form?.join(' و '))
  //     form.setError('root', {
  //       type: 'custom',
  //       message: editFormState?.errors?._form?.join(' و '),
  //     })
  //   }
  //   return () => form.clearErrors()
  // }, [form, editFormState])

  const onSubmit = async (data: CategoryFormValues) => {
    const formData = new FormData()

    formData.append('image', data.image)
    formData.append('name', data.name)
    formData.append('billboardId', data.billboardId)
    formData.append('description', data.description || '')
    // console.log(data.image)

    try {
      if (initialData) {
        console.log({ data, initialData })
      } else {
        startTransition(() => {
          createCategory(formData, params.storeId as string, path)
            .then((res) => {
              if (res?.errors?.name) {
                form.setError('name', {
                  type: 'custom',
                  message: res?.errors.name?.join(' و '),
                })
                form.setError('billboardId', {
                  type: 'custom',
                  message: res?.errors.billboardId?.join(' و '),
                })
              } else if (res?.errors?.image) {
                form.setError('image', {
                  type: 'custom',
                  message: res?.errors.image?.join(' و '),
                })
              } else if (res?.errors?._form) {
                toast.error(res?.errors._form?.join(' و '))
                form.setError('root', {
                  type: 'custom',
                  message: res?.errors?._form?.join(' و '),
                })
              }
              // if (res?.success) {
              //    toast.success(toastMessage)
              // }
            })
            .catch(() => toast.error('مشکلی پیش آمده.'))
        })
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
        // loading={isPending}
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
      {/* <form id="my-form" action={uploadAction}>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files[0]
            const reader = new FileReader()
            reader.onload = (event) => {
              setImageSrc(event.target.result as string)
            }
            reader.readAsDataURL(file)
            if (submitButtonRef.current) {
              submitButtonRef.current.click()
            }
          }}
        />
        <img src={imageSrc} alt="Selected image" />
        <button
          id="submit-button"
          type="submit"
          style={{ display: 'none' }}
          ref={submitButtonRef}
        />
      </form> */}
      <Form {...form}>
        <form
          // action={initialData ? editAction : createAction}
          // action={(data) => console.log(data.get('billboardId'))}
          onSubmit={form.handleSubmit(onSubmit)}
          // action={async (formData: FormData) => {
          //   console.log(formData.get('billboardId'))
          // }}
          className="space-y-8 w-full"
        >
          {!!files && (
            <div
              // ratio={}
              className="relative mx-auto rounded-lg  h-40 w-[95%] max-w-xl "
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
                    placeholder="نام دسته‌بندی"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="billboardId"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>بیلبورد</FormLabel>
                <Select
                  dir="rtl"
                  disabled={isPending}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="یک بیلبورد را انتخاب کنید"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {billboards.map((billboard) => (
                      <SelectItem key={billboard.id} value={billboard.id}>
                        {billboard.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>توضیح دسته‌بندی (اختیاری)</FormLabel>
                <FormControl>
                  <Input
                    // disabled={loading}
                    placeholder="توضیحات"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isPending} className="ml-auto">
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
