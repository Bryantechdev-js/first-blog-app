"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";

// UI Components
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select";
import { Avatar, AvatarImage } from "../ui/avatar";
import { PlusCircle, Loader2, Check } from "lucide-react";
import { UploadButton } from "@/utils/uploadthing";

// Tiptap imports
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";

// ---------------- Validation schema ----------------
const blogSchema = z.object({
  title: z.string().min(10),
  content: z.string().min(20),
  categories: z.string().min(1),
  media: z.array(z.string()).optional(),
});

type BlogFormType = z.infer<typeof blogSchema>;

const BLOG_CATEGORIES = ["Web Development", "Technology", "Programming", "Data Science", "Design", "AI"];

// ---------------- Media Preview ----------------
function PreviewItem({ url }: { url: string }) {
  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(url);
  return (
    <div className="w-28 h-20 rounded-md overflow-hidden bg-zinc-100 flex items-center justify-center">
      {isVideo ? (
        <video src={url} className="object-cover w-full h-full" muted playsInline />
      ) : (
        <img src={url} className="object-cover w-full h-full" alt="preview" />
      )}
    </div>
  );
}

// ---------------- Editor Toolbar ----------------
function EditorToolbar({ editor }: { editor: any }) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <Button size="sm" onClick={() => editor.chain().focus().toggleBold().run()}>B</Button>
      <Button size="sm" onClick={() => editor.chain().focus().toggleItalic().run()}>I</Button>
      <Button size="sm" onClick={() => editor.chain().focus().toggleUnderline().run()}>U</Button>
      <Button size="sm" onClick={() => editor.chain().focus().toggleStrike().run()}>S</Button>

      <Button size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</Button>
      <Button size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</Button>
      <Button size="sm" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</Button>

      <Button size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</Button>
      <Button size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</Button>

      <Button size="sm" onClick={() => editor.chain().focus().toggleBlockquote().run()}>❝</Button>
      <Button size="sm" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>{"</>"}</Button>

      <Button
        size="sm"
        onClick={() => {
          const url = prompt("Enter URL");
          if (url) editor.chain().focus().setLink({ href: url }).run();
        }}
      >
        Link
      </Button>

      <input
        type="color"
        className="w-8 h-8 p-0 border rounded"
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
      />

      <Button size="sm" onClick={() => editor.chain().focus().setTextAlign("left").run()}>Left</Button>
      <Button size="sm" onClick={() => editor.chain().focus().setTextAlign("center").run()}>Center</Button>
      <Button size="sm" onClick={() => editor.chain().focus().setTextAlign("right").run()}>Right</Button>
      <Button size="sm" onClick={() => editor.chain().focus().setTextAlign("justify").run()}>Justify</Button>

      <Button size="sm" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>Clear</Button>

      <Button
        size="sm"
        onClick={() => {
          const url = prompt("Enter image URL");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
      >
        Img
      </Button>
    </div>
  );
}

// ---------------- Main Component ----------------
export default function CreateBlogForm({ user }: { user?: any }) {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const { handleSubmit, control, setValue, formState: { errors } } = useForm<BlogFormType>({
    resolver: zodResolver(blogSchema),
    defaultValues: { title: "", content: "", categories: "", media: [] },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Write your article..." }),
      Underline,
      Link,
      Image,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Heading.configure({ levels: [1, 2, 3] }),
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      CodeBlock,
    ],
    content: "",
    onUpdate({ editor }) {
      setValue("content", editor.getHTML(), { shouldValidate: true });
    },
    editorProps: { attributes: { class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none" } },
    immediatelyRender: false, // <<< Fix SSR hydration
  });

  const handleUploadBegin = () => {
    setLoading(true);
    toast("Uploading media...");
  };

  const handleClientUploadComplete = (files: { url: string }[]) => {
    const urls = files.map(f => f.url);
    setUploadedUrls(prev => {
      const next = [...prev, ...urls];
      setValue("media", next, { shouldValidate: true });
      return next;
    });
    setLoading(false);
    toast.success("Upload completed!");
  };

  const handleUploadError = (err?: Error) => {
    setLoading(false);
    toast.error("Upload failed. Try again.");
    console.error(err);
  };

  const onSubmit = (data: BlogFormType) => {
    setFormSubmitting(true);
    try {
      console.log("Blog Data:", data);
      toast.success("Blog created successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while saving the blog.");
    } finally {
      setFormSubmitting(false);
    }
  };

  const userName = user?.userName ?? user?.email ?? "Guest";

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-8 mt-10">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
          </Avatar>
          <div>
            <p className="text-lg font-semibold">{userName}</p>
            <p className="text-sm text-zinc-500">Share your story with the world</p>
          </div>
        </div>
        <Button onClick={handleSubmit(onSubmit)} disabled={formSubmitting || loading}>
          {formSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : "Publish"}
        </Button>
      </header>

      <div className="bg-white dark:bg-zinc-900 shadow-md rounded-xl border border-zinc-100 dark:border-zinc-800 p-6 transition-shadow hover:shadow-xl duration-300">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <Controller
              name="title"
              control={control}
              render={({ field }) => <Input {...field} placeholder="Catchy title for your post" />}
            />
            {errors.title && <p className="text-sm text-red-600 mt-2">{errors.title.message}</p>}
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="md:col-span-2">
              <Controller
                name="categories"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOG_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.categories && <p className="text-sm text-red-600 mt-2">{errors.categories.message}</p>}
            </div>

            {/* Upload */}
            <div className="flex flex-col items-center gap-3">
              <UploadButton
                endpoint="mediaUploader"
                onUploadBegin={handleUploadBegin}
                onClientUploadComplete={handleClientUploadComplete}
                onUploadError={handleUploadError}
                appearance={{ button: "bg-black text-white px-4 py-2 rounded-md hover:bg-zinc-800 transition" }}
                content={{ button: <div className="flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Upload media</div> }}
                className="w-24"
              />
              {loading && <Loader2 className="animate-spin h-6 w-6 text-zinc-500 mt-2" />}
              {!loading && uploadedUrls.length > 0 && <Check className="h-6 w-6 text-emerald-500 mt-2" />}
            </div>
          </div>

          {/* Editor */}
          <EditorToolbar editor={editor} />
          <div className="border rounded-md p-2">
            {editor ? <EditorContent editor={editor} /> : <p>Loading editor...</p>}
          </div>
          {errors.content && <p className="text-sm text-red-600 mt-2">{errors.content.message}</p>}

          {/* Media Preview */}
          {uploadedUrls.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-3">Media previews</h4>
              <div className="flex gap-3 flex-wrap">
                {uploadedUrls.map((u, i) => <PreviewItem key={i} url={u} />)}
              </div>
            </div>
          )}

          {/* Submit */}
          <Button type="submit" className="w-full py-3 text-sm font-medium" disabled={formSubmitting || loading}>
            {formSubmitting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : "Publish Post"}
          </Button>
        </form>
      </div>
    </div>
  );
}
