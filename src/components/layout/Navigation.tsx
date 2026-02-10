import Link from "next/link"
import { Button } from "../ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu"
import React from 'react'

export default async function Navigation() {
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
                ユーザ新規登録
                </Link>
            </Button>
            <Button asChild>
                <Link href="/dashboard/posts/create">
                新規投稿
                </Link>
            </Button>
            <Button asChild>
                <Link href="/dashboard/profile">プロフィール画面</Link>
            </Button>
            


        </div>
    </>
  )
}
