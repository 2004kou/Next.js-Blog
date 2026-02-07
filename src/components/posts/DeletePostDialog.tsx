"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";

type DeletePostProps = {
  postId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function DeletePostDialog({
  postId,
  isOpen,
  onOpenChange,
}: DeletePostProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onDelete = () => {
    startTransition(async () => {
      setError(null);

      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "削除に失敗しました");
        return;
      }

      onOpenChange(false);
      router.push("/");      
      router.refresh();
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>記事の削除</AlertDialogTitle>
          <AlertDialogDescription>
            この記事を削除してもよろしいでしょうか。
            <br />
            この操作は取り消せません。
          </AlertDialogDescription>

          {error ? <p className="text-sm text-red-500 mt-2">{error}</p> : null}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>キャンセル</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600"
            disabled={isPending}
          >
            {isPending ? "削除中..." : "削除する"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
