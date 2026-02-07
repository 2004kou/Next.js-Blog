"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ActionState } from "@/types";




export default function CreatePage() {
  const router = useRouter();

  const [state, setState] = useState<ActionState>({
    success: false,
    errors: {},
  });
  const [isPending, startTransition] = useTransition();

  const errors = state.errors ?? {};

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const title = String(formData.get("title") ?? "");
    const content = String(formData.get("content") ?? "");

    startTransition(async () => {
      const res = await fetch(`/api/posts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title,content }),
        });

      const data = await res.json().catch(() => null);

  if (!res.ok) {
    setState({
      success: false,
      errors: data?.errors ?? { _form: [data?.error ?? "作成に失敗しました"] },
    });
    return;
  }

  setState({ success: true, errors: {} });
  router.push("/");
  router.refresh();
  });
  }


  
  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-xl font-bold mb-4">Add New Post</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        {errors._form?.length ? (
          <p className="text-red-500 text-sm">{errors._form.join(", ")}</p>
        ) : null}

        <div className="space-y-1">
          <Label htmlFor="title">タイトル</Label>
          <Input type="text" id="title" name="title" />
          {errors.title?.length ? (
            <p className="text-red-500 text-sm mt-1">
              {errors.title.join(", ")}
            </p>
          ) : null}
        </div>

        <div className="space-y-1">
          <Label htmlFor="content">内容</Label>
          <Input type="text" id="content" name="content" />
          {errors.content?.length ? (
            <p className="text-red-500 text-sm mt-1">
              {errors.content.join(", ")}
            </p>
          ) : null}
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "作成中..." : "作成"}
        </Button>
      </form>
    </div>
  );
}
