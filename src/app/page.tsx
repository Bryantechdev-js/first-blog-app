import { getBlogPostAction } from "@/actions/getPostAction";
import HomeCompunent from "@/components/HomeCompunent";


export default async function Home() {
   const posts = await getBlogPostAction()
  return (
   <main>
      <h1 className="text-2xl">Welcome to blogy</h1>
      <HomeCompunent post={posts?.posts}/>
   </main>
  );
}
