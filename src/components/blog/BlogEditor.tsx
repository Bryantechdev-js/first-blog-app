"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import Image from "@tiptap/extension-image";

interface BlogEditorProps {
  value: string;
  onChange: (html: string) => void;
}

export default function BlogEditor({ value, onChange }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      Placeholder.configure({
        placeholder: "Tell your story…",
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="border rounded-lg bg-white">
      {/* Toolbar */}
      <div className="flex gap-2 border-b p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="text-sm px-2 py-1 rounded hover:bg-zinc-100"
        >
          B
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="text-sm px-2 py-1 rounded hover:bg-zinc-100"
        >
          I
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="text-sm px-2 py-1 rounded hover:bg-zinc-100"
        >
          U
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="text-sm px-2 py-1 rounded hover:bg-zinc-100"
        >
          •
        </button>
      </div>

      {/* Editor content */}
      <EditorContent
        editor={editor}
        className="min-h-[260px] p-4 prose max-w-none focus:outline-none"
      />
    </div>
  );
}
