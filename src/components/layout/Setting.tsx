"use client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { logout } from "@/lib/action"

export default function Setting() {
  return (
    <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" className="font-medium">
        ...
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuItem className="cursor-pointer">
        <Link href="/dashboard/profile/edit">プロフィール編集</Link>
      </DropdownMenuItem>
      <DropdownMenuItem
          onSelect={(e) => {
            e.preventDefault();
            logout(); 
          }} >ログアウト</DropdownMenuItem>
      <DropdownMenuItem className="cursor-pointer">
        <Link href="/dashboard/profile/edit"></Link>
      </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
  )
}
