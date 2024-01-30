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
import {
  Billboard,
  Category,
  Contributor,
  Image,
  Product,
} from '@prisma/client'
import { useParams, usePathname, useRouter } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
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
import { createProductSchema } from '@/lib/schema/product'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { MultiSelect } from './MultiSelect'

type ProductFormValues = z.infer<typeof createProductSchema>

//if there is any billboard its Billboard, else its null
interface ProductFormProps {
  //there is a chance to have no initial data and in fact we're creating one.
  initialData:
    | (Product & {
        images: Image[]
      })
    | null
  categories: Category[]
  writers: Contributor[]
  translators: Contributor[]
  editors: Contributor[]
  illustrators: Contributor[]
  photographers: Contributor[]
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  writers,
  translators,
  editors,
  illustrators,
  photographers,
}) => {
  const params = useParams()
  const storeId = params.soreId
  const categoryId = initialData?.id
  const router = useRouter()
  const path = usePathname()

  // console.log({ writers, translators, editors, illustrators, photographers })
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState(
    initialData?.images?.[0].url ? initialData.images?.[0].url : ''
  )

  const [isPending, startTransition] = useTransition()

  const title = initialData ? 'ویرایش کتاب' : 'ایجاد کتاب'
  const description = initialData ? 'ویرایش کتاب.' : 'اضافه کردن کتاب جدید'
  const toastMessage = initialData ? 'کتاب آپدیت شد.' : 'کتاب ایجاد شد.'
  const action = initialData ? 'ذخیره تغییرات' : 'ایجاد'

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
          // description: initialData?.description || '',
          // image: initialData?.image?.url || '',
        }
      : {
          title: '',
          subtitle: '',
          images: [],
          price: 0,
          categoryId: '',
          translatorId: [],
          editorId: [],
          illustratorId: [],
          photographerId: [],
          writerId: [],
          isFeatured: false,
          isArchived: false,
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

  const onSubmit = async (data: ProductFormValues) => {
    console.log(data)
    // const formData = new FormData()

    // formData.append('image', data.image)
    // formData.append('name', data.name)
    // formData.append('billboardId', data.billboardId)
    // formData.append('description', data.description || '')

    try {
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
        //       } else if (res.errors?.billboardId) {
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
          // action={(data) => console.log(data.get('billboardId'))}
          onSubmit={form.handleSubmit(onSubmit)}
          // action={async (formData: FormData) => {
          //   console.log(formData.get('billboardId'))
          // }}
          className="grid grid-cols-2 lg:grid-cols-4 space-y-8 gap-x-4 w-full"
        >
          {!!files && (
            <div
              aria-disabled={isPending}
              // ratio={}
              className="col-span-2 lg:cols-span-4 relative mx-auto rounded-lg  h-40 w-[95%] max-w-xl "
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
            name="title"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>عنوان</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="عنوان کتاب"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isbn"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>شابک</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder=" شابک کتاب"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subTitle"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>عنوان دوم</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="عنوان دوم کتاب"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="originalTitle"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>عنوان زبان اصلی</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="عنوان کتاب در زبان اصلی آن"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>درباره کتاب</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isPending}
                    placeholder="درباره کتاب"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>قطع کتاب</FormLabel>
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
            name="pages"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>نام</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="تعداد صفحات"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>وزن</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder=" وزن کتاب"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cover"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>نوع جلد</FormLabel>
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
            name="publishDate"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>نام</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="تاریخ انتشار"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="edition"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>نوبت ویراست</FormLabel>
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
            name="summary"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>خلاصه کتاب</FormLabel>
                <FormControl>
                  <Textarea
                    disabled={isPending}
                    placeholder="خلاصه کتاب "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>قیمت</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="قیمت کتاب "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="writerId"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>نویسنده</FormLabel>

                <MultiSelect
                  selected={field.value}
                  options={writers.map((writer) => {
                    return { value: writer.id, label: writer.name }
                  })}
                  // onChange={console.log(form.getValues('writerId'))}

                  {...field}
                  // className="sm:w-[510px]"
                />

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="translatorId"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>مترجم</FormLabel>
                <MultiSelect
                  selected={field.value}
                  options={translators.map((translator) => {
                    return { value: translator.id, label: translator.name }
                  })}
                  // onChange={console.log(form.getValues('writerId'))}

                  {...field}
                  // className="sm:w-[510px]"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="editorId"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>ویراستار</FormLabel>
                <MultiSelect
                  selected={field.value}
                  options={editors.map((editor) => {
                    return { value: editor.id, label: editor.name }
                  })}
                  // onChange={console.log(form.getValues('writerId'))}

                  {...field}
                  // className="sm:w-[510px]"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="illustratorId"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>تصویرساز</FormLabel>
                <MultiSelect
                  selected={field.value}
                  options={illustrators.map((illustrator) => {
                    return { value: illustrator.id, label: illustrator.name }
                  })}
                  // onChange={console.log(form.getValues('writerId'))}

                  {...field}
                  // className="sm:w-[510px]"
                />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="photographerId"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>عکاس</FormLabel>
                <MultiSelect
                  selected={field.value}
                  options={photographers.map((photographer) => {
                    return { value: photographer.id, label: photographer.name }
                  })}
                  // onChange={console.log(form.getValues('writerId'))}

                  {...field}
                  // className="sm:w-[510px]"
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isFeatured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    // @ts-ignore
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1  leading-none">
                  <FormLabel className="pr-2">ویژه</FormLabel>
                  <FormDescription className="text-xs">
                    این محصول در صفحه اول نمایش داده شود.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isArchived"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    // @ts-ignore
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="pr-2">آرشیو شده</FormLabel>
                  <FormDescription className="text-xs">
                    این محصول از فروشگاه پنهان شود
                  </FormDescription>
                </div>
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
