'use client'
import { FC, useRef, useState } from 'react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { AnswerSchema } from '@/lib/social-validations'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
// import { Editor } from '@tinymce/tinymce-react'
// import { createAnswer } from '@/lib/actions/answer.actions'
// import { useTheme } from '@/context/ThemeProvider'
import Image from 'next/image'
import { redirect, usePathname, useRouter } from 'next/navigation'
import TipTap from '../tiptap/TipTap'
import { createAnswer } from '@/lib/actions/social/answer.actions'

interface AnswerProps {
  question: string
  questionId: string
  authorId: string
}

const Answer: FC<AnswerProps> = ({ question, questionId, authorId }) => {
  // const { mode } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  // const editorRef = useRef(null)

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: '',
    },
  })

  const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
    setIsSubmitting(true)
    try {
      await createAnswer({
        content: values.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathname,
      })

      form.reset()

      // if (editorRef.current) {
      //   const editor = editorRef.current as any

      //   editor.setContent('')
      // }
      router.push('/social')
    } catch (error) {
      console.log(error)
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className="py-4">
      <div className="flex flex-col justify-between gap-5 py-4 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="mx-auto py-4 text-2xl font-semibold">
          نظر خود را بنویسید
        </h4>
      </div>
      {/* <Button
        variant={'outline'}
        className=" metalize gap-1.5 rounded-md bg-slate-500 px-4 py-2.5 text-slate-100 shadow-none "
        onClick={() => {}}
      >
        <Image
          src={'/assets/icons/stars.svg'}
          alt="star"
          width={12}
          height={12}
          className="object-contain"
        />
        تولید جواب با هوش مصنوعی
      </Button> */}
      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3 ">
                <FormControl className="mt-3.5">
                  <TipTap description={field.value} onChange={field.onChange} />
                  {/* <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    // @ts-ignore
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    onBlur={field.onBlur}
                    onEditorChange={(connect) => field.onChange(connect)}
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
                        'body { font-family:Helvetica,Arial,sans-serif; font-size:16px ',
                      skin: mode === 'dark' ? 'oxide-dark' : 'oxide',
                      content_css: mode === 'dark' ? 'dark' : 'light',
                    }}
                  /> */}
                </FormControl>

                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-start">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="metalize w-fit "
            >
              {isSubmitting ? 'در حال ارسال...' : 'ارسال'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default Answer
