"use server"
import { redirect } from "next/navigation";
import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { signOut } from "@/lib/auth";



//ログイン機能
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials',{
        ...Object.fromEntries(formData),
        redirect:false,
    });
    redirect('/dashboard/posts/create')
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'メールアドレスまたはパスワードが正しくありません。';
        default:
          return 'エラーが発生しました。';
      }
    }
    throw error;
  }
}


//ログアウト機能
export async function logout() {
  await signOut({ redirectTo: "/login" });
}