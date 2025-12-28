"use client";

import React, { useState } from "react";
import { LayoutGrid, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CATEGORIES } from "@/components/blog/CreateBlogForm";
import { useRouter } from "next/navigation";
import Link from "next/link";
// import Image from "next/image";

type Post = {
  _id: string;
  title: string;
  coverImage?: string | null;
  author: string;
  category: string;
  createdAt: string;
};

type HomeComponentProps = {
  post: Post[];
};

export default function HomeComponent({ post }: HomeComponentProps) {
  const [isGridView, setIsGridView] = useState(false);
  const [searchKey,setSearchKey] = useState<string>("");
  const posts = searchKey != "" ? post.filter(post => post?.title == searchKey || post?.category == searchKey) : post;
  
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900">All Blogs</h2>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">View</span>
          <Button
            variant="ghost"
            size="icon"
            className={!isGridView ? "bg-gray-100" : ""}
            onClick={() => setIsGridView(false)}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={isGridView ? "bg-gray-100" : ""}
            onClick={() => setIsGridView(true)}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Blog list */}
        <section className="w-full lg:w-8/12">
          <div
            className={
              isGridView
                ? "grid grid-cols-1 sm:grid-cols-2 gap-6"
                : "space-y-8"
            }
          >
            {posts?.map((item) => (
                <Link href={`/blog/details/${item?._id}`} key={item?._id}>
                    <article
                        className={`group bg-white rounded-xl border hover:shadow-lg transition overflow-hidden cursor-pointer ${
                        isGridView ? "flex flex-col" : "flex gap-6"
                        }`}
                    >
                        {/* Image */}
                        <div
                        className={`relative ${
                            isGridView ? "h-48 w-full" : "w-1/3 h-44"
                        }`}
                        >
                        <img
                            src={
                            item.coverImage ??
                            "https://images.unsplash.com/photo-1519389950473-47ba0277781c"
                            }
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-5 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:underline">
                            {item.title}
                            </h3>

                            <p className="text-sm text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                        </div>

                        {/* Author */}
                        <div className="flex items-center gap-3 mt-4">
                            <Avatar className="h-8 w-8">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>
                                {item.author?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-gray-700">
                            {item.author}
                            </span>
                        </div>
                        </div>
                    </article>
                </Link>
            ))}
          </div>
        </section>

        {/* Sidebar */}
        <aside className="w-full lg:w-4/12">
          <div className="sticky top-28 space-y-10">
            {/* Categories */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold mb-4">
                Recommended Categories
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {CATEGORIES.map((category) => (
                  <span
                    key={category}
                    className="text-sm px-3 py-2 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer text-center"
                   onClick={()=> setSearchKey(category)}>
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Latest Posts */}
            <div className="bg-white rounded-xl border p-6">
              <h3 className="text-lg font-semibold mb-4">Latest Posts</h3>

              <div className="space-y-4">
                {post?.slice(0, 4).map((item,i) => (
                    <div
                    
                    className="text-sm text-gray-700 hover:underline cursor-pointer"
                    key={i} onClick={()=> setSearchKey(item?.title)}>
                    {item.title}
                    <div className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                    
               
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
