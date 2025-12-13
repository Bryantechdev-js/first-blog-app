import CreateBlogForm from "@/components/blog/CreateBlogForm";
import { verifyAuth } from "@/lib/auth";
import { cookies } from "next/dist/server/request/cookies";

export default async function Page() {
  const cookiestore = await cookies()
  const token = cookiestore.get("token")?.value;
  const user = await verifyAuth(token);


  return <div>
      <CreateBlogForm user={user}/>
  </div>;
}