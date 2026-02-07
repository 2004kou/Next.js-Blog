import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import PostDropdownMenu from "@/components/posts/PostDropdownMenu";
import Link from "next/link";
import { cookies } from "next/headers";

type MinePost = {
  id: string;
  title: string;
  updatedAt: string;
};

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id

  if (!session?.user?.email || !userId) {
    return <div className="text-red-500">ログインしてください</div>
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!baseUrl) throw new Error("NEXT_PUBLIC_APP_URL が未設定です");

  const cookieHeader = cookies().toString();

  const res = await fetch(`${baseUrl}/api/posts?mine=1`, {
    cache: "no-store",
    headers: {
      cookie: cookieHeader, 
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`投稿の取得に失敗しました: ${res.status} ${text}`);
  }

  const data = await res.json();
  const posts: MinePost[] = data.posts ?? [];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">ダッシュボード</h1>

        <Button asChild>
          <Link href="/dashboard/posts/create">新規記事作成</Link>
        </Button>
      </div>

      <table className="table-auto w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-center">タイトル</th>
            <th className="border p-2 text-center">更新日</th>
            <th className="border p-2 text-center">操作</th>
          </tr>
        </thead>

        <tbody>
          {posts.length === 0 ? (
            <tr>
              <td className="border p-2 text-center" colSpan={3}>
                投稿がありません
              </td>
            </tr>
          ) : (
            posts.map((post) => (
              <tr key={post.id}>
                <td className="border p-2">{post.title}</td>
                <td className="border p-2 text-center">
                  {new Date(post.updatedAt).toLocaleString()}
                </td>
                <td className="border p-2 text-center">
                  <PostDropdownMenu postId={post.id} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
