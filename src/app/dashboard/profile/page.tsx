import { auth } from "@/lib/auth";
import Setting from "@/components/layout/Setting";
import { headers } from "next/headers";


export default async function ProfilePage() {
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
  
  return (
    <div className="p-4">
        <div className="flex justify-between ">
            <h1 className="text-2xl font-bold mb-4">
                    プロフィール画面
            </h1>
        </div>
        <table className="table-auto w-full border-collapse border">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border p-2 text-center">ユーザネーム</th>
                    <th className="border p-2 text-center">email</th>
                    <th className="border p-2 text-center">編集</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td className="border p-2 text-center">{user?.name}</td>
                    <td className="border p-2 text-center">{user?.email}</td>
                    <td className="border p-2 text-center"><Setting /></td>                    
                </tr>

            </tbody>
        </table>
        
    </div>
  )
}