import { prisma } from "@/lib/db"
import { signIn } from "@/lib/auth"

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}))

jest.mock("@/lib/auth", () => ({
  signIn: jest.fn(),
}))

jest.mock("@/lib/db", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

describe("POST /api/users/register", () => {
  it("ユーザーを作成できる", async () => {
    ;(prisma.user.findUnique as jest.Mock).mockResolvedValue(null)
    ;(prisma.user.create as jest.Mock).mockResolvedValue({ id: "1" })

    const bcryptjs = require("bcryptjs")
    ;(bcryptjs.hash as jest.Mock).mockResolvedValue("hashed-password")

    ;(signIn as jest.Mock).mockResolvedValue(undefined)

    const request = new Request("http://localhost:3000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "test",
        email: "test@test.com",
        password: "TestPassword1",         
        confirmPassword: "TestPassword1",  
      }),
    })

    const { POST } = await import("@/app/api/users/register/route") 
    const res = await POST(request)

    expect(res.status).toBe(201)
  })
})
