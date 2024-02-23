'use client'
import { FC, KeyboardEvent, useRef, useState } from 'react'
// import { Editor } from '@tinymce/tinymce-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { QuestionSchema } from '@/lib/social-validations'

import Image from 'next/image'
// import { createQuestion, editQuestion } from '@/lib/actions/question.action'
import { useRouter, usePathname } from 'next/navigation'
import { Loader } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import Tiptap from '../tiptap/TipTap'
// import { useTheme } from '@/context/ThemeProvider'

interface QuestionProps {
  userId: string
  type?: string
  questionDetails?: string
}

// const type: any = 'create'

const Question: FC<QuestionProps> = ({ userId, type, questionDetails }) => {
  // to extract the value later
  // const { mode } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const editorRef = useRef(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const parsedQuestionDetails =
    questionDetails && JSON.parse(questionDetails || '')
  // console.log(parsedQuestionDetails.question)

  const groupedTags = parsedQuestionDetails?.question.tags.map(
    (tag: any) => tag.name
  )
  const form = useForm<z.infer<typeof QuestionSchema>>({
    resolver: zodResolver(QuestionSchema),
    defaultValues: {
      title: parsedQuestionDetails?.question.title || '',
      explanation: parsedQuestionDetails?.question.content || '',
      tags: groupedTags || [],
    },
  })

  async function onSubmit(values: z.infer<typeof QuestionSchema>) {
    setIsSubmitting(true)

    try {
      // console.log(values)
      if (type === 'Edit') {
        // await editQuestion({
        //   questionId: parsedQuestionDetails.question.id,
        //   title: values.title,
        //   content: values.explanation,
        //   path: pathname,
        // })
        router.push(`/social/question/${parsedQuestionDetails.question.id}`)
      } else {
        console.log(values)
        // await createQuestion({
        //   title: values.title,
        //   content: values.explanation,
        //   tags: values.tags,
        //   authorId: userId,
        //   path: pathname,
        // })

        // router.push('/')
      }
    } catch (error) {
      //
      console.log(error)
    } finally {
      //
      setIsSubmitting(false)
      form.reset()
    }
  }
  const handleInputKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === 'Enter' && field.name === 'tags') {
      e.preventDefault()

      const tagInput = e.target as HTMLInputElement
      const tagValue = tagInput.value.trim()

      if (tagValue !== '') {
        if (tagValue.length > 15) {
          return form.setError('tags', {
            type: 'required',
            message: 'تگ باید کمتر از 15 حرف باشد.',
          })
        }

        if (!field.value.includes(tagValue as never)) {
          form.setValue('tags', [...field.value, tagValue])
          tagInput.value = ''
          form.clearErrors('tags')
        }
      } else {
        form.trigger()
      }
    }
  }

  const handleTagRemove = (tag: string, field: any) => {
    const newTags = field.value.filter((t: string) => t !== tag)

    form.setValue('tags', newTags)
  }
  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className=" flex w-full flex-col gap-10 text-slate-300 "
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel>
                  عنوان سوال <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <Input
                    className="min-h-[56px] border text-slate-700 "
                    {...field}
                  />
                </FormControl>
                <FormDescription className="mt-2.5">
                  {/* Be specific and imagine you&apos;re asking a question to
                  another person. */}
                  سوالات خود را از دیگران بپرسید.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="explanation"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3 ">
                <FormLabel>
                  جزئیات مشکل خودتان را بیان کنید.
                  {/* Detailed explanation of your problem{' '} */}
                  <span className="text-rose-500">*</span>
                </FormLabel>

                <FormControl className="font-farsiSnapReg mt-3.5">
                  <Tiptap description={field.value} onChange={field.onChange} />
                  {/* <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    // @ts-ignore
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    onBlur={field.onBlur}
                    onEditorChange={(connect) => field.onChange(connect)}
                    initialValue={
                      parsedQuestionDetails?.question?.content || ''
                    }
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        'codesample',
                        'advlist',
                        'autolink',
                        'lists',
                        'link',
                        'image',
                        'charmap',
                        'preview',
                        'anchor',
                        'searchreplace',
                        'visualblocks',
                        'fullscreen',
                        'insertdatetime',
                        'media',
                        'table',
                      ],
                      toolbar:
                        ' undo redo | blocks | ' +
                        'codesample | bold italic forecolor | alignleft aligncenter |' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                      content_style:
                        'body { font-family:farsiSnapReg ,Helvetica,Arial,sans-serif; font-size:16px ',
                      skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                      content_css: mode === 'dark' ? 'dark' : 'light',
                    }}
                  /> */}
                </FormControl>

                <FormDescription className="mt-2.5">
                  {/* Introduce the problem and expand on what you put in the title.
                  Minimum 20 characters. */}
                  مشکلتان را در حداقل 20 حرف توضیح دهید.
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel>
                  تگ‌ها <span className="text-rose-500">*</span>
                </FormLabel>
                <FormControl className="mt-3.5">
                  <>
                    <Input
                      disabled={type === 'Edit'}
                      className="min-h-[56px] border text-slate-700 dark:text-inherit "
                      // {...field}
                      onKeyDown={(e) => handleInputKeyDown(e, field)}
                      placeholder="اضافه کردن تگ..."
                    />
                    {field.value.length > 0 && (
                      <div className="flex-start mt-2.5 gap-2.5">
                        {field.value.map((tag: any) => (
                          <Badge
                            key={tag}
                            className=" flex items-center justify-center gap-2 rounded-md border-none bg-slate-400 px-4 py-2 capitalize hover:bg-slate-600 "
                            onClick={() =>
                              type !== 'Edit'
                                ? handleTagRemove(tag, field)
                                : () => {}
                            }
                          >
                            {tag}
                            {type !== 'Edit' && (
                              <Image
                                src={'/assets/icons/close.svg'}
                                alt="Close icon"
                                width={12}
                                height={12}
                                className="cursor-pointer object-contain invert-0 "
                              />
                            )}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </>
                </FormControl>
                <FormDescription className="mt-2.5">
                  {/* Add up to 3 tags to describe what your question is about. You
                  need to press enter to add tag. */}
                  با حداکثر سه تگ توضیح دهید سوال شما درباره چیست. (بعد از هر تگ
                  اینتر بزنید)
                </FormDescription>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <Button
            disabled={isSubmitting}
            className="metalize w-fit"
            type="submit"
          >
            {isSubmitting ? (
              <>
                {type === 'Edit' ? 'در حال ویرایش...' : 'در حال ارسال...'}
                <Loader className="mr-2 h-4 w-4 animate-spin " />
              </>
            ) : (
              <>{type === 'Edit' ? 'ویرایش سوال' : 'پرسیدن سوال'}</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default Question
