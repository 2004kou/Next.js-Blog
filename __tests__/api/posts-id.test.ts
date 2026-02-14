import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"


jest.mock("@/lib/db" , () => ({
  prisma: {
    post: {
      findFirst: jest.fn(),
      update:jest.fn(),
    },
  },
}))

jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}))


describe("/api/[id]/posts", () => {
  //各テストの前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe("GET", () => {
    it("投稿の詳細を正常に取得する", async () =>{
      const mockPosts = {
          id:"1",
          title:"テスト投稿",
          content:"テスト内容",
          author: {id:"1", name:"テストユーザー"},
        }
        ;(prisma.post.findFirst as jest.Mock).mockResolvedValue(mockPosts)

        const request = new Request("http://localhost:3000/api/posts/1")

        const { GET } = await import("@/app/api/posts/[id]/route")

        //第2引数にparamsを渡す
        const res = await GET(request as any, { params:{ id:"1"}})
        const data = await res.json()

        expect(res.status).toBe(200)
        expect(data).toEqual(mockPosts)
    })

    it("存在しない投稿なら404を返す", async() => {
      const mockPosts = null
      ;(prisma.post.findFirst as jest.Mock).mockResolvedValue(mockPosts)

      const request = new Request("http://localhost:3000/api/[id]/posts")

      const  { GET }  = await import("@/app/api/posts/[id]/route")

      const response = await GET(request as any, { params:{ id:"1"}})
      const data = await response.json()

      expect(response.status).toBe(404)
    })
  })

  describe("POST /api/posts", () => {
    //各テストの前にモックをリセット
  beforeEach(() => {
    jest.clearAllMocks()
  })

    it("投稿を正常に更新できる", async () => {
      //認証状態をモック
      ;(auth as jest.Mock).mockResolvedValue({ user:{ id: "1"}})

      //既存の投稿の検索結果をモック
      ;(prisma.post.findFirst as jest.Mock).mockResolvedValue({ authorId:"1"})

      //更新する内容をモック
      const updataPost = {
        id:"1",
        title:"更新タイトル",
        content:"更新内容",
        author:{ id: "1", name:"テストユーザー"},
      }
      ;(prisma.post.update as jest.Mock).mockResolvedValue(updataPost)

      //PUTリクエストを作成
      const request = new Request("http://localhost:3000/api/posts/1",
        {
          method:"PUT",
          headers:{ "Content-Type" : "application/json"},
          body:JSON.stringify({title:"更新タイトル",content:"更新内容"}),
        })
        const { PUT } = await import("@/app/api/posts/[id]/route")
        const res = await PUT(request as any,{ params: {id:"1"}})

        expect(res.status).toBe(200)
    })

    it("未認証の場合は401を返す", async () => {
      ;(auth as jest.Mock).mockResolvedValue(null)

      const request = new Request("http://localhost:3000/api/posts/1",
        {
          method:"PUT",
          headers:{ "Content-Type" : "application/json"},
          body:JSON.stringify({title:"更新タイトル",content:"更新内容"}),
        })

        const { PUT } = await import("@/app/api/posts/[id]/route")
        const res = await PUT(request as any,{ params: {id:"1"}})

        expect(res.status).toBe(401)
    })

    it("他人の投稿を更新しようとすると403を返す", async () => {
      //認証状態をモック
      ;(auth as jest.Mock).mockResolvedValue({ user: {id:"1"}})

      //既存の投稿の検索結果をモック
      ;(prisma.post.findFirst as jest.Mock).mockResolvedValue({ authorId:"999"})

      //更新する内容をモック
      const updataPost = {
        id : "1",
        title : "更新タイトル",
        content: "更新内容",
        author:{ id :"1", name:"テストユーザー"},
      }
      ;(prisma.post.update as jest.Mock).mockResolvedValue(updataPost)

      //PUTリクエストを作成
      const request = new Request("http://localhost:3000/api/posts/1",
        {
          method:"PUT",
          headers:{ "Content-Type" : "application/json"},
          body:JSON.stringify({title:"更新タイトル",content:"更新内容"}),
        })
        const { PUT } = await import("@/app/api/posts/[id]/route")
        const res = await PUT(request as any,{ params: {id:"1"}})

        expect(res.status).toBe(403)
        expect(prisma.post.update).not.toHaveBeenCalled()
    })

    it("存在しない投稿を更新しようとすると404を返す", async () => {
      //認証状態をモック
      ;(auth as jest.Mock).mockResolvedValue({ user: { id :"1"}})

      //nullを取得
      ;(prisma.post.findFirst as jest.Mock).mockResolvedValue(null)

      //更新する内容をモック
      const updataPost = {
        id : "1",
        title : "更新タイトル",
        content : "更新内容",
        author:{ id : "1", name : "テストユーザー"},
      }
      ;(prisma.post.update as jest.Mock).mockResolvedValue(updataPost)

      //PUTリクエストを作成
        const request = new Request("http://localhost:3000/api/posts/1",
          {
            method:"PUT",
            headers:{ "Content-Type" : "application/json"},
            body:JSON.stringify({title:"更新タイトル",content:"更新内容"}),
          })
        const { PUT } = await import("@/app/api/posts/[id]/route")
        const res = await PUT(request as any,{ params: {id:"1"}})

        expect(res.status).toBe(404)
        expect(prisma.post.update).not.toHaveBeenCalled()


    })
  })


  describe("DELETE /api/posts", () => {
     //各テストの前にモックをリセット
      beforeEach(() => {
        jest.clearAllMocks()
      })

      it("投稿を正常に削除できる", async () =>{
        //認証状態をモック
        ;(auth as jest.Mock).mockResolvedValue({ user : { id : "1"}})

        //既存の投稿の検索結果をモック
        ;(prisma.post.findFirst as jest.Mock).mockResolvedValue({ authorId : "1"})

        //DELETEリクエストを作成
        const request = new Request("http://localhost:3000/api/posts/1",{
          method:"DELETE"
        })
        const { DELETE } = await import("@/app/api/posts/[id]/route")
        const res = await DELETE(request as any , { params : { id : "1"}})

        expect(res.status).toBe(200)
        expect(prisma.post.update).toHaveBeenCalledWith({
                where: { id: "1" },
                data: { isDeleted: true },
              })

      })

      it("未認証の場合は401をかえす", async () => {
        ;(auth as jest.Mock).mockResolvedValue(null)

        const request = new Request("http://localhost:3000/api/posts/1",{
          method : "DELETE",
        })

        const { DELETE } = await import("@/app/api/posts/[id]/route")
        const res = await DELETE(request as any,{ params : { id : "1"}})

        expect(res.status).toBe(401)

      })


      it("他人の投稿を削除しようとすると403を返す", async () => {
        ;(auth as jest.Mock).mockResolvedValue({ user: { id : "1"}})

        ;(prisma.post.findFirst as jest.Mock).mockResolvedValue({ authorId : "999"})

        const request = new Request("http://localhost:3000/api/posts/1",{
          method:"DELETE"
        })
        const { DELETE } = await import("@/app/api/posts/[id]/route")
        const res = await DELETE(request as any , { params : { id : "1"}})

        expect(res.status).toBe(403)
      })


  })
})