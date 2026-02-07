import  PostList  from "@/components/posts/PostList";
import { headers } from "next/headers"

export default async function Home() {
  const h = headers();
  const host = h.get("host");
  const protocol = process.env.NODE_ENV ==="development" ? "http" : "https";
  const origin = `${protocol}://${host}`;

  const res = await fetch(`${origin}/api/posts`,{cache:"no-store"});
  if(!res.ok) throw new Error("投稿の取得に失敗しました")
  
  const data = await res.json();
  const posts = data.posts ?? data;
  return (
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <PostList posts={posts}></PostList>
        
      </main>
  );
}
