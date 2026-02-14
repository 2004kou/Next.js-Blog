import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { email } from "zod"

// prisma をモック
jest.mock("@/lib/db", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}))

// auth をモック
jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}))

// bcrypt をモック
jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}))

describe("api/users/[id]", () => {
  describe("GET", () => {
    //各テストの前にモックをリセット
      beforeEach(() => {
        jest.clearAllMocks()
      })
    it("ユーザ情報を取得する", async () => {
      const mockUser = {
        id: "1",
        name: "テストユーザー",
        email: "test@icloud.com",
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

      const request = new Request("http://localhost:3000/api/1/users")

      //  mock の後に import（安定のため）
      const { GET } = await import("@/app/api/users/[id]/route")

      const res = await GET(request as any, { params: { id: "1" } })
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data).toEqual(mockUser)
    })

    it("存在しないユーザーの場合は404を返す", async () => {
      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
      
      const request = new Request("http://localhost:3000/api/1/users")
      const { GET } = await import("@/app/api/users/[id]/route")

      const res = await GET(request as any, { params:{ id:"1"}})
      const data = await res.json()

      expect(res.status).toBe(404)
    })
  })

  describe("PUT", () => {
    //各テストの前にモックをリセット
      beforeEach(() => {
        jest.clearAllMocks()
      })
    it("ユーザー情報を更新できる", async () => {

      // 本人としてログイン（me === params.id）
      ;(auth as jest.Mock).mockResolvedValue({ user: { id: "1" } })

      //  registerSchema を通る入力（大/小/数字 + 8文字以上）
      const body = {
        name: "更新ユーザー",
        email: "update@test.com",
        password: "TestPassword1",
      }

      //  findUnique が PUT 内で2回呼ばれる
      // 1回目: current（id検索） => 既存email
      // 2回目: existing（email重複チェック） => null（重複なし）
      ;(prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce({ email: "old@test.com" })
        .mockResolvedValueOnce(null)

      //  hash をモック
      const bcryptjs = require("bcryptjs")
      ;(bcryptjs.hash as jest.Mock).mockResolvedValue("hashed-password")

      //  update の返り値（route.tsは select で id/name/email だけ返す）
      const updated = { id: "1", name: body.name, email: body.email }
      ;(prisma.user.update as jest.Mock).mockResolvedValue(updated)

      const request = new Request("http://localhost:3000/api/1/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      //  mock の後に import
      const { PUT } = await import("@/app/api/users/[id]/route")

      const res = await PUT(request as any, { params: { id: "1" } })
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data).toEqual({ success: true, errors: {}, user: updated })
    })

    it("未認証の場合は401を返す", async () => {
      ;(auth as jest.Mock).mockResolvedValue(null)

      const body = {
        name: "更新ユーザー",
        email: "update@test.com",
        password: "Password123",
      }

      const request = new Request("http://localhost:3000/api/1/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      const { PUT } = await import("@/app/api/users/[id]/route")

      const res = await PUT(request as any, { params: { id: "1" } })
      const data = await res.json()

      expect(res.status).toBe(401)
    })

    it("他人の情報を更新しようとすると403を返す", async () => {
      //自分のIDは1　　更新しようとしているのは999
      ;(auth as jest.Mock).mockResolvedValue({ user: {id : "1"}})

      const request = new Request("http:localhost:3000/api/users/999",{
        method: "PUT",
        headers: { "Content-Type" : "application/json" },
        body: JSON.stringify({
          name : "テスト",
          email : "test@example.com",
          password : "Password123",
        })
      })

      const { PUT } = await import("@/app/api/users/[id]/route")

      //params.idを999(他人)にする
      const res = await PUT(request as any, { params:{ id : "999"}})

      expect(res.status).toBe(403)
    })
  })
})
