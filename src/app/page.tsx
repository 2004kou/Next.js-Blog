// import PostList from "@/components/posts/PostCard";
import PostList from "@/components/posts/PostCard";

export default function Home() {
  return (
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <PostList></PostList>
      </main>
  );
}
