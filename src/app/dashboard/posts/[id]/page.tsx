
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
import { Params,PostDetail } from "@/types";
import Link from "next/link"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DeletePostDialog from "@/components/posts/DeletePostDialog"
import { Button } from "@/components/ui/button";




export default async function ShowPage({params}:Params) {  
   
    const session = await auth()
    const userId = session?.user?.id

    const { id } = await params 
    

    const res = await fetch(`http://localhost:3000/api/posts/${id}`,{cache:"no-store"});
    if(res.status === 404) notFound();
    if(res.status === 403) notFound();
    if(!res.ok) throw new Error("投稿の取得に失敗しました");

    const post: PostDetail = await res.json();

    
    

    const PostAuthor :boolean = userId === post.author.id
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
          <div>
              {PostAuthor &&(
                <ul className="flex mt-4">
                  <li><Button><Link href={`/dashboard/posts/${id}/edit`} className="cursor-pointer">編集</Link></Button></li>
                  <li className="ml-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive">削除</Button>
                      </DialogTrigger>

                      <DialogContent>
                        ほんとうに削除しますか？
                        <DeletePostDialog postId = {post.id} />
                      </DialogContent>
                    </Dialog>
                </li>
              </ul>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
