import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50 backdrop-blur-lg bg-white/90">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <Link href="/">
          <Image 
            src="/logo.svg" 
            alt="コテスポ！" 
            width={140} 
            height={40}
            className="cursor-pointer hover:opacity-80 transition-opacity sm:w-[180px] sm:h-[50px]"
          />
        </Link>
        <nav className="flex gap-2 sm:gap-4">
          <Link href="/spots">
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
              検索
            </Button>
          </Link>
          <Link href="/mypage">
            <Button variant="ghost" size="sm" className="text-xs sm:text-sm">
              マイページ
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}