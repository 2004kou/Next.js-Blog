"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";


type Draft = {
  name:string;
  email:string;
  password:string;
  confirmPassword:string;
}
const STORAGE_KEY = "register:draft"

export default function RegisterForm() {
  const router = useRouter();
  const [draft,setDraft] =useState<Draft>({
    name:"",
    email:"",
    password:"",
    confirmPassword:"",
  });

   function onConfirm(e:React.FormEvent<HTMLFormElement>){
    e.preventDefault();

    if(draft.password !== draft.confirmPassword){
      alert("二つのパスワードが一致しません");
      return;
    }
    sessionStorage.setItem(STORAGE_KEY,JSON.stringify(draft));
    router.push("/register/confirm");
   }

 


  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>ユーザー登録</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={onConfirm} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">名前</Label>
            <Input
              id="name"
              value={draft.name}
              onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              value={draft.email}
              onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">パスワード</Label>
            <Input
              id="password"
              type="password"
              value={draft.password}
              onChange={(e) =>
                setDraft((d) => ({ ...d, password: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">パスワード（確認）</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={draft.confirmPassword}
              onChange={(e) =>
                setDraft((d) => ({ ...d, confirmPassword: e.target.value }))
              }
              required
            />
          </div>

          <Button type="submit" className="w-full">
            確認画面へ
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}