"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { createUser } from "@/lib/action";

type ActionState = {
  success: boolean;
  errors: Record<string, string[]>;
};

const initialState: ActionState = { success: false, errors: {} };

export default function RegisterForm() {
  const [state, setState] = useState<ActionState>(initialState);
  const [isPending, startTransition] = useTransition();

  const errors = state?.errors ?? {}; // ← これが重要（落ちない）

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const result = await createUser(initialState, formData);

      // result が壊れてても落ちないように保険
      setState({
        success: Boolean(result?.success),
        errors: (result as any)?.errors ?? {},
      });
    });
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>ユーザー登録</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input id="name" type="text" name="name" required />
            {errors.name?.length ? (
              <p className="text-red-500 text-sm mt-1">{errors.name.join(", ")}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input id="email" type="email" name="email" required />
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
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.join(", ")}
              </p>
            ) : null}
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "登録中..." : "登録"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
