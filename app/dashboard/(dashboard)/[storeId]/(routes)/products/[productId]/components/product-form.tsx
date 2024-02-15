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

import { CalendarIcon, Loader, Trash, UploadCloud } from 'lucide-react'
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
import { AspectRatio } from '@/components/ui/aspect-ratio'
import ImageSlider from '@/components/dashboard/ImageSlider'
import { covers, sizes } from '@/lib/constants'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns-jalali'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import { primaryFont } from '@/lib/fonts'
import {
  createProduct,
  deleteProduct,
  editProduct,
} from '@/lib/actions/dashboard/products'

type ProductFormValues = z.infer<typeof createProductSchema>

//if there is any billboard its Billboard, else its null
interface ProductFormProps {
  //there is a chance to have no initial data and in fact we're creating one.
  initialData:
    | (Product & { images: { url: string }[] } & {
        translator: { id: string }[]
      } & {
        category: { id: string }
      } & {
        illustrator: { id: string }[]
      } & { photographer: { id: string }[] } & {
        writer: { id: string }[]
      } & { editor: { id: string }[] })
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
  // const [files, setFiles] = useState(
  //   initialData?.images?.[0].url ? initialData.images?.[0].url : ''
  // )
  const [files, setFiles] = useState<File[]>([])
  const [isPending, startTransition] = useTransition()

  const title = initialData ? 'ویرایش کتاب' : 'ایجاد کتاب'
  const description = initialData ? 'ویرایش کتاب.' : 'اضافه کردن کتاب جدید'
  const toastMessage = initialData ? 'کتاب آپدیت شد.' : 'کتاب ایجاد شد.'
  const action = initialData ? 'ذخیره تغییرات' : 'ایجاد'

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: initialData
      ? {
          // ...initialData,
          isbn: initialData.isbn || '',
          title: initialData.title,
          subTitle: initialData.subTitle || '',
          originalTitle: initialData.originalTitle || '',
          description: initialData.description || '',
          size: initialData.size || '',
          pages: initialData.pages || '',
          weight: initialData.weight || '',
          cover: initialData.cover || '',
          // publishDate: initialData.publishDate || '' || undefined,
          edition: initialData.edition || '',
          summary: initialData.summary || '',
          categoryId: initialData.categoryId,
          price: parseFloat(String(initialData?.price)),
          // price:+ initialData.price || 0 ,

          // images:initialData.images.map(image=>image.url)|| [],
          translatorId:
            initialData.translator.map((t: { id: string }) => t.id) || [],
          editorId: initialData.editor.map((e: { id: string }) => e.id) || [],
          illustratorId:
            initialData.illustrator.map((i: { id: string }) => i.id) || [],
          photographerId:
            initialData.photographer.map((p: { id: string }) => p.id) || [],
          writerId: initialData.writer.map((w: { id: string }) => w.id) || [],
          isArchived: initialData.isArchived,
          isFeatured: initialData.isFeatured,

          // description: initialData?.description || '',
          // image: initialData?.image?.url || '',
        }
      : {
          title: '',
          subTitle: '',
          // images: [],
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
    deleteProduct.bind(
      null,
      path,
      params.storeId as string,
      params.productId as string
    ),
    {
      errors: {},
    }
  )

  const onSubmit = async (data: ProductFormValues) => {
    // console.log(data)
    const formData = new FormData()

    // formData.append('image', data.image)
    // formData.append('name', data.name)
    // formData.append('billboardId', data.billboardId)
    // formData.append('description', data.description || '')
    formData.append('isbn', data.isbn || '')
    formData.append('title', data.title)
    formData.append('subTitle', data.subTitle || '')
    formData.append('originalTitle', data.originalTitle || '')
    formData.append('description', data.description || '')
    formData.append('size', data.size || '')
    formData.append('pages', data.pages || '')
    formData.append('weight', data.weight || '')
    formData.append('cover', data.cover || '')
    if (data.publishDate) {
      formData.append('publishDate', data.publishDate.toISOString())
    }
    formData.append('edition', data.edition || '')
    formData.append('summary', data.summary || '')

    formData.append('price', String(data.price))

    if (data.writerId && data.writerId.length > 0) {
      for (let writers of data.writerId) {
        formData.append('writerId', writers)
      }
    }
    if (data.translatorId && data.translatorId.length > 0) {
      for (let translators of data.translatorId) {
        formData.append('translatorId', translators)
      }
    }

    if (data.editorId && data.editorId.length > 0) {
      for (let editors of data.editorId) {
        formData.append('editorId', editors)
      }
    }
    if (data.illustratorId && data.illustratorId.length > 0) {
      for (let illustrators of data.illustratorId) {
        formData.append('illustratorId', illustrators)
      }
    }
    if (data.photographerId && data.photographerId.length > 0) {
      for (let photographers of data.photographerId) {
        formData.append('photographerId', photographers)
      }
    }
    formData.append('categoryId', data.categoryId)
    // console.log(formData.get('categoryId'))

    if (data.image && data.image.length > 0) {
      for (let i = 0; i < data.image.length; i++) {
        formData.append('image', data.image[i])
      }
    }
    // formData.append('image', data.image)
    // if (data.isFeatured) {
    //   formData.append('isFeatured', data.isFeatured)
    // }
    if (data.isArchived) {
      formData.append('isArchived', 'true')
    } else {
      formData.append('isArchived', 'false')
    }
    if (data.isFeatured) {
      formData.append('isFeatured', 'true')
    } else {
      formData.append('isFeatured', 'false')
    }

    try {
      if (initialData) {
        // console.log({ data, initialData })
        startTransition(() => {
          editProduct(
            formData,
            params.storeId as string,
            initialData.id as string,
            path
          )
            .then((res) => {
              // if (res?.errors?._form) {
              //   toast.error(res?.errors._form?.join(' و '))
              //   form.setError('root', {
              //     type: 'custom',
              //     message: res?.errors?._form?.join(' و '),
              //   })
              // }
              if (res?.errors?.isbn) {
                form.setError('isbn', {
                  type: 'custom',
                  message: res?.errors.isbn?.join(' و '),
                })
              } else if (res?.errors?.title) {
                form.setError('title', {
                  type: 'custom',
                  message: res?.errors.title?.join(' و '),
                })
              } else if (res?.errors?.subTitle) {
                form.setError('subTitle', {
                  type: 'custom',
                  message: res?.errors?.subTitle?.join(' و '),
                })
              }
              if (res?.errors?.originalTitle) {
                form.setError('originalTitle', {
                  type: 'custom',
                  message: res?.errors.originalTitle?.join(' و '),
                })
              } else if (res?.errors?.description) {
                form.setError('description', {
                  type: 'custom',
                  message: res?.errors.description?.join(' و '),
                })
              } else if (res?.errors?.size) {
                form.setError('size', {
                  type: 'custom',
                  message: res?.errors?.size?.join(' و '),
                })
              }
              if (res?.errors?.pages) {
                form.setError('pages', {
                  type: 'custom',
                  message: res?.errors.pages?.join(' و '),
                })
              } else if (res?.errors?.weight) {
                form.setError('weight', {
                  type: 'custom',
                  message: res?.errors.weight?.join(' و '),
                })
              } else if (res?.errors?.cover) {
                form.setError('cover', {
                  type: 'custom',
                  message: res?.errors?.cover?.join(' و '),
                })
              }
              if (res?.errors?.publishDate) {
                form.setError('publishDate', {
                  type: 'custom',
                  message: res?.errors.publishDate?.join(' و '),
                })
              } else if (res?.errors?.edition) {
                form.setError('edition', {
                  type: 'custom',
                  message: res?.errors.edition?.join(' و '),
                })
              } else if (res?.errors?.summary) {
                form.setError('summary', {
                  type: 'custom',
                  message: res?.errors?.summary?.join(' و '),
                })
              }
              if (res?.errors?.price) {
                form.setError('price', {
                  type: 'custom',
                  message: res?.errors.price?.join(' و '),
                })
              } else if (res?.errors?.writerId) {
                form.setError('writerId', {
                  type: 'custom',
                  message: res?.errors.writerId?.join(' و '),
                })
              } else if (res?.errors?.translatorId) {
                form.setError('translatorId', {
                  type: 'custom',
                  message: res?.errors?.translatorId?.join(' و '),
                })
              }
              if (res?.errors?.editorId) {
                form.setError('editorId', {
                  type: 'custom',
                  message: res?.errors.editorId?.join(' و '),
                })
              } else if (res?.errors?.illustratorId) {
                form.setError('illustratorId', {
                  type: 'custom',
                  message: res?.errors.illustratorId?.join(' و '),
                })
              } else if (res?.errors?.photographerId) {
                form.setError('photographerId', {
                  type: 'custom',
                  message: res?.errors?.photographerId?.join(' و '),
                })
              }
              if (res?.errors?.categoryId) {
                form.setError('categoryId', {
                  type: 'custom',
                  message: res?.errors.categoryId?.join(' و '),
                })
              } else if (res?.errors?.image) {
                form.setError('image', {
                  type: 'custom',
                  message: res?.errors.image?.join(' و '),
                })
              } else if (res?.errors?.isFeatured) {
                form.setError('isFeatured', {
                  type: 'custom',
                  message: res?.errors?.isFeatured?.join(' و '),
                })
              }
              if (res?.errors?.isArchived) {
                form.setError('isArchived', {
                  type: 'custom',
                  message: res?.errors.isArchived?.join(' و '),
                })
              } else if (res?.errors?._form) {
                // form.setError('root', {
                //   type: 'custom',
                //   message: res?.errors?._form?.join(' و '),
                // })
                toast.error(res?.errors?._form?.join(' و '))
              }
              // if (res?.success) {
              //    toast.success(toastMessage)
              // }
            })
            .catch(() => toast.error('مشکلی پیش آمده.'))
        })
      } else {
        startTransition(() => {
          createProduct(formData, params.storeId as string, path)
            .then((res) => {
              // if (res?.errors?._form) {
              //   toast.error(res?.errors._form?.join(' و '))
              //   form.setError('root', {
              //     type: 'custom',
              //     message: res?.errors?._form?.join(' و '),
              //   })
              // }
              if (res?.errors?.isbn) {
                form.setError('isbn', {
                  type: 'custom',
                  message: res?.errors.isbn?.join(' و '),
                })
              } else if (res?.errors?.title) {
                form.setError('title', {
                  type: 'custom',
                  message: res?.errors.title?.join(' و '),
                })
              } else if (res?.errors?.subTitle) {
                form.setError('subTitle', {
                  type: 'custom',
                  message: res?.errors?.subTitle?.join(' و '),
                })
              }
              if (res?.errors?.originalTitle) {
                form.setError('originalTitle', {
                  type: 'custom',
                  message: res?.errors.originalTitle?.join(' و '),
                })
              } else if (res?.errors?.description) {
                form.setError('description', {
                  type: 'custom',
                  message: res?.errors.description?.join(' و '),
                })
              } else if (res?.errors?.size) {
                form.setError('size', {
                  type: 'custom',
                  message: res?.errors?.size?.join(' و '),
                })
              }
              if (res?.errors?.pages) {
                form.setError('pages', {
                  type: 'custom',
                  message: res?.errors.pages?.join(' و '),
                })
              } else if (res?.errors?.weight) {
                form.setError('weight', {
                  type: 'custom',
                  message: res?.errors.weight?.join(' و '),
                })
              } else if (res?.errors?.cover) {
                form.setError('cover', {
                  type: 'custom',
                  message: res?.errors?.cover?.join(' و '),
                })
              }
              if (res?.errors?.publishDate) {
                form.setError('publishDate', {
                  type: 'custom',
                  message: res?.errors.publishDate?.join(' و '),
                })
              } else if (res?.errors?.edition) {
                form.setError('edition', {
                  type: 'custom',
                  message: res?.errors.edition?.join(' و '),
                })
              } else if (res?.errors?.summary) {
                form.setError('summary', {
                  type: 'custom',
                  message: res?.errors?.summary?.join(' و '),
                })
              }
              if (res?.errors?.price) {
                form.setError('price', {
                  type: 'custom',
                  message: res?.errors.price?.join(' و '),
                })
              } else if (res?.errors?.writerId) {
                form.setError('writerId', {
                  type: 'custom',
                  message: res?.errors.writerId?.join(' و '),
                })
              } else if (res?.errors?.translatorId) {
                form.setError('translatorId', {
                  type: 'custom',
                  message: res?.errors?.translatorId?.join(' و '),
                })
              }
              if (res?.errors?.editorId) {
                form.setError('editorId', {
                  type: 'custom',
                  message: res?.errors.editorId?.join(' و '),
                })
              } else if (res?.errors?.illustratorId) {
                form.setError('illustratorId', {
                  type: 'custom',
                  message: res?.errors.illustratorId?.join(' و '),
                })
              } else if (res?.errors?.photographerId) {
                form.setError('photographerId', {
                  type: 'custom',
                  message: res?.errors?.photographerId?.join(' و '),
                })
              }
              if (res?.errors?.categoryId) {
                form.setError('categoryId', {
                  type: 'custom',
                  message: res?.errors.categoryId?.join(' و '),
                })
              } else if (res?.errors?.image) {
                form.setError('image', {
                  type: 'custom',
                  message: res?.errors.image?.join(' و '),
                })
              } else if (res?.errors?.isFeatured) {
                form.setError('isFeatured', {
                  type: 'custom',
                  message: res?.errors?.isFeatured?.join(' و '),
                })
              }
              if (res?.errors?.isArchived) {
                form.setError('isArchived', {
                  type: 'custom',
                  message: res?.errors.isArchived?.join(' و '),
                })
              } else if (res?.errors?._form) {
                // form.setError('root', {
                //   type: 'custom',
                //   message: res?.errors?._form?.join(' و '),
                // })
                toast.error(res?.errors?._form?.join(' و '))
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

  const validUrls = initialData
    ? (initialData.images
        .map((img: { url: string }) => img.url)
        .filter(Boolean) as string[])
    : (files
        .map((file) => URL.createObjectURL(file))
        .filter(Boolean) as string[])
  // console.log(form.formState.errors)
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
          <div className="col-span-2 lg:col-span-4 max-w-md ">
            {files.length > 0 ? (
              <div className="h-96 md:h-[450px] overflow-hidden rounded-md">
                <AspectRatio ratio={1 / 1} className="relative h-full">
                  <ImageSlider urls={validUrls} />
                </AspectRatio>
              </div>
            ) : (
              <FormField
                control={form.control}
                name="image"
                render={({ field: { onChange }, ...field }) => (
                  <FormItem>
                    <FormLabel className="mx-auto cursor-pointer bg-transparent rounded-xl flex flex-col justify-center gap-4 items-center border-2 border-black/20 dark:border-white/20 border-dashed w-full h-24 shadow  ">
                      {/* <FileUp size={42} className=" " /> */}
                      <span
                        className={cn(buttonVariants({ variant: 'ghost' }))}
                      >
                        انتخاب عکس
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        multiple={true}
                        disabled={form.formState.isSubmitting}
                        {...field}
                        onChange={async (event) => {
                          // Triggered when user uploaded a new file
                          // FileList is immutable, so we need to create a new one
                          const dataTransfer = new DataTransfer()

                          // Add old images
                          if (files) {
                            Array.from(files).forEach((image) =>
                              dataTransfer.items.add(image)
                            )
                          }

                          // Add newly uploaded images
                          Array.from(event.target.files!).forEach((image) =>
                            dataTransfer.items.add(image)
                          )

                          // Validate and update uploaded file
                          const newFiles = dataTransfer.files

                          setFiles(Array.from(newFiles))

                          onChange(newFiles)
                        }}
                      />
                    </FormControl>
                    <FormDescription className="flex justify-center items-center"></FormDescription>
                    {/* <FormMessage className="dark:text-rose-400" /> */}
                    <FormMessage>
                      {form.getFieldState('image')?.error?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            )}
          </div>
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
                <FormMessage>
                  {form.getFieldState('title')?.error?.message}
                </FormMessage>
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
                <FormMessage>
                  {form.getFieldState('isbn')?.error?.message}
                </FormMessage>
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
                <FormMessage>
                  {form.getFieldState('subTitle')?.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>دسته‌بندی</FormLabel>
                <Select
                  dir="rtl"
                  // disabled={loading}
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="یک دسته را انتخاب کنید"
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage>
                  {form.getFieldState('categoryId')?.error?.message}
                </FormMessage>
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
                <FormMessage>
                  {form.getFieldState('originalTitle')?.error?.message}
                </FormMessage>
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
                <FormMessage>
                  {form.getFieldState('description')?.error?.message}
                </FormMessage>
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
                  <Select
                    dir="rtl"
                    // disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="انتخاب قطع کتاب"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {sizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage>
                  {form.getFieldState('size')?.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pages"
            render={({ field }) => (
              <FormItem className="max-w-md">
                <FormLabel>صفحات</FormLabel>
                <FormControl>
                  <Input
                    disabled={isPending}
                    placeholder="تعداد صفحات"
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {form.getFieldState('pages')?.error?.message}
                </FormMessage>
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
                <FormMessage>
                  {form.getFieldState('weight')?.error?.message}
                </FormMessage>
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
                  <Select
                    dir="rtl"
                    // disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="انتخاب جلد"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {covers.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage>
                  {form.getFieldState('cover')?.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          {/* <FormField
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
                 <FormMessage>
                  {form.getFieldState('categoryId')?.error?.message}
                </FormMessage>
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="publishDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>تاریخ انتشار</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value ? (
                          format(field.value, 'MMMM yyyy')
                        ) : (
                          <span>یک تاریخ را انتخاب کنید</span>
                        )}
                        <CalendarIcon className="mr-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    {/* <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    /> */}
                    <Calendar
                      locale="fa-IR"
                      calendarType="islamic"
                      maxDetail="year"
                      // minDate={new Date()}
                      className={cn(
                        primaryFont.className,
                        'react-calendar'
                        // 'REACT-CALENDAR p-2  text-primary bg-primary-foreground hover:text-primary hover:bg-primary-foreground focus:text-primary focus:bg-primary-foreground  rounded-md [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
                      )}
                      // view="month"
                      maxDate={new Date()}
                      onChange={field.onChange}
                      value={field.value}
                      // onClickDay={(date) => setSelectedDate(date)}
                      // tileClassName={({ date }) => {
                      //   return closedDays?.includes(formatISO(date))
                      //     ? 'closed-day'
                      //     : null
                      // }}
                    />
                  </PopoverContent>
                </Popover>
                {/* <FormDescription>
                  Your date of birth is used to calculate your age.
                </FormDescription> */}
                <FormMessage>
                  {form.getFieldState('publishDate')?.error?.message}
                </FormMessage>
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
                    placeholder="نوبت ویراست"
                    {...field}
                  />
                </FormControl>
                <FormMessage>
                  {form.getFieldState('edition')?.error?.message}
                </FormMessage>
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
                <FormMessage>
                  {form.getFieldState('summary')?.error?.message}
                </FormMessage>
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
                <FormMessage>
                  {form.getFieldState('price')?.error?.message}
                </FormMessage>
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
                  selected={field.value!}
                  options={writers.map((writer) => {
                    return { value: writer.id, label: writer.name }
                  })}
                  // onChange={console.log(form.getValues('writerId'))}

                  {...field}
                  // className="sm:w-[510px]"
                />

                <FormMessage>
                  {form.getFieldState('writerId')?.error?.message}
                </FormMessage>
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
                  selected={field.value!}
                  options={translators.map((translator) => {
                    return { value: translator.id, label: translator.name }
                  })}
                  // onChange={console.log(form.getValues('writerId'))}

                  {...field}
                  // className="sm:w-[510px]"
                />
                <FormMessage>
                  {form.getFieldState('translatorId')?.error?.message}
                </FormMessage>
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
                  selected={field.value!}
                  options={editors.map((editor) => {
                    return { value: editor.id, label: editor.name }
                  })}
                  // onChange={console.log(form.getValues('writerId'))}

                  {...field}
                  // className="sm:w-[510px]"
                />
                <FormMessage>
                  {form.getFieldState('editorId')?.error?.message}
                </FormMessage>
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
                  selected={field.value!}
                  options={illustrators.map((illustrator) => {
                    return { value: illustrator.id, label: illustrator.name }
                  })}
                  // onChange={console.log(form.getValues('writerId'))}

                  {...field}
                  // className="sm:w-[510px]"
                />
                <FormMessage>
                  {form.getFieldState('illustratorId')?.error?.message}
                </FormMessage>
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
                  selected={field.value!}
                  options={photographers.map((photographer) => {
                    return { value: photographer.id, label: photographer.name }
                  })}
                  // onChange={console.log(form.getValues('writerId'))}

                  {...field}
                  // className="sm:w-[510px]"
                />
                <FormMessage>
                  {form.getFieldState('photographerId')?.error?.message}
                </FormMessage>
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
                <FormMessage>
                  {form.getFieldState('isFeatured')?.error?.message}
                </FormMessage>
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
                <FormMessage>
                  {form.getFieldState('isArchived')?.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <Button disabled={isPending} className="w-full ml-auto">
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
