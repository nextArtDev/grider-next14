'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { FC } from 'react'
import Toolbar from './Toolbar'
import StarterKit from '@tiptap/starter-kit'
import Heading from '@tiptap/extension-heading'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import Highlight from '@tiptap/extension-highlight'

interface TipTapProps {
  description: string
  onChange: (richText: string) => void
}

const TipTap: FC<TipTapProps> = ({ description, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      TextStyle.configure({
        HTMLAttributes: {
          class: 'text-black dark:text-white',
        },
      }),
      FontFamily.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
        // HTMLAttributes: {
        //   class: 'my-custom-class',
        // },
      }),
      TextAlign.configure({
        // types: ['heading', 'paragraph'],
      }),
      Color.configure({
        types: ['textStyle'],
      }),
      Heading.configure({
        HTMLAttributes: {
          class: 'text-xl font-bold',
          levels: [2],
        },
      }),
    ],
    content: description,
    // customizing editor like shadcn
    editorProps: {
      attributes: {
        class:
          'rounded-md rounded-t-none border min-h-[150px] border-input p-4 ',
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML())
      //   console.log(editor.getHTML())
    },
  })

  return (
    <div className="flex flex-col justify-stretch min-h-[250px]  ">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default TipTap
