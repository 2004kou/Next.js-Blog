import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { postSchema } from "@/lib/validations"
import { auth } from "@/lib/auth";
import { z } from "zod"


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const mine = searchParams.get("mine") === "1";
    
    if(mine){
      const session = await auth();
      const userId = session?.user?.id;
      
      if(!userId){
        return NextResponse.json(
          { error:"認証が必要です。"},
          { status:401}
        );
      }
      const posts = await prisma.post.findMany({
          where: {
            isDeleted: false,
            authorId:userId,
          },
          select: {
            id: true,
            title: true,
            updatedAt: true,
          },
          orderBy: { updatedAt: "desc" },
        });
        console.log(posts,"!!!")
        return NextResponse.json({ posts });
    }

    const posts = await
      prisma.post.findMany({
        where: {
          isDeleted: false,
          author: {
            isDeleted: false
          }
        },
        include: {
          author: {
            select: { id: true, name: true }
          }
        },
        orderBy: { createdAt: "desc" },
      })
     
    

    return NextResponse.json({
      posts,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "投稿の取得に失敗しました" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      )
    }
    
    
    

    const body = await request.json()
    const validatedData = postSchema.parse(body)

    const post = await prisma.post.create({
      data: {
        ...validatedData,
        authorId: userId
      },
      include: {
        author: {
          select: { id: true, name: true }
        }
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "バリデーションエラー", issues: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "投稿の作成に失敗しました" },
      { status: 500 }
    )
  }
}
