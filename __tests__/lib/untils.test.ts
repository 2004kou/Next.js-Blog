import { cn, formatDate} from "@/lib/utils"

describe("ユーティリティ関数", () =>{
    describe("formatDate",() =>{
        it("日付文字列を渡すと文字列が返る", () =>{
            const result = formatDate("2025-01-15T10:30:00Z")
            
            expect(typeof result).toBe("string")
        })

        it("空文字を渡すとエラーにならない", () => {
            expect(() => formatDate("")).not.toThrow()

        })
    })

    describe("cn", () => {
        it("複数のクラス名を結合できる" , () => {
            const result = cn("text-red-500 bg-blue-500")

            expect(result).toBe("text-red-500 bg-blue-500")
        })

        it("重複するものは後のものが優先される", () => {
            const result = cn("text-red-500", "text-blue-500")

            expect(result).toBe("text-blue-500")
        })

        it("条件付きクラス名を扱える", () => {
            const result = cn("base", false && "hidden")

            expect(result).toBe("base")
        })
    })
})