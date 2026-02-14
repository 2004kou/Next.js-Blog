import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"


jest.mock("@/lib/db", () => ({
  prisma: {
    post: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))

jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}))

describe("/api/posts", () => {
  //各テストの前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET", () => {
    it("投稿一覧を正常に取得する", async () => {
      const mockPosts = [
        {
          id: "1",
          title: "テスト投稿",
          content: "テスト内容",
          author: { id: "1", name: "テストユーザー" }, 
        },
      ]
      ;(prisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts)

      const request = new Request("http://localhost:3000/api/posts")

      const { GET } = await import("@/app/api/posts/route")

      const response = await GET(request as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toEqual(mockPosts)
    })

    it("投稿が0件の場合はから配列を返す", async() => {
      const mockPosts:any[] = []
      ;(prisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts)

      const request = new Request("http://localhost:3000/api/posts")

      const { GET }  = await import("@/app/api/posts/route")

      const response = await GET(request as any)
      const data = await response.json()

      expect(response.status).toBe(200)
      console.log(data)
      expect(data.posts).toEqual([])
    })


  })
})

describe("POST /api/posts", () => {
  //各テストの前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks()
  })
  it("投稿を作成できる", async () => {
    ;(auth as jest.Mock).mockResolvedValue({ user: { id: "1" } }) 

    ;(prisma.post.create as jest.Mock).mockResolvedValue({ id: "1" })

    const request = new Request("http://localhost:3000/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "テスト投稿",
        content: "テスト内容",
      }),
    })

    const { POST } = await import("@/app/api/posts/route")


    const res = await POST(request as any)
    expect(auth).toHaveBeenCalled()
    expect(res.status).toBe(201)
  })

  it("未認証の場合は401を返す", async () =>{
    (auth as jest.Mock).mockResolvedValue(null)

    const request = new Request("http://localhost:3000/api/posts", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({title:"テスト",content:"テスト"}),


    })

    const { POST } = await import("@/app/api/posts/route")
    const res = await POST(request as any)

    expect(res.status).toBe(401)
  })
})
