import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDate = (dateStr:string) =>{
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) return ""
    
    const formatter = new Intl.DateTimeFormat("id-ID",{
        dateStyle:"medium",
        timeStyle:"short"
    });
    return formatter.format(date);
}