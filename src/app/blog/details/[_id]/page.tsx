// app/blog/details/[id]/page.tsx
import { getDetailedBlogPost } from "@/actions/getDetailedBlog";
import Blogdetails from "@/components/blog/Blogdetails";
import { Suspense } from "react";

export default async function Page({ params }: { params: { _id: string } }) {
  const {_id} = await params;
  const result = await getDetailedBlogPost(_id);


  if (!result.success) {
    return <p className="text-red-500">{result.error}</p>;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Blogdetails post={result.post} />
    </Suspense>
  );
}
