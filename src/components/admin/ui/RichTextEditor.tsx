'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Undo, Redo, ImageIcon, LinkIcon
} from 'lucide-react'
import { useCallback, useEffect } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder = 'Write something amazing...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true }),
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] p-4 max-w-none text-[#F8F8F8]',
      },
    },
  })

  // Update content when value changes externally (e.g., loading initial data)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [editor, value])

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) return // cancelled
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt('Image URL (You can upload an image via Media Library first)')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className="rounded-xl overflow-hidden transition-all duration-150" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #27272a' }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2" style={{ borderBottom: '1px solid #27272a', background: 'rgba(255,255,255,0.03)' }}>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded transition-colors ${editor.isActive('bold') ? 'bg-[rgba(212,175,55,0.1)] text-[#D4AF37]' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-[#F8F8F8]'}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded transition-colors ${editor.isActive('italic') ? 'bg-[rgba(212,175,55,0.1)] text-[#D4AF37]' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-[#F8F8F8]'}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-2 rounded transition-colors ${editor.isActive('strike') ? 'bg-[rgba(212,175,55,0.1)] text-[#D4AF37]' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-[#F8F8F8]'}`}
        >
          <Strikethrough className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`p-2 rounded transition-colors ${editor.isActive('code') ? 'bg-[rgba(212,175,55,0.1)] text-[#D4AF37]' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-[#F8F8F8]'}`}
        >
          <Code className="w-4 h-4" />
        </button>

        <div className="w-px h-5 mx-1" style={{ background: '#3f3f46' }} />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded transition-colors font-bold text-sm ${editor.isActive('heading', { level: 2 }) ? 'bg-[rgba(212,175,55,0.1)] text-[#D4AF37]' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-[#F8F8F8]'}`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-2 rounded transition-colors font-bold text-sm ${editor.isActive('heading', { level: 3 }) ? 'bg-[rgba(212,175,55,0.1)] text-[#D4AF37]' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-[#F8F8F8]'}`}
        >
          H3
        </button>

        <div className="w-px h-5 mx-1" style={{ background: '#3f3f46' }} />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded transition-colors ${editor.isActive('bulletList') ? 'bg-[rgba(212,175,55,0.1)] text-[#D4AF37]' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-[#F8F8F8]'}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded transition-colors ${editor.isActive('orderedList') ? 'bg-[rgba(212,175,55,0.1)] text-[#D4AF37]' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-[#F8F8F8]'}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-2 rounded transition-colors ${editor.isActive('blockquote') ? 'bg-[rgba(212,175,55,0.1)] text-[#D4AF37]' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-[#F8F8F8]'}`}
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-px h-5 mx-1" style={{ background: '#3f3f46' }} />

        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded transition-colors ${editor.isActive('link') ? 'bg-[rgba(212,175,55,0.1)] text-[#D4AF37]' : 'text-[#a1a1aa] hover:bg-white/5 hover:text-[#F8F8F8]'}`}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={addImage}
          className="p-2 rounded transition-colors text-[#a1a1aa] hover:bg-white/5 hover:text-[#F8F8F8]"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded transition-colors text-[#a1a1aa] hover:bg-white/5 hover:text-[#F8F8F8] disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded transition-colors text-[#a1a1aa] hover:bg-white/5 hover:text-[#F8F8F8] disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content */}
      <div style={{ background: '#111113' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
