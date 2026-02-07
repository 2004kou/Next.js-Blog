import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { registerSchema } from "@/lib/validations";
import bcryptjs from "bcryptjs";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { ActionState } from "@/types";

type Context = { params: { id: string } };


function zodToActionState(error: z.ZodError): ActionState {
  const { fieldErrors, formErrors } = error.flatten();
  return {
    success: false,
    errors: {
      ...fieldErrors,
      ...(formErrors.length ? { _form: formErrors } : {}),
    },
  };
}

export async function GET(_req: NextRequest, { params }: Context) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true, name: true, email: true }, 
    });

    if (!user) {
      return NextResponse.json(
        { success: false, errors: { _form: ["ユーザーが見つかりません。"] } } satisfies ActionState,
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json(
      { success: false, errors: { _form: ["ユーザー取得に失敗しました。"] } } satisfies ActionState,
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Context) {
  try {
    const session = await auth();
    const me = session?.user?.id;
    if (!me) {
      return NextResponse.json(
        { success: false, errors: { _form: ["認証が必要です。"] } } satisfies ActionState,
        { status: 401 }
      );
    }
    if (me !== params.id) {
      return NextResponse.json(
        { success: false, errors: { _form: ["権限がありません。"] } } satisfies ActionState,
        { status: 403 }
      );
    }

    const body = await req.json();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(zodToActionState(parsed.error), { status: 400 });
    }

    const { name, email, password } = parsed.data;

   
    const current = await prisma.user.findUnique({
      where: { id: params.id },
      select: { email: true },
    });
    if (!current) {
      return NextResponse.json(
        { success: false, errors: { _form: ["ユーザーが見つかりません。"] } } satisfies ActionState,
        { status: 404 }
      );
    }

    if(current.email !== body.email){
        if (current.email !== email) {
      const existing = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (existing) {
        return NextResponse.json(
          { success: false, errors: { email: ["このメールアドレスは既に登録されています。"] } } satisfies ActionState,
          { status: 409 }
        );
      }
    }
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const updated = await prisma.user.update({
      where: { id: params.id }, 
      data: { name, email, password: hashedPassword },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ success: true, errors: {}, user: updated });
  } catch (e) {
    // ZodError を投げてる場合にも対応
    if (e instanceof z.ZodError) {
      return NextResponse.json(zodToActionState(e), { status: 400 });
    }

    return NextResponse.json(
      { success: false, errors: { _form: ["ユーザー更新に失敗しました。"] } } satisfies ActionState,
      { status: 500 }
    );
  }
}
