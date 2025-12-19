import CreateBlogForm from "@/components/blog/CreateBlogForm";
import { verifyAuth } from "@/lib/auth";
import { cookies } from "next/headers";
import { toast } from "sonner";

export default async function Page() {
  const online = await navigator.onLine
  if(online) {
    toast.error("Network status",{
      description: "it seems like you are offline please check your network",
    });
  }
    const cookiestore =  await cookies();
    const token = cookiestore.get("token")?.value;
    const user = await verifyAuth(token)
  return <div>
     <CreateBlogForm user={user}/>
  </div>;
}