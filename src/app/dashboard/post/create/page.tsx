"use client";

import { useFormState } from "react-dom";
import { savePost } from "@/lib/action"; // ※実態が投稿なら savePost に改名推奨
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function CreatePostPage() {
  const [state, formAction] = useFormState(savePost, null);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-xl font-bold mb-4">Add New Post</h1>

      <form action={formAction} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="title">タイトル</Label>
          <Input type="text" id="title" name="title" />
          <p className="text-red-500 text-sm">{state?.Error?.title?.[0]}</p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="content">内容</Label>
          <Input type="text" id="content" name="content" />
          <p className="text-red-500 text-sm">{state?.Error?.content?.[0]}</p>
        </div>

        <Button type="submit">作成</Button>

        {state?.message && (
          <p className="text-red-600 text-sm">{state.message}</p>
        )}
      </form>
    </div>
  );
}