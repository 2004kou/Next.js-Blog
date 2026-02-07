"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ActionState } from "@/types";

type Draft = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};


const STORAGE_KEY = "register:draft";
const initialState: ActionState = { success: false, errors: {} };

export default function RegisterForm() {
  const router = useRouter();

  const [draft, setDraft] = useState<Draft | null>(null);
  const [state, setState] = useState<ActionState>(initialState);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);

    if (!raw) {
      router.replace("/register");
      return;
    }

    try {
      setDraft(JSON.parse(raw) as Draft);
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
      router.replace("/register");
    }
  }, [router]);
        
   

  const body = useMemo(() => {
    if (!draft) return null;
    return{
    "name": draft.name,
    "email":draft.email,
    "password": draft.password,
    "confirmPassword": draft.confirmPassword,
  }
  }, [draft]);

  const errors = state.errors ?? {};

  function onSubmitFinal() {
    if (!body) return;
    startTransition(async () => {
      const res = await fetch(`/api/users/register`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        cache:"no-store",
        body:JSON.stringify(body),
      });

      const result = (await res.json().catch(() =>null)) as ActionState | null;

      setState({
        success: Boolean(result?.success),
        errors: (result as any)?.errors ?? {},
      });

      if (result?.success) {
        sessionStorage.removeItem(STORAGE_KEY);
        router.push("/");
      }
    });
  }

  if (!draft) return null;

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>入力内容の確認</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-sm space-y-2">
          <div>
            <span className="font-medium">名前：</span>
            {draft.name}
          </div>
          <div>
            <span className="font-medium">メール：</span>
            {draft.email}
          </div>
          <div>
            <span className="font-medium">パスワード：</span>
            {"●".repeat(Math.min(draft.password.length, 12))}
          </div>
        </div>

        {errors._form?.length ? (
          <p className="text-red-500 text-sm">{errors._form.join(", ")}</p>
        ) : null}

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => router.push("/register")}
            disabled={isPending}
          >
            戻る
          </Button>

          <Button
            type="button"
            className="w-full"
            onClick={onSubmitFinal}
            disabled={isPending}
          >
            {isPending ? "登録中..." : "登録する"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
