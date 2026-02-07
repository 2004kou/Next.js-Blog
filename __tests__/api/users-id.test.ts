// __tests__/api/users-id.test.ts
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"

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

// bcrypt をモック（PUTでhashするため）
jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}))

describe("api/users/[id]", () => {
  describe("GET", () => {
    it("ユーザ情報を取得する", async () => {
      const mockUser = {
        id: "1",
        name: "テストユーザー",
        email: "test@icloud.com",
      }

      ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser)

      const request = new Request("http://localhost:3000/api/users/1")

      // ✅ mock の後に import（安定のため）
      const { GET } = await import("@/app/api/users/[id]/route")

      const res = await GET(request as any, { params: { id: "1" } })
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data).toEqual(mockUser)
    })
  })

  describe("PUT", () => {
    it("ユーザー情報を更新できる", async () => {
      // ✅ 本人としてログイン（me === params.id）
      ;(auth as jest.Mock).mockResolvedValue({ user: { id: "1" } })

      // ✅ registerSchema を通る入力（大/小/数字 + 8文字以上）
      const body = {
        name: "更新ユーザー",
        email: "update@test.com",
        password: "TestPassword1",
      }

      // ✅ findUnique が PUT 内で2回呼ばれる
      // 1回目: current（id検索） => 既存email
      // 2回目: existing（email重複チェック） => null（重複なし）
      ;(prisma.user.findUnique as jest.Mock)
        .mockResolvedValueOnce({ email: "old@test.com" })
        .mockResolvedValueOnce(null)

      // ✅ hash をモック
      const bcryptjs = require("bcryptjs")
      ;(bcryptjs.hash as jest.Mock).mockResolvedValue("hashed-password")

      // ✅ update の返り値（route.tsは select で id/name/email だけ返す）
      const updated = { id: "1", name: body.name, email: body.email }
      ;(prisma.user.update as jest.Mock).mockResolvedValue(updated)

      const request = new Request("http://localhost:3000/api/users/1", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      // ✅ mock の後に import
      const { PUT } = await import("@/app/api/users/[id]/route")

      const res = await PUT(request as any, { params: { id: "1" } })
      const data = await res.json()

      expect(res.status).toBe(200)
      expect(data).toEqual({ success: true, errors: {}, user: updated })
    })
  })
})
