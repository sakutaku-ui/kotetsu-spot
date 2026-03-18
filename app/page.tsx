'use client'

import { useState, useEffect } from 'react'
import { getApprovedSpots } from '@/app/data/spots'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, TrendingUp, Sparkles, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  const [allSpots, setAllSpots] = useState<any[]>([])
  const [likedCount, setLikedCount] = useState(0)
  const [visitedCount, setVisitedCount] = useState(0)
  const [stampedCount, setStampedCount] = useState(0)

  useEffect(() => {
    // データ取得
    async function loadData() {
      const spots = await getApprovedSpots()
      setAllSpots(spots)
    }
    
    // localStorageから取得
    const savedLiked = localStorage.getItem('likedSpots')
    const savedVisited = localStorage.getItem('visitedSpots')
    const savedStamped = localStorage.getItem('stampedSpots')
    
    if (savedLiked) setLikedCount(JSON.parse(savedLiked).length)
    if (savedVisited) setVisitedCount(JSON.parse(savedVisited).length)
    if (savedStamped) setStampedCount(JSON.parse(savedStamped).length)
    
    loadData()
  }, [])
  
  // 人気スポット（最初の6件）
  const popularSpots = allSpots.slice(0, 6)
  
  // 新着スポット（作成日順で最新6件）
  const newSpots = [...allSpots]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)
  
  // エリア一覧
  const areas = Array.from(new Set(allSpots.map(spot => spot.area)))

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50 backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Image 
              src="/logo.png" 
              alt="" 
              width={180} 
              height={50}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              priority
            />
          </Link>

          <nav className="flex gap-2 sm:gap-4">
            <Link href="/spots">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">検索</Button>
            </Link>
            <Link href="/mypage">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">マイページ</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              親子で楽しむ<br />電車観察スポット
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 max-w-2xl mx-auto">
              子供と一緒に電車を見られる安全なスポットを見つけよう
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/spots">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6">
                  <Sparkles className="w-5 h-5 mr-2" />
                  スポットを探す
                </Button>
              </Link>
              <Link href="#areas">
                <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6">
                  エリアから探す
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* 統計情報 */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-bold">{likedCount}</div>
              <div className="text-blue-100 mt-1">いいね</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-bold">{visitedCount}</div>
              <div className="text-blue-100 mt-1">行った</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="text-4xl font-bold">{stampedCount}</div>
              <div className="text-blue-100 mt-1">スタンプ</div>
            </div>
          </div>
        </div>
      </section>

      {/* 人気スポット */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold">人気のスポット</h2>
          </div>
          <Link href="/spots">
            <Button variant="ghost">
              すべて見る
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularSpots.map((spot) => (
            <Link key={spot.id} href={`/spot/${spot.id}`}>
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
                <div className="relative aspect-video overflow-hidden bg-gray-100">
                  <Image
                    src={spot.image}
                    alt={spot.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 border-0">
                      {spot.area}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {spot.name}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>{spot.station}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>徒歩{spot.walkMinutes}分</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-4">
                    {spot.lines.slice(0, 3).map((line: string, idx: number) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {line}
                      </Badge>
                    ))}
                    {spot.lines.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{spot.lines.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* 新着スポット */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold">新着スポット</h2>
            </div>
            <Link href="/spots">
              <Button variant="ghost">
                すべて見る
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newSpots.map((spot) => (
              <Link key={spot.id} href={`/spot/${spot.id}`}>
                <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <Image
                      src={spot.image}
                      alt={spot.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-purple-500 text-white border-0">
                        NEW
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 backdrop-blur-sm text-gray-800 border-0">
                        {spot.area}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {spot.name}
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-purple-500" />
                        <span>{spot.station}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4 text-purple-500" />
                        <span>徒歩{spot.walkMinutes}分</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-4">
                      {spot.lines.slice(0, 3).map((line: string, idx: number) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {line}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* エリア一覧 */}
      <section id="areas" className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">エリアから探す</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((area) => {
            const count = allSpots.filter(s => s.area === area).length
            return (
              <Link key={area} href={`/spots?area=${area}`}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-xl group-hover:text-blue-600 transition-colors">
                          {area}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {count}件のスポット
                        </p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="font-bold text-lg mb-4">子鉄スポット帳</h3>
              <p className="text-gray-400 text-sm">
                親子で安心して電車を楽しめるスポット情報
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">サイト情報</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">このサイトについて</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2024 子鉄スポット帳. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}