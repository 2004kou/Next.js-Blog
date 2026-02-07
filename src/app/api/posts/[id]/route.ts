import { NextRequest,NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { postSchema } from "@/lib/validations";
import { z } from "zod";


type Context = {params:{id:string}};

//詳細記事取得
export async function GET(_req: NextRequest, { params }: Context) {
  try {
    const post = await prisma.post.findFirst({
      where: {
        id: params.id,
        isDeleted: false,
        author: { isDeleted: false },
      },
      include: {
        author: { select: { id: true, name: true } },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch {
    return NextResponse.json({ error: "投稿の取得に失敗しました" }, { status: 500 });
  }
}


export async function PUT(req: NextRequest, { params }: Context) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "認証が必要です。" }, { status: 401 });
    }

    const body = await req.json();
    const validated = postSchema.parse(body);

    const existing = await prisma.post.findFirst({
      where: { id: params.id, isDeleted: false },
      select: { authorId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "投稿が見つかりません" }, { status: 404 });
    }

    if (existing.authorId !== userId) {
      return NextResponse.json({ error: "権限がありません。" }, { status: 403 });
    }

    const updated = await prisma.post.update({
      where: { id: params.id },
      data: { ...validated },
      include: { author: { select: { id: true, name: true } } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "バリデーションエラー", issues: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "投稿の更新に失敗しました。" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: NextRequest, { params }: Context) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "認証が必要です。" },
        { status: 401 }
      );
    }

    const existing = await prisma.post.findFirst({
      where: { id: params.id, isDeleted: false },
      select: { authorId: true },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "投稿が見つかりません" },
        { status: 404 }
      );
    }

    if (existing.authorId !== userId) {
      return NextResponse.json(
        { error: "権限がありません。" },
        { status: 403 }
      );
    }

    await prisma.post.update({
      where: { id: params.id },
      data: { isDeleted: true },
    });

    return NextResponse.json({ success: true });

  } catch {
    return NextResponse.json(
      { error: "投稿の削除に失敗しました。" },
      { status: 500 }
    );
  }
}


