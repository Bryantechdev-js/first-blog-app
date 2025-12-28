"use client";

import { Avatar, AvatarFallback } from "../ui/avatar";
import { MessageCircle, Heart, Bookmark } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { commentAction } from "@/actions/commentaction";
import z from "zod";
import { useRouter } from "next/navigation";

/* ---------------- Types ---------------- */

type Comment = {
  _id: string;
  content: string;
  author: string;
  createdAt: string;
};

type BlogDetailsProps = {
  post: {
    _id: string;
    title: string;
    content: string;
    coverImage?: string | null;
    author: {
      username: string;
    };
    createdAt: string;
    comments: Comment[];
  };
};

/* ---------------- Validation ---------------- */

const commentSchema = z.object({
  content: z.string().min(5, "Minimum 5 characters required"),
  postId: z.string(),
});

export default function Blogdetails({ post }: BlogDetailsProps) {
  const [showComments, setShowComments] = useState(false);
  // const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(commentSchema),
  });

  /* ---------------- Effects ---------------- */
  useEffect(() => {
    setValue("postId", post._id);
  }, [post._id, setValue]);

  /* ---------------- Submit Comment ---------------- */
  const onSubmit = async (data: { postId: string; content: string }) => {
    try {
      setLoading(true);
      const result = await commentAction({
        postId: data.postId,
        comment: data.content,
      });

      if (!result.success) {
        toast.error(result.error || "Failed to comment");
        return;
      }

      toast.success("Comment added");
      reset();
      router.push(`/blog/details/${post._id}`); // Refresh the page to show the new comment
    } catch (err) {
      toast.error("Failed to comment");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <article className="max-w-3xl mx-auto px-4 pt-16 pb-24">
      {/* Title */}
      <h1 className="text-4xl font-bold mb-6">{post.title}</h1>

      {/* Author */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>
              {post.author.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="font-medium">{post.author.username}</p>
            <p className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="icon" variant="ghost">
            <Heart className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowComments((v) => !v)}
          >
            <MessageCircle className="h-5 w-5" />
            <span className="ml-1 text-sm">{post?.comments.length}</span>
          </Button>

          <Button size="icon" variant="ghost">
            <Bookmark className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <Image
          src={post.coverImage}
          alt={post.title}
          width={800}
          height={400}
          className="rounded-xl mb-10 object-cover"
        />
      )}

      {/* Content */}
      <section
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Comments */}
      {showComments && (
        <div className="mt-10 space-y-4">
          {post?.comments.map((c,i) => (
            <div key={i} className="border-b pb-4">
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarFallback>
                    {c.author.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="font-medium">{c.author}</p>
                <span className="text-xs text-gray-400">
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="ml-12 mt-2">{c.content}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-2">
        <Input {...register("content")} placeholder="Write a comment…" />
        {errors.content && (
          <p className="text-sm text-red-500">{errors.content.message}</p>
        )}
        <Button type="submit" disabled={loading}>
          Comment
        </Button>
      </form>
    </article>
  );
}
