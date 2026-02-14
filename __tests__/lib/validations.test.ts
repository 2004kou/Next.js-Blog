import { postSchema, registerSchema,loginSchema, responseSchema } from "@/lib/validations"



describe("Validation Schemas", () => {
  describe("postSchema", () => {
    it("有効な投稿データを通す", () => {
      const validData = {
        title: "テスト投稿",
        content: "これはテスト投稿の本文です"
      }

      expect(() => postSchema.parse(validData)).not.toThrow()
    })

    it("タイトルが空の場合はエラーを返す", () => {
      const invalidData = {
        title: "",
        content: "本文"
      }

      expect(() => postSchema.parse(invalidData)).toThrow()
    })

    it("本文が空の場合はエラーを返す。", () =>{
      const invalidData = {
        title:"タイトル",
        content:""
      }
      expect(() => postSchema.parse(invalidData)).toThrow()
    } )

    it("タイトルが100文字を超える場合はエラーを返す", () =>{
      const invalidData = {
        title:"あ".repeat(101),
        content:"本文"
      }
      expect(() => postSchema.parse(invalidData)).toThrow()
    })

    it("タイトルがちょうど100文字の場合は通す", () =>{
      const validData = {
        title:"あ".repeat(100),
        content:"本文"
      }
      expect(() => postSchema.parse(validData)).not.toThrow()
    })

    it("本文が2000文字を超える場合はエラーを返す", () =>{
      const invalidData = {
        title : "タイトル",
        content :"あ".repeat(2001)
      }
      expect(() => postSchema.parse(invalidData)).toThrow()
    })
  })


  describe("registerSchema", () => {
    it("有効な登録データを通す", () => {
      const validData = {
        name: "テストユーザー",
        email: "test@example.com",
        password: "Password123"
      }

      expect(() => registerSchema.parse(validData)).not.toThrow()
    })

    it("不正なメールアドレスの場合はエラーを返す", () => {
      const invalidData = {
        name: "テストユーザー",
        email: "invalid-email",
        password: "Password123"
      }

      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    it("名前が空の場合はエラーを返す" , () =>{
      const invalidData = {
        name:"",
        email:"test@example.com",
        password:"Password123"
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    it("パスワードが8文字未満の場合はエラーを返す", () =>{
      const invalidData = {
        name:"テスト",
        email:"test@example.com",
        password:"Pass1"
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    it("パスワードに大文字がなければエラーを返す", () =>{
      const invalidData ={
        name:"テスト",
        email:"test@example.com",
        password:"password123"
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    }) 

    it("パスワードに小文字がない場合はエラーを返す", () =>{
      const invalidData = {
        name:"テスト",
        email:"test@example.com",
        password:"PASSWORD123",
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })

    it("パスワードに数字がない場合はエラーを返す" , () =>{
      const invalidData = {
        name:"テスト",
        email:"test@example.com",
        password:"Passwordabc"
      }
      expect(() => registerSchema.parse(invalidData)).toThrow()
    })
  })

  describe("loginSchema", () =>{
    it("有効なログインデータを通す", () =>{
      const validData = {
        email:"test@example.com",
        password:"Password123"
      }
      expect(() => loginSchema.parse(validData)).not.toThrow()
    })

    it("メールアドレスが空の場合はエラーを返す", () =>{
      const invalidData = {
        email: "",
        password:"Password123"
      }
      expect(() => loginSchema.parse(invalidData)).toThrow()
    })

    it("パスワードが空の場合はエラーを返す", () =>{
      const invalidData = {
        email:"test@example.com",
        password:""
      }
      expect(() => loginSchema.parse(invalidData)).toThrow()
    })
  })

  describe("responseSchema", ()  =>{
    it("有効なレスポンスデータを返す", () =>{
      const validData = {
        content:"これはレスポンスです"
      }
      expect(() => responseSchema.parse(validData)).not.toThrow()
    })

    it("本文が空の場合はエラーを返す", () =>{
      const invalidData = {
        content:""
      }
      expect(() => responseSchema.parse(invalidData)).toThrow()
    })

    it("本文が500文字を超える場合はエラーが投げられる", () => {
      const invalidData = {
        content:"あ".repeat(501)
      }
      expect(() => responseSchema.parse(invalidData)).toThrow()
    })
  })
})

