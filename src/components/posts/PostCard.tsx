import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

export type Post = {
    id:string 
    title:string
    content:string
    createdAt:string
    author:{
        name: string
    }
}
export type PostCardProps = {post: Post}

const PostCard = ({ post }: PostCardProps) => {
  
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <Link href={`/dashboard/posts/${post.id}`}>
      <CardHeader>
        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">{post.content}</p>
        <div className="flex items-center justify-between text-sm text-grey-500">
          <span>{post.author.name}</span>
          <time >
            {formatDistanceToNow(new Date(post.createdAt),{
              addSuffix:true,
              locale: ja})}</time>
        </div>
      </CardContent>
      </Link>
    </Card>
  );
};

export default PostCard;
