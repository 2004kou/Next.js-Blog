// components/posts/PostList.tsx
import PostCard from "./PostCard";

type Post = {
  id: string;
  title: string;
  content: string;
};

type Props = {
  posts: Post[];
};

const PostList = ({ posts }: Props) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostList;
