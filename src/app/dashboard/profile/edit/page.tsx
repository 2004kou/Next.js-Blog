import EditUserForm from "@/components/auth/EditUserForm"
import { auth } from "@/lib/auth"
import { notFound } from "next/navigation"
import { headers } from "next/headers"



export default async function ProfileEditPage() {
        const session = await auth()
        const id = session?.user?.id

        if (!session?.user?.email || !id) {
          return <div className="text-red-500">ログインしてください</div>
        }
        
        const h = headers();
        const host = h.get("host");
        
        const protocol = process.env.NODE_ENV ==="development" ? "http" : "https";
        const origin = `${protocol}://${host}`;
      
        const res = await fetch(`${origin}/api/users/${id}`,{cache:"no-store"});
        if(!res.ok) throw new Error("投稿の取得に失敗しました")
        
        const user = await res.json();
    
    
      // NotFoundPage
      if (!user) {
        notFound();
      }
  return (
    <EditUserForm user={user} />
  )
}
