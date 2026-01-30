import Link from "next/link"
import { Button } from "../ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu"
import React from 'react'
import Setting from "./Setting"
import { auth } from "@/lib/auth"

export default async function Navigation() {
    // const session = await auth()
    // if(!session?.user?.email) throw new Error("不正なリクエストです。")
  return (
    <>
        <NavigationMenu>
        <NavigationMenuList>
            <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink asChild>
                    Blog
                </NavigationMenuLink>
            </Link>
            </NavigationMenuItem>
        </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
                <Link href="/login">
                    ログイン
                </Link>
            </Button>
            <Button asChild>
                <Link href="/register">
                登録
                </Link>
            </Button>
            <Button asChild>
                <Link href="/dashboard/post/create">
                新規投稿
                </Link>
            </Button>
            <Button asChild>
                <Link href="/dashboard/edit">
                投稿編集
                </Link>
            </Button>
            {/* <Setting session={session} /> */}


        </div>
    </>
  )
}
