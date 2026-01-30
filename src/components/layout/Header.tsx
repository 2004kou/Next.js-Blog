import React from 'react';
import  Link from "next/link";
import Navigation from './Navigation';
export default async function Header() {
  return (
      <div className="divide-y border-gray-200 dark:border-gray-800 border-b">
      <div className="px-4 py-3 md:py-6 lg:px-6">
        <div className="flex items-center space-y-2 md:space-y-0 md:space-x-6">
          <Link href="/" className="text-2xl font-bold tracking-tighter mr-4">
            Bulletin Board
          </Link>
          <Navigation></Navigation>
        </div>
      </div>
    </div>
  )
}
