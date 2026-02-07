import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ja } from "date-fns/locale";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Params,PostDetail } from "@/types";





export default async function ShowPage({params}:Params) { 
    const session = await auth()
  const userId = session?.user?.id

  if (!session?.user?.email || !userId) {
    return <div className="text-red-500">ログインしてください</div>
  }

    const { id } = await params 
    
    const h = headers();
    const host = h.get("host")
    const protocol = process.env.NODE_ENV === "development" ? "http": "https";
    const origin = `${protocol}://${host}`;

    const res = await fetch(`${origin}/api/posts/${id}`,{cache:"no-store"});

    if(res.status === 404) notFound();
    if(res.status === 403) notFound();
    if(!res.ok) throw new Error("投稿の取得に失敗しました");

    const post: PostDetail = await res.json();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">
              投稿者：{post.author.name}
            </p>
            <time className="text-sm text-gray-500">
              {format(
                new Date(post.createdAt),
                "yyyy年MM月dd日",
                { locale: ja }
              )}
            </time>
          </div>
          <CardTitle className="text-3xl font-bold">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {post.content}
        </CardContent>
      </Card>
    </div>
  );
}
