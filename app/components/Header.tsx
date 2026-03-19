import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="shadow-sm border-b border-green-600 sticky top-0 z-50 backdrop-blur-lg" style={{ backgroundColor: '#80C342' }}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <Link href="/">
          <Image 
            src="/logo.png" 
            alt="コテスポ" 
            width={140} 
            height={40}
            className="cursor-pointer hover:opacity-80 transition-opacity sm:w-[180px] sm:h-[50px]"
          />
        </Link>
        <nav className="flex gap-2 sm:gap-4">
          <Link href="/spots">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs sm:text-sm text-white hover:bg-white/20 hover:text-white"
            >
              スポット検索
            </Button>
          </Link>
          <Link href="/mypage">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs sm:text-sm text-white hover:bg-white/20 hover:text-white"
            >
              マイページ
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}