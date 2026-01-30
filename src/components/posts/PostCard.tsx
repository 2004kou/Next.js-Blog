// components/posts/PostCard.tsx
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  content: string;
};

type Props = {
  post: Post;
};

const PostCard = ({ post }: Props) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">{post.content}</p>
      </CardContent>

      <CardFooter className="flex gap-2">
        <Link href={`/employee/${post.id}`} className="text-blue-600 underline">
          Detail
        </Link>
        <Link href={`/employee/${post.id}/edit`} className="text-blue-600 underline">
          Edit
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PostCard;
