"use server"
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { email, z } from "zod";
import { prisma } from "@/lib/db"
import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { postSchema } from "./validations";
import { registerSchema } from "./validations";
import bcryptjs from "bcryptjs";
import { ZodError } from "zod";

//投稿CRUD
const PostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(6),
});


export const savePost = async (prevState: any, formData: FormData) => {
  const validated = PostSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  // 失敗したらエラーを返す
  if (!validated.success) {
    return {
      Error: validated.error.flatten().fieldErrors,
    };
  }

  try {
    console.log("Success", validated.data);
    // ここでDB保存
    await prisma.post.create({
      data: {
        title: validated.data.title,
        content: validated.data.content,
        authorId: user.id,
      },
    })
  } catch (error) {
    return { message: "failed" };
  }

  revalidatePath("/");
  redirect("/");
};


//読み込み
export const getEmployeeList = async (query:string) =>{
  try{
    const posts = await prisma.post.findMany({
      select:{
        id:true,
        title:true,
        authorId:true,
        createdAt:true,
      },
      orderBy:{
        createdAt:"desc"
      },
    })
    return posts;
  }catch(error){
    throw new Error("Failed to fetch employees data")
  }
}


//Id取得
export const getPostById = async (id:string) =>{
  try{
    const postId = await prisma.post.findUnique({
      where:{id},
    });
    return postId;
  }
  catch(error){
    throw new Error("Failed to fetch contact data");
  }
}

//編集
export const updatePost = async (
  id:string,
  prevState:any,
  formData:FormData
) =>{
  const validatedFields = postSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if(!validatedFields.success){
    return {
      Error:validatedFields.error.flatten().fieldErrors,
    }
  }
  try {
    console.log("Success");
    // ここでDB保存
  } catch (error) {
    return { message: "failed" };
  }

  revalidatePath("/employee");
  redirect("/employee");
}

//削除
export const deleteEmployee = async(id:string) =>{
  try{
    await prisma.post.delete({
      where:{id},
    });
  } catch(error){
    return {message:"Failed to delete employee"};
  }
}


//ユーザー作成
type ActionState = {
  success: boolean;
  errors: Record<string, string[]>;
};

//バリデーションエラー
function handleValidationError(errors: ZodError): ActionState {
  const { fieldErrors, formErrors } = errors.flatten();
  const castedFieldErrors = fieldErrors as Record<string,string[]>;
  //zotの仕様でパスワード一致確認のエラーはformErrorで帰ってくる
//formErrorsがある場合はconfirmPasswordフィールドエラーを追加
  if (formErrors.length > 0) {
    return { success: false, errors: { ...fieldErrors, confirmPassword: formErrors } };
  }
  return { success: false, errors: castedFieldErrors };
}

//カスタムエラー処理
function handleError(customErrors: Record<string, string[]>): ActionState {
  return { success: false, errors: customErrors };
}

export async function createUser(prevState: ActionState, formData: FormData): Promise<ActionState> {
  const rawFormData = Object.fromEntries(
    ["name", "email", "password", "confirmPassword"].map((field) => [
      field,
      String(formData.get(field) ?? ""),
    ])
  ) as Record<string, string>;

  const validationResult = registerSchema.safeParse(rawFormData);
  if (!validationResult.success) return handleValidationError(validationResult.error);

  const existingUser = await prisma.user.findUnique({
    where: { email: rawFormData.email },
    select: { id: true },
  });
  if (existingUser) return handleError({ email: ["このメールアドレスは既に登録されています。"] });

  const hashedPassword = await bcryptjs.hash(rawFormData.password, 12);

  await prisma.user.create({
    data: { name: rawFormData.name, email: rawFormData.email, password: hashedPassword },
  });

  await signIn("credentials", {
    email: rawFormData.email,
    password: rawFormData.password,
    redirect: false,
  });

  redirect("/dashboard");
}



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
    redirect('/dashboard')
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