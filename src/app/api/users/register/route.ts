import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations";
import bcryptjs from "bcryptjs";
import { signIn } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json(); 

    const rawFormData = {
      name: String(body?.name ?? ""),
      email: String(body?.email ?? ""),
      password: String(body?.password ?? ""),
      confirmPassword: String(body?.confirmPassword ?? ""),
    };

    const validationResult = registerSchema.safeParse(rawFormData);
    if (!validationResult.success) {
      const { fieldErrors, formErrors } = validationResult.error.flatten();
      return NextResponse.json(
        {
          success: false,
          errors: {
            ...fieldErrors,
            ...(formErrors.length ? { _form: formErrors } : {}),
          },
        },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: rawFormData.email },
      select: { id: true },
    });
    if (existingUser) {
      return NextResponse.json(
        { success: false, errors: { email: ["このメールアドレスは既に登録されています。"] } },
        { status: 409 }
      );
    }

    const hashedPassword = await bcryptjs.hash(rawFormData.password, 12);

    await prisma.user.create({
      data: { name: rawFormData.name, email: rawFormData.email, password: hashedPassword },
    });

    await signIn("credentials", {
      email: rawFormData.email,
      password: rawFormData.password,
      redirect: false,
    });

    return NextResponse.json({ success: true, errors: {} }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { success: false, errors: { _form: ["ユーザー作成に失敗しました"] } },
      { status: 500 }
    );
  }
}

