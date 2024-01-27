'use client'

import * as z from 'zod'
// import axios from 'axios'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Trash, UploadCloud } from 'lucide-react'
import { Billboard, Category, Image } from '@prisma/client'
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
} from '@/lib/actions/dashboard/category'

type CategoryFormValues = z.infer<typeof createCategorySchema>

//if there is any billboard its Billboard, else its null
interface CategoryFormProps {
  //there is a chance to have no initial data and in fact we're creating one.
  initialData: (Category & { image: Partial<Image> | null }) | null
  billboards: Billboard[]
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  billboards,
}) => {
  const params = useParams()
  const { storeId } = params
  const categoryId = initialData?.id

  const router = useRouter()
  const path = usePathname()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState('')
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
    defaultValues: {
      name: '',
      billboardId: '',
      description: '',
      // image: undefined,
    },
  })
  const [formState, createAction] = useFormState(
    createCategory.bind(null, path, storeId as string),
    {
      errors: {},
    }
  )
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

  useEffect(() => {
    if (formState?.errors?.name) {
      form.setError('name', {
        type: 'custom',
        message: formState?.errors.name?.join(' و '),
      })
      form.setError('billboardId', {
        type: 'custom',
        message: formState?.errors.billboardId?.join(' و '),
      })
    } else if (formState?.errors?.image) {
      form.setError('image', {
        type: 'custom',
        message: formState?.errors.image?.join(' و '),
      })
    } else if (formState?.errors?._form) {
      toast.error(formState?.errors._form?.join(' و '))
      form.setError('root', {
        type: 'custom',
        message: formState?.errors?._form?.join(' و '),
      })
    }
    return () => form.clearErrors()
  }, [form, formState])

  useEffect(() => {
    if (editFormState?.errors?.name) {
      form.setError('name', {
        type: 'custom',
        message: editFormState?.errors.name?.join(' و '),
      })
      form.setError('billboardId', {
        type: 'custom',
        message: editFormState?.errors.billboardId?.join(' و '),
      })
    } else if (editFormState?.errors?.image) {
      form.setError('image', {
        type: 'custom',
        message: editFormState?.errors.image?.join(' و '),
      })
    } else if (editFormState?.errors?._form) {
      toast.error(editFormState?.errors._form?.join(' و '))
      form.setError('root', {
        type: 'custom',
        message: editFormState?.errors?._form?.join(' و '),
      })
    }
    return () => form.clearErrors()
  }, [form, editFormState])

  const onSubmit = async (data: any) => {
    console.log(data)
  }

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={deleteAction}
        // loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {/* in case there is initial data it means we want to edit it */}
        {initialData && (
          <Button
            disabled={loading}
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
          action={(data) => console.log(data.get('image'))}
          // onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          {files && (
            <div
              // ratio={}
              className="relative mx-auto rounded-lg  h-40 w-[95%] max-w-xl "
            >
              <NextImage
                alt="category-pic"
                // src={initialData?.image ? initialData?.image?.url : files}
                src={files}
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
              files.length > 0 ? 'hidden' : ''
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
            name="image"
            id="image"
            className="hidden"
            type="file"
            onChange={(e) => {
              const file = e.target.files ? e.target.files[0] : null
              if (file) {
                form.setValue('image', URL.createObjectURL(file))
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
                    disabled={loading}
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
                  disabled={loading}
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

          <SubmitButton className="ml-auto">{action}</SubmitButton>
        </form>
      </Form>
    </>
  )
}
