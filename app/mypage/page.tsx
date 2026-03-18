'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, Check, BookOpen, MapPin, Clock } from 'lucide-react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

// Spot型（簡易版）
type Spot = {
  id: string
  name: string
  area: string
  station: string
  walkMinutes: number
  image: string
  lines: string[]
}

export default function MyPage() {
  const [likedSpots, setLikedSpots] = useState<string[]>([])
  const [visitedSpots, setVisitedSpots] = useState<string[]>([])
  const [stampedSpots, setStampedSpots] = useState<string[]>([])
  const [allSpots, setAllSpots] = useState<Spot[]>([])
  const [animatingStamp, setAnimatingStamp] = useState<string | null>(null)

  // データ取得
  useEffect(() => {
    // localStorageから取得
    const savedLiked = localStorage.getItem('likedSpots')
    const savedVisited = localStorage.getItem('visitedSpots')
    const savedStamped = localStorage.getItem('stampedSpots')
    
    if (savedLiked) setLikedSpots(JSON.parse(savedLiked))
    if (savedVisited) setVisitedSpots(JSON.parse(savedVisited))
    if (savedStamped) setStampedSpots(JSON.parse(savedStamped))

    // スポットデータを取得（APIから）
    fetch('/api/spots')
      .then(res => res.json())
      .then(data => setAllSpots(data))
  }, [])

  const toggleStamp = (id: string) => {
    setAnimatingStamp(id)
    setStampedSpots(prev => {
      const newStamped = prev.includes(id) ? prev.filter(spotId => spotId !== id) : [...prev, id]
      localStorage.setItem('stampedSpots', JSON.stringify(newStamped))
      return newStamped
    })
    setTimeout(() => setAnimatingStamp(null), 300)
  }

  const likedSpotsList = allSpots.filter(spot => likedSpots.includes(spot.id))
  const visitedSpotsList = allSpots.filter(spot => visitedSpots.includes(spot.id))

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10 backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <Link href="/">
            <h1 className="text-lg sm:text-2xl font-bold text-blue-600 cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap">
              🚃 子鉄スポット帳
            </h1>
          </Link>
          <nav className="flex gap-2 sm:gap-4">
            <Link href="/spots">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">スポット検索</Button>
            </Link>
            <Link href="/mypage">
              <Button variant="ghost" size="sm" className="text-xs sm:text-sm">マイページ</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">マイページ</h1>

        <Tabs defaultValue="liked" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-16 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-inner">
            <TabsTrigger 
              value="liked"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-400 data-[state=active]:to-pink-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                <span>お気に入り</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="visited"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-400 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>行った</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="stamp"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-400 data-[state=active]:to-orange-400 data-[state=active]:text-white data-[state=active]:shadow-lg rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>スタンプ帳</span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* お気に入り */}
          <TabsContent value="liked">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">お気に入りスポット（{likedSpotsList.length}件）</h2>
              </CardHeader>
              <CardContent>
                {likedSpotsList.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {likedSpotsList.map(spot => (
                      <Link key={spot.id} href={`/spot/${spot.id}`}>
                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
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
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500">お気に入りはまだありません</p>
                    <p className="text-sm text-gray-400 mt-2">スポット一覧で「いいね」を押してね</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 行った */}
          <TabsContent value="visited">
            <Card>
              <CardHeader>
                <h2 className="text-xl font-bold">行ったスポット（{visitedSpotsList.length}件）</h2>
              </CardHeader>
              <CardContent>
                {visitedSpotsList.length > 0 ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {visitedSpotsList.map(spot => (
                      <Link key={spot.id} href={`/spot/${spot.id}`}>
                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer">
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
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Check className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500">まだ行った場所がないよ！</p>
                    <p className="text-sm text-gray-400 mt-2">スポット一覧で「行った」を押してね</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* スタンプ帳 */}
          <TabsContent value="stamp">
            <Card>
              <CardHeader>
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600">{visitedSpotsList.length}こ いったよ！</p>
                </div>
              </CardHeader>
              <CardContent>
                {visitedSpotsList.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {visitedSpotsList.map(spot => (
                      <div key={spot.id} className="p-6 rounded-lg bg-yellow-50 border-2 border-yellow-200">
                        <p className="text-lg font-bold text-gray-800 mb-4 text-center">{spot.name}</p>
                        <button onClick={() => toggleStamp(spot.id)} className="w-full flex justify-center">
                          <div className={`relative w-32 h-32 transition-all duration-300 ${animatingStamp === spot.id ? 'scale-125' : 'scale-100 hover:scale-110'}`}>
                            <Image
                              src={stampedSpots.includes(spot.id) ? '/stamps/stamped.png' : '/stamps/hanko.png'}
                              alt={stampedSpots.includes(spot.id) ? 'スタンプ済み' : 'スタンプ'}
                              fill
                              className="object-contain"
                            />
                          </div>
                        </button>
                        <p className="text-center text-sm text-gray-600 mt-2">
                          {stampedSpots.includes(spot.id) ? 'スタンプ済み' : 'タップしてスタンプ'}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500">まだ行った場所がないよ！</p>
                    <p className="text-sm text-gray-400 mt-2">スポット一覧で「行った」を押してね</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}