'use client'
import { FC } from 'react'
import { type Editor } from '@tiptap/react'
import {
  Bold,
  Strikethrough,
  Italic,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Highlighter,
  AlignLeft,
  AlignRight,
  AlignCenter,
  List,
  Quote,
  ListEnd,
  Undo,
  Redo,
} from 'lucide-react'
import { Toggle } from '@/components/ui/toggle'
interface ToolbarProps {
  editor: Editor | null
}

const Toolbar: FC<ToolbarProps> = ({ editor }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="border border-input bg-transparent rounded-md">
      <Toggle
        size={'sm'}
        pressed={editor.isActive('textStyle')}
        onPressedChange={() => () =>
          editor.chain().focus().setFontFamily('serif').run()}
        className={
          editor.isActive('textStyle', { fontFamily: 'serif' })
            ? 'is-active'
            : ''
        }
      >
        F
      </Toggle>
      <Toggle
        size={'sm'}
        pressed={editor.isActive('textStyle')}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign('left').run()
        }
        className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
      >
        <AlignLeft className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={'sm'}
        pressed={editor.isActive('textStyle')}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign('right').run()
        }
        className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
      >
        <AlignRight className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={'sm'}
        pressed={editor.isActive('textStyle')}
        onPressedChange={() =>
          editor.chain().focus().setTextAlign('center').run()
        }
        className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
      >
        <AlignCenter className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={'sm'}
        pressed={editor.isActive('highlight')}
        onPressedChange={() => () =>
          editor.chain().focus().toggleHighlight({ color: '#ffc078' }).run()}
        className={
          editor.isActive('highlight', { color: '#ffc078' }) ? 'is-active' : ''
        }
      >
        <Highlighter />
      </Toggle>
      <Toggle
        size={'sm'}
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={'sm'}
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={'sm'}
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>

      <Toggle
        size={'sm'}
        pressed={editor.isActive('heading')}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        <Heading1 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={'sm'}
        pressed={editor.isActive('heading')}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        <Heading2 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={'sm'}
        pressed={editor.isActive('heading')}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
      >
        <Heading3 className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={'sm'}
        pressed={editor.isActive('heading')}
        onPressedChange={() =>
          editor.chain().focus().toggleHeading({ level: 4 }).run()
        }
        className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
      >
        <Heading4 className="h-4 w-4" />
      </Toggle>

      <Toggle
        size={'sm'}
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <List className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={'sm'}
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      <Toggle
        size={'sm'}
        pressed={editor.isActive('blockquote')}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
      >
        <Quote className="h-4 w-4" />
      </Toggle>
      {/* <Toggle
        size={'sm'}
        pressed={editor.isActive('')}
        onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}
      >
        horizontal rule
      </Toggle> */}
      <Toggle
        size={'sm'}
        pressed={editor.isActive('')}
        onPressedChange={() => editor.chain().focus().setHardBreak().run()}
      >
        <ListEnd className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={'sm'}
        pressed={editor.isActive('')}
        onPressedChange={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <Undo className="h-4 w-4" />
      </Toggle>
      <Toggle
        size={'sm'}
        pressed={editor.isActive('')}
        onPressedChange={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
      >
        <Redo className="h-4 w-4" />
      </Toggle>
      {/* <Toggle
        size={'sm'}
        pressed={editor.chain().focus().unsetColor().run()}
        onPressedChange={() => editor.chain().focus().setColor('#958DF1').run()}
        className={
          editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''
        }
      >
        <div className="w-6 h-6 rounded-full bg-purple-400" />
      </Toggle> */}
    </div>
  )
}

export default Toolbar
