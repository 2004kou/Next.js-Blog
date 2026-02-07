"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type EditUserFormProps = {
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type ActionState = {
  success: boolean;
  errors: Record<string, string[]>;
};

export default function EditUserForm({ user }: EditUserFormProps) {
  const router = useRouter();
  const [state, setState] = useState<ActionState>({ success: false, errors: {} });
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const errors = state.errors ?? {};

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    startTransition(async () => {
      try {
        const res = await fetch(`/api/users/${user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, confirmPassword }),
        });

        const result = (await res.json().catch(() => null)) as ActionState | null;

        if (!res.ok) {
          setState({
            success: false,
            errors: result?.errors ?? { _form: [result?.["error"] ?? "更新に失敗しました"] },
          });
          return;
        }

        setState({ success: true, errors: {} });
        router.push("/dashboard/profile"); 
        router.refresh();
      } catch (e) {
        console.error("update failed:", e);
        setState({
          success: false,
          errors: { _form: ["更新処理で例外が発生しました（console確認）"] },
        });
      }
    });
  }

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <h1 className="text-xl font-bold mb-4">プロフィール編集</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        {errors._form?.length ? (
          <p className="text-red-500 text-sm">{errors._form.join(", ")}</p>
        ) : null}

        <div className="space-y-1">
          <Label htmlFor="name">ユーザーネーム</Label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="ユーザーネームを入力してください。"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name?.length ? (
            <p className="text-red-500 text-sm mt-1">{errors.name.join(", ")}</p>
          ) : null}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="Emailを入力してください"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email?.length ? (
            <p className="text-red-500 text-sm mt-1">{errors.email.join(", ")}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">パスワード</Label>
          <Input id="password" type="password" name="password" required />
          {errors.password?.length ? (
            <p className="text-red-500 text-sm mt-1">{errors.password.join(", ")}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">パスワード（確認）</Label>
          <Input id="confirmPassword" type="password" name="confirmPassword" required />
          {errors.confirmPassword?.length ? (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.join(", ")}</p>
          ) : null}
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "更新中..." : "更新"}
        </Button>
      </form>
    </div>
  );
}
