"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { UploadButton } from "@/utils/uploadthing";
import { Loader2, CheckCircle } from "lucide-react";
import BlogEditor from "./BlogEditor";
import { useRouter } from "next/navigation";

/* ---------------- Schema ---------------- */
const blogSchema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters"),
  category: z.string().min(1, "Select a category"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  coverImage: z.array(z.string()).optional(),
});

type BlogFormData = z.infer<typeof blogSchema>;

export const CATEGORIES = [
  "Web Development",
  "Technology",
  "Programming",
  "Design",
  "AI",
];

export default function CreateBlogForm({ user }: { user?: any }) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      category: "",
      content: "",
      coverImage: [],
    },
  });

  const uploadedMedia = watch("media") ?? [];

  //creating the router to navigate pages
  const router = useRouter();

  /* ---------------- Submit ---------------- */
  const onSubmit = async (data: BlogFormData) => {
    try {
      toast.loading("Publishing post...", { id: "publish" });

      const res = await fetch("/api/create-blog-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-arcjet-suspicious": "true", // ✅ STRING
        },
        body: JSON.stringify(data),
      });


      const result = await res.json();

      toast.dismiss("publish");

      if (!result.success) {
        toast.error(result.error || "Failed to publish post");
        return;
      }

      toast.success(result.message || "Post published successfully 🚀");
      router.push("/")
    } catch (error) {
      toast.dismiss("publish");
      toast.error("Something went wrong");
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto mt-12 space-y-8"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar className="shadow">
            <AvatarImage src="https://github.com/shadcn.png" />
          </Avatar>
          <span className="font-medium">{user?.email ?? "Guest"}</span>
        </div>

        <Button type="submit" disabled={uploading}>
          {uploading ? "Uploading…" : "Publish"}
        </Button>
      </div>

      {/* Title */}
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            placeholder="Blog title"
            className="text-3xl font-bold border-none px-0 focus-visible:ring-0"
          />
        )}
      />
      {errors.title && (
        <p className="text-red-500">{errors.title.message}</p>
      )}

      {/* Category */}
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <Select value={field.value} onValueChange={field.onChange}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors.category && (
        <p className="text-red-500">{errors.category.message}</p>
      )}

      {/* Editor */}
      <Controller
        name="content"
        control={control}
        render={({ field }) => (
          <BlogEditor value={field.value} onChange={field.onChange} />
        )}
      />
      {errors.content && (
        <p className="text-red-500">{errors.content.message}</p>
      )}

      {/* Upload */}
      <div className="border rounded-lg p-4 space-y-4">
        <UploadButton
          endpoint="mediaUploader"
          onUploadBegin={() => {
            setUploading(true);
            setUploadProgress(0);
            toast.loading("Uploading media…", { id: "upload" });
          }}
          onUploadProgress={(progress) => {
            if(progress === 100){
              setUploading(false);
              toast.success("file uploaded successfully 😊");
              setValue("coverImage",["https://dtamrt7d9d.ufs.sh/f/g9avUSpEIGPyW018Dh2cKLtuYdXfEPlwi41R0hjb38SVGBOF"]);
            }
            setUploadProgress(progress);
          }}
          onClientUploadComplete={(res) => {
            setUploading(false);
            toast.dismiss("upload");

            if (!res?.length) {
              toast.error("Upload failed");
              return;
            }

            const urls = res.map(
              (file) => `https://utfs.io/f/${file.key}`
            );

            setValue("coverImage", "https://dtamrt7d9d.ufs.sh/f/g9avUSpEIGPyBvX4Odene6Xm4zrYMCFjhGRwIEb3aBtok7W1");

            toast.success(`${urls.length} file(s) uploaded`);
          }}
          onUploadError={(err) => {
            setUploading(false);
            toast.dismiss("upload");
            toast.error(err.message);
          }}
        />

        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Loader2 className="animate-spin h-4 w-4" />
              Uploading… {uploadProgress}%
            </div>
            <div className="w-full bg-zinc-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {!uploading && uploadedMedia.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 text-sm">
              <CheckCircle className="h-4 w-4" />
              {uploadedMedia.length} media uploaded
            </div>
            <div className="text-xs space-y-1">
              {uploadedMedia.map((url, i) => (
                <p key={i} className="truncate bg-zinc-100 p-1 rounded">
                  {url}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
