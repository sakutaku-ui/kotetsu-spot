'use client'

import { use, useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  MapPin, 
  Clock, 
  Tag, 
  Shield, 
  Navigation,
  Train,
  Heart,
  Check,
  Store
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Spot } from '@/app/data/schema'
import { ImageSlider } from '@/app/components/ImageSlider'

export default function SpotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [spot, setSpot] = useState<Spot | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isVisited, setIsVisited] = useState(false)

  useEffect(() => {
    // スポットデータを取得
    async function loadSpot() {
      const response = await fetch(`/api/spots/${id}`)
      const data = await response.json()
      setSpot(data)
    }
    
    // いいね・行った状態を取得
    const savedLiked = localStorage.getItem('likedSpots')
    const savedVisited = localStorage.getItem('visitedSpots')
    
    if (savedLiked) {
      const liked = JSON.parse(savedLiked)
      setIsLiked(liked.includes(id))
    }
    if (savedVisited) {
      const visited = JSON.parse(savedVisited)
      setIsVisited(visited.includes(id))
    }
    
    loadSpot()
  }, [id])

  const toggleLike = () => {
    const savedLiked = localStorage.getItem('likedSpots')
    const liked = savedLiked ? JSON.parse(savedLiked) : []
    
    const newLiked = isLiked 
      ? liked.filter((spotId: string) => spotId !== id)
      : [...liked, id]
    
    localStorage.setItem('likedSpots', JSON.stringify(newLiked))
    setIsLiked(!isLiked)
  }

  const toggleVisited = () => {
    const savedVisited = localStorage.getItem('visitedSpots')
    const visited = savedVisited ? JSON.parse(savedVisited) : []
    
    const newVisited = isVisited
      ? visited.filter((spotId: string) => spotId !== id)
      : [...visited, id]
    
    localStorage.setItem('visitedSpots', JSON.stringify(newVisited))
    setIsVisited(!isVisited)
  }

  if (!spot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10 backdrop-blur-lg bg-white/90">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <Link href="/">
            <Image 
              src="/logo.svg" 
              alt="コテスポ" 
              width={140} 
              height={40}
              className="cursor-pointer hover:opacity-80 transition-opacity"
            />
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

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* メイン画像スライダー */}
        <Card className="overflow-hidden mb-8 shadow-2xl">
          <div className="relative">
            <ImageSlider 
              images={[
                spot.image,
                ...(spot.additionalImages || [])
              ]}
              alt={spot.name}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white pointer-events-none">
              <Badge className="mb-4 bg-white/20 backdrop-blur-sm border-0 text-white">
                {spot.area}
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">
                {spot.name}
              </h1>
            </div>
          </div>
        </Card>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* メインコンテンツ */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基本情報カード */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-blue-600" />
                  アクセス情報
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl">
                    <MapPin className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-600 mb-1">最寄り駅</div>
                      <div className="font-semibold text-lg">{spot.station}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                    <Clock className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-600 mb-1">徒歩時間</div>
                      <div className="font-semibold text-lg">約{spot.walkMinutes}分</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-xl sm:col-span-2">
                    <Tag className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm text-gray-600 mb-1">場所タイプ</div>
                      <div className="font-semibold text-lg">{spot.placeType}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 説明 */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">スポットについて</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {spot.description}
                </p>
              </CardContent>
            </Card>

            {/* 見える路線 */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Train className="w-5 h-5 text-blue-600" />
                  見える路線
                </h2>
                <div className="flex flex-wrap gap-2">
                  {spot.lines.map((line: string, idx: number) => (
                    <Badge 
                      key={idx} 
                      variant="secondary" 
                      className="px-4 py-2 text-sm font-medium"
                    >
                      {line}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 安全情報 */}
            {spot.safetyNote && (
              <Card className="border-green-200 bg-green-50/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h2 className="text-xl font-bold mb-3 text-green-900">
                        安全情報
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {spot.safetyNote}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 近くの施設 */}
            <Card className="border-blue-200 bg-blue-50/50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <Store className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-4 text-blue-900">
                      近くの施設
                    </h2>
                    {spot.facilities && spot.facilities.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {spot.facilities.map((facility, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="px-4 py-2 text-sm font-medium bg-white border-blue-200"
                          >
                            {facility}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-sm">
                        近くの施設情報はありません
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* 住所カード */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-3">住所</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {spot.address}
                </p>
                <Separator className="my-4" />
                <Button className="w-full" variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  地図で見る
                </Button>
              </CardContent>
            </Card>

            {/* タグカード */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold mb-3">特徴</h3>
                <div className="space-y-2">
                  {spot.walkMinutes <= 5 && (
                    <Badge variant="outline" className="w-full justify-start bg-green-50 text-green-700 border-green-200 py-2">
                      駅から近い
                    </Badge>
                  )}
                  {spot.placeType === '公園' && (
                    <Badge variant="outline" className="w-full justify-start bg-green-50 text-green-700 border-green-200 py-2">
                      公園あり
                    </Badge>
                  )}
                  {spot.lines.length > 1 && (
                    <Badge variant="outline" className="w-full justify-start bg-blue-50 text-blue-700 border-blue-200 py-2">
                      複数路線が見れる
                    </Badge>
                  )}
                  {spot.lines.some((line: string) => line.includes('新幹線') || line.includes('特急')) && (
                    <Badge variant="outline" className="w-full justify-start bg-purple-50 text-purple-700 border-purple-200 py-2">
                      特急・新幹線が見れる
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* アクションボタン */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <Button 
                  className="w-full" 
                  size="lg"
                  variant={isLiked ? "default" : "outline"}
                  onClick={toggleLike}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                  {isLiked ? 'いいね済み' : 'いいね'}
                </Button>
                <Button 
                  className="w-full" 
                  size="lg"
                  variant={isVisited ? "default" : "outline"}
                  onClick={toggleVisited}
                >
                  <Check className="w-5 h-5 mr-2" />
                  {isVisited ? '行った！' : '行った'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}