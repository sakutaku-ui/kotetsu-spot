'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Spot } from '@/app/data/schema'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, Heart, Check, Trees, Layers, Zap, X, ChevronDown } from 'lucide-react'
import Image from 'next/image'

// LINE_GROUP_KEYWORDS
const LINE_GROUP_KEYWORDS: Record<string, string[]> = {
  '西武線': ['西武'],
  '東武線': ['東武'],
  '東海道線': ['東海道線'],
  '中央線': ['中央線', '中央・総武線'],
  '山手線': ['山手線'],
  '京浜東北線': ['京浜東北線'],
}

// よく見る路線
const POPULAR_LINES = ['西武線', '東武線', '東海道線', '中央線', '山手線', '京浜東北線']

// エリアと路線データ
const AREAS = ['東京', '埼玉', '神奈川', '千葉']

const LINE_COMPANIES = {
  'JR東日本': ['山手線', '京浜東北線', '中央線', '総武線', '東海道線', '横須賀線', '湘南新宿ライン'],
  '私鉄': ['西武線', '東武線', '東急線', '京王線', '小田急線'],
  '地下鉄': ['丸ノ内線', '銀座線', '日比谷線', '東西線'],
}

export function SpotList({ 
  initialSpots, 
  initialArea 
}: { 
  initialSpots: Spot[]
  initialArea?: string
}) {
  const router = useRouter()
  const [selectedMainLine, setSelectedMainLine] = useState<string>('')
  const [selectedArea, setSelectedArea] = useState<string>(initialArea || '')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [likedSpots, setLikedSpots] = useState<string[]>([])
  const [visitedSpots, setVisitedSpots] = useState<string[]>([])
  
  // アコーディオン管理
  const [showOtherLines, setShowOtherLines] = useState(false)
  const [expandedCompany, setExpandedCompany] = useState<string>('')

  // localStorageから復元
  useEffect(() => {
    const savedLiked = localStorage.getItem('likedSpots')
    const savedVisited = localStorage.getItem('visitedSpots')
    
    if (savedLiked) setLikedSpots(JSON.parse(savedLiked))
    if (savedVisited) setVisitedSpots(JSON.parse(savedVisited))
  }, [])

  // フィルター処理
  const filteredSpots = initialSpots.filter(spot => {
    // エリアフィルター（部分一致）
    if (selectedArea && !spot.area.includes(selectedArea)) {
      return false
    }
    
    // 路線フィルター（グループキーワード対応）
    if (selectedMainLine) {
      const keywords = LINE_GROUP_KEYWORDS[selectedMainLine] || [selectedMainLine]
      const hasMatch = spot.lines.some(line => 
        keywords.some(keyword => line.includes(keyword))
      )
      
      if (!hasMatch) {
        return false
      }
    }
    
    // 条件フィルター（AND検索）
    if (selectedFilters.includes('駅近') && spot.walkMinutes > 5) {
      return false
    }
    if (selectedFilters.includes('公園あり') && spot.placeType !== '公園') {
      return false
    }
    if (selectedFilters.includes('複数路線見れる') && spot.lines.length <= 1) {
      return false
    }
    if (selectedFilters.includes('特急・新幹線見れる') && !spot.lines.some(line => line.includes('新幹線') || line.includes('特急'))) {
      return false
    }
    
    return true
  })

  // フィルタートグル
  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    )
  }

  // いいねトグル
  const toggleLike = (id: string) => {
    setLikedSpots(prev => {
      const newLiked = prev.includes(id) ? prev.filter(spotId => spotId !== id) : [...prev, id]
      localStorage.setItem('likedSpots', JSON.stringify(newLiked))
      return newLiked
    })
  }

  // 行ったトグル
  const toggleVisited = (id: string) => {
    setVisitedSpots(prev => {
      const newVisited = prev.includes(id) ? prev.filter(spotId => spotId !== id) : [...prev, id]
      localStorage.setItem('visitedSpots', JSON.stringify(newVisited))
      return newVisited
    })
  }

  const clearAllFilters = () => {
    setSelectedArea('')
    setSelectedMainLine('')
    setSelectedFilters([])
    setExpandedCompany('')
  }

  const hasActiveFilters = selectedArea || selectedMainLine || selectedFilters.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-10 border-b backdrop-blur-lg bg-white/90">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-2">
          <Link href="/">
            <h1 className="text-lg sm:text-2xl font-bold text-blue-600 cursor-pointer hover:opacity-80 transition-opacity whitespace-nowrap">
              🚃 子鉄スポット帳
            </h1>
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

      {/* コンテンツ */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* フィルター */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">絞り込み検索</h2>
              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearAllFilters}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4 mr-1" />
                  クリア
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* エリア */}
            <div>
              <h3 className="text-sm font-semibold mb-3">エリア</h3>
              <div className="flex flex-wrap gap-2">
                {AREAS.map(area => (
                  <Badge
                    key={area}
                    variant={selectedArea === area ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 text-sm"
                    onClick={() => setSelectedArea(selectedArea === area ? '' : area)}
                  >
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* よく見る路線 */}
            <div>
              <h3 className="text-sm font-semibold mb-3">よく見る路線</h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_LINES.map(line => (
                  <Badge
                    key={line}
                    variant={selectedMainLine === line ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 text-sm"
                    onClick={() => setSelectedMainLine(selectedMainLine === line ? '' : line)}
                  >
                    {line}
                  </Badge>
                ))}
              </div>
            </div>

            {/* その他の路線（アコーディオン） */}
            <div>
              <button
                onClick={() => setShowOtherLines(!showOtherLines)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showOtherLines ? 'rotate-180' : ''}`} />
                その他の路線
              </button>
              
              {showOtherLines && (
                <div className="mt-4 space-y-2 pl-4 border-l-2 border-gray-200">
                  {Object.entries(LINE_COMPANIES).map(([company, lines]) => (
                    <div key={company}>
                      <button
                        onClick={() => setExpandedCompany(expandedCompany === company ? '' : company)}
                        className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        <ChevronDown className={`w-3 h-3 transition-transform ${expandedCompany === company ? 'rotate-180' : ''}`} />
                        {company}
                      </button>
                      
                      {expandedCompany === company && (
                        <div className="mt-2 ml-5 flex flex-wrap gap-2">
                          {lines.map(line => (
                            <Badge
                              key={line}
                              variant={selectedMainLine === line ? "default" : "outline"}
                              className="cursor-pointer px-3 py-1.5 text-xs"
                              onClick={() => setSelectedMainLine(selectedMainLine === line ? '' : line)}
                            >
                              {line}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* 条件 */}
            <div>
              <h3 className="text-sm font-semibold mb-3">条件</h3>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={selectedFilters.includes('駅近') ? "default" : "outline"}
                  className="cursor-pointer px-3 py-2 text-sm"
                  onClick={() => toggleFilter('駅近')}
                >
                  <MapPin className="w-3.5 h-3.5 mr-1" />
                  駅近
                </Badge>
                <Badge
                  variant={selectedFilters.includes('公園あり') ? "default" : "outline"}
                  className="cursor-pointer px-3 py-2 text-sm"
                  onClick={() => toggleFilter('公園あり')}
                >
                  <Trees className="w-3.5 h-3.5 mr-1" />
                  公園あり
                </Badge>
                <Badge
                  variant={selectedFilters.includes('複数路線見れる') ? "default" : "outline"}
                  className="cursor-pointer px-3 py-2 text-sm"
                  onClick={() => toggleFilter('複数路線見れる')}
                >
                  <Layers className="w-3.5 h-3.5 mr-1" />
                  複数路線
                </Badge>
                <Badge
                  variant={selectedFilters.includes('特急・新幹線見れる') ? "default" : "outline"}
                  className="cursor-pointer px-3 py-2 text-sm"
                  onClick={() => toggleFilter('特急・新幹線見れる')}
                >
                  <Zap className="w-3.5 h-3.5 mr-1" />
                  特急・新幹線
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* スポット数 */}
        <div className="text-sm text-muted-foreground">
          {filteredSpots.length}件のスポットが見つかりました
        </div>

        {/* スポットグリッド */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSpots.map(spot => (
            <Card 
              key={spot.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            >
              {/* 画像 */}
              <div 
                className="relative aspect-video overflow-hidden bg-gray-100"
                onClick={() => router.push(`/spot/${spot.id}`)}
              >
                <Image 
                  src={spot.image} 
                  alt={spot.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* エリアバッジ */}
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
                    {spot.area}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-3">
                <div onClick={() => router.push(`/spot/${spot.id}`)}>
                  <h3 className="font-bold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {spot.name}
                  </h3>
                  
                  {/* アクセス情報 */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{spot.station}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>徒歩{spot.walkMinutes}分</span>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pb-3">
                {/* タグ */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {spot.walkMinutes <= 5 && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      駅近
                    </Badge>
                  )}
                  {spot.placeType === '公園' && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      公園
                    </Badge>
                  )}
                  {spot.lines.length > 1 && (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      複数路線
                    </Badge>
                  )}
                </div>

                {/* 路線 */}
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">見れる路線</p>
                  <div className="flex flex-wrap gap-1">
                    {spot.lines.slice(0, 3).map((line, idx) => (
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
                </div>
              </CardContent>

              <CardFooter className="pt-0 gap-2">
                <Button
                  variant={likedSpots.includes(spot.id) ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleLike(spot.id)
                  }}
                >
                  <Heart className={`w-4 h-4 mr-1 ${likedSpots.includes(spot.id) ? 'fill-current' : ''}`} />
                  いいね
                </Button>
                <Button
                  variant={visitedSpots.includes(spot.id) ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleVisited(spot.id)
                  }}
                >
                  <Check className="w-4 h-4 mr-1" />
                  行った
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* 検索結果なし */}
        {filteredSpots.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500">条件に合うスポットが見つかりませんでした</p>
            <p className="text-sm text-gray-400 mt-2">条件を変更してみてください</p>
          </div>
        )}
      </div>
    </div>
  )
}