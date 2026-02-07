"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ActionState } from "@/types";

type EditPostFormProps = {
  post: {
    id: string;
    title: string;
    content: string;
  };
};



export default function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter();

  const [state, setState] = useState<ActionState>({
    success: false,
    errors: {},
  });
  const [isPending, startTransition] = useTransition();

  const errors = state.errors ?? {};

  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    startTransition(async () => {
      setState({ success: false, errors: {} });

      const res = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setState({
          success: false,
          errors: { _form: [data?.error ?? "更新に失敗しました"] },
        });
        return;
      }

      setState({ success: true, errors: {} });
      router.push(`/dashboard/posts/${post.id}`);
      router.refresh();
    });
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-xl font-bold mb-4">投稿編集</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        {errors._form?.length ? (
          <p className="text-red-500 text-sm">{errors._form.join(", ")}</p>
        ) : null}

        <div className="space-y-1">
          <Label htmlFor="title">タイトル</Label>
          <Input
            id="title"
            name="title"
            value={title}                    
            onChange={(e) => setTitle(e.target.value)}
          />
          {errors.title?.length ? (
            <p className="text-red-500 text-sm mt-1">{errors.title.join(", ")}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <Label htmlFor="content">内容</Label>
          <Input
            id="content"
            name="content"
            value={content}                  
            onChange={(e) => setContent(e.target.value)}
          />
          {errors.content?.length ? (
            <p className="text-red-500 text-sm mt-1">{errors.content.join(", ")}</p>
          ) : null}
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "更新中..." : "更新"}
        </Button>
      </form>
    </div>
  );
}
