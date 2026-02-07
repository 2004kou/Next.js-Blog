import EditPostForm from "@/components/posts/PostForm"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import { headers } from "next/headers"

type Params = { 
    params: {id:string}

} 

export default async function EditPage({params}:Params) {
    const session = await auth()
  const userId = session?.user?.id

  if (!session?.user?.email || !userId) {
    return <div className="text-red-500">ログインしてください</div>
  }
        
        const { id } = params;
        
        const h = headers();
        const host = h.get("host");
        const protocol = process.env.NODE_ENV ==="development" ? "http" : "https";
        const origin = `${protocol}://${host}`;
      
        const res = await fetch(`${origin}/api/posts/${id}`,{cache:"no-store"});
        if(!res.ok) throw new Error("投稿の取得に失敗しました")
        
        const post = await res.json();
    
    
      // NotFoundPage
      if (!post) {
        notFound();
      }
  return (
    <EditPostForm post={post} />
  )
}
