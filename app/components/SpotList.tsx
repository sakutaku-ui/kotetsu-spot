'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Spot } from '@/app/data/schema'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, Heart, Check, Trees, Layers, Zap, X, ChevronDown, Store } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/app/components/Header'

// LINE_GROUP_KEYWORDS
const LINE_GROUP_KEYWORDS: Record<string, string[]> = {
  '西武線': ['西武'],
  '東武線': ['東武'],
  '東海道線': ['東海道線'],
  '中央線': ['中央線', '中央・総武線'],
  '山手線': ['山手線'],
  '京浜東北線': ['京浜東北線'],
}

// 主要路線
const POPULAR_LINES = ['西武線', '東武線', '東海道線', '中央線', '山手線', '京浜東北線']

// エリア
const AREAS = ['東京', '埼玉', '神奈川', '千葉']

// スポットタイプ
const PLACE_TYPES = ['公園', '橋', '跨線橋', '展望台', 'その他']

// こだわりポイント
const DETAIL_FILTERS = [
  { id: '駅近', label: '駅近（徒歩5分以内）', icon: MapPin },
  { id: '複数路線見れる', label: '複数路線が見られる', icon: Layers },
  { id: '特急・新幹線見れる', label: '特急・新幹線が見られる', icon: Zap },
  { id: '近くに商業施設', label: '近くに商業施設有', icon: Store },
]

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
  const [selectedPlaceType, setSelectedPlaceType] = useState<string>('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [likedSpots, setLikedSpots] = useState<string[]>([])
  const [visitedSpots, setVisitedSpots] = useState<string[]>([])
  
  // アコーディオン管理
  const [showOtherLines, setShowOtherLines] = useState(false)
  const [showDetailFilters, setShowDetailFilters] = useState(false)

  // localStorageから復元
  useEffect(() => {
    const savedLiked = localStorage.getItem('likedSpots')
    const savedVisited = localStorage.getItem('visitedSpots')
    
    if (savedLiked) setLikedSpots(JSON.parse(savedLiked))
    if (savedVisited) setVisitedSpots(JSON.parse(savedVisited))
  }, [])

  // エリアに応じた路線リスト
  const availableLines = useMemo(() => {
    if (!selectedArea) return []
    
    const areaSpots = initialSpots.filter(spot => spot.area.includes(selectedArea))
    const linesSet = new Set<string>()
    
    areaSpots.forEach(spot => {
      spot.lines.forEach(line => linesSet.add(line))
    })
    
    return Array.from(linesSet).sort()
  }, [selectedArea, initialSpots])

  // 主要路線（エリアフィルター適用）
  const filteredPopularLines = useMemo(() => {
    if (!selectedArea) return POPULAR_LINES
    return POPULAR_LINES.filter(line => {
      const keywords = LINE_GROUP_KEYWORDS[line] || [line]
      return availableLines.some(availableLine => 
        keywords.some(keyword => availableLine.includes(keyword))
      )
    })
  }, [selectedArea, availableLines])

  // その他の路線（主要路線を除く）
  const otherLines = useMemo(() => {
    if (!selectedArea) return []
    
    const popularLineKeywords = POPULAR_LINES.flatMap(line => LINE_GROUP_KEYWORDS[line] || [line])
    
    return availableLines.filter(line => 
      !popularLineKeywords.some(keyword => line.includes(keyword))
    )
  }, [selectedArea, availableLines])

  // フィルター処理
  const filteredSpots = initialSpots.filter(spot => {
    // エリアフィルター
    if (selectedArea && !spot.area.includes(selectedArea)) {
      return false
    }
    
    // スポットタイプフィルター
    if (selectedPlaceType && spot.placeType !== selectedPlaceType) {
      return false
    }
    
    // 路線フィルター
    if (selectedMainLine) {
      const keywords = LINE_GROUP_KEYWORDS[selectedMainLine] || [selectedMainLine]
      const hasMatch = spot.lines.some(line => 
        keywords.some(keyword => line.includes(keyword))
      )
      
      if (!hasMatch) {
        return false
      }
    }
    
    // こだわりポイントフィルター
    if (selectedFilters.includes('駅近') && spot.walkMinutes > 5) {
      return false
    }
    if (selectedFilters.includes('複数路線見れる') && spot.lines.length <= 1) {
      return false
    }
    if (selectedFilters.includes('特急・新幹線見れる') && !spot.lines.some(line => line.includes('新幹線') || line.includes('特急'))) {
      return false
    }
    if (selectedFilters.includes('近くに商業施設') && 
        (!spot.facilities || !spot.facilities.some(f => 
          ['ショッピングモール', 'スーパー', 'コンビニ'].includes(f)
        ))) {
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
    setSelectedPlaceType('')
    setSelectedMainLine('')
    setSelectedFilters([])
  }

  const hasActiveFilters = selectedArea || selectedPlaceType || selectedMainLine || selectedFilters.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header />

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
                    onClick={() => {
                      setSelectedArea(selectedArea === area ? '' : area)
                      setSelectedMainLine('') // 路線選択をリセット
                    }}
                  >
                    {area}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* スポットタイプ */}
            <div>
              <h3 className="text-sm font-semibold mb-3">スポットタイプ</h3>
              <div className="flex flex-wrap gap-2">
                {PLACE_TYPES.map(type => (
                  <Badge
                    key={type}
                    variant={selectedPlaceType === type ? "default" : "outline"}
                    className="cursor-pointer px-4 py-2 text-sm"
                    onClick={() => setSelectedPlaceType(selectedPlaceType === type ? '' : type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* 主要路線 */}
            <div>
              <h3 className="text-sm font-semibold mb-3">主要路線</h3>
              {selectedArea ? (
                // エリア選択時: そのエリアの主要路線のみ
                filteredPopularLines.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {filteredPopularLines.map(line => (
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
                ) : (
                  <p className="text-sm text-gray-500">このエリアに主要路線はありません</p>
                )
              ) : (
                // エリア未選択時: 全ての主要路線
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
              )}
            </div>

            {/* その他の路線（エリア選択時のみ） */}
            {selectedArea && otherLines.length > 0 && (
              <div>
                <button
                  onClick={() => setShowOtherLines(!showOtherLines)}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${showOtherLines ? 'rotate-180' : ''}`} />
                  その他の路線
                </button>
                
                {showOtherLines && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {otherLines.map(line => (
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
                  </div>
                )}
              </div>
            )}

            <Separator />

            {/* こだわりポイント（アコーディオン） */}
            <div>
              <button
                onClick={() => setShowDetailFilters(!showDetailFilters)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors w-full"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${showDetailFilters ? 'rotate-180' : ''}`} />
                <span>こだわりポイントの追加</span>
                {selectedFilters.length > 0 && (
                  <Badge variant="default" className="ml-2">
                    {selectedFilters.length}件
                  </Badge>
                )}
              </button>
              
              {showDetailFilters && (
                <div className="mt-4 pl-4 border-l-2 border-blue-200 bg-blue-50/30 p-4 rounded-r-lg">
                  <div className="flex flex-wrap gap-2">
                    {DETAIL_FILTERS.map(filter => {
                      const Icon = filter.icon
                      return (
                        <Badge
                          key={filter.id}
                          variant={selectedFilters.includes(filter.id) ? "default" : "outline"}
                          className="cursor-pointer px-3 py-2 text-sm"
                          onClick={() => toggleFilter(filter.id)}
                        >
                          <Icon className="w-3.5 h-3.5 mr-1" />
                          {filter.label}
                        </Badge>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* スポット数と選択中のフィルター */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {filteredSpots.length}件のスポットが見つかりました
          </div>
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {selectedArea && (
                <Badge variant="secondary" className="text-xs">
                  {selectedArea}
                </Badge>
              )}
              {selectedPlaceType && (
                <Badge variant="secondary" className="text-xs">
                  {selectedPlaceType}
                </Badge>
              )}
              {selectedMainLine && (
                <Badge variant="secondary" className="text-xs">
                  {selectedMainLine}
                </Badge>
              )}
              {selectedFilters.map(filter => (
                <Badge key={filter} variant="secondary" className="text-xs">
                  {DETAIL_FILTERS.find(f => f.id === filter)?.label}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* スポットグリッド */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSpots.map(spot => (
            <Card 
              key={spot.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              onClick={() => router.push(`/spot/${spot.id}`)}
            >
              {/* 画像 */}
              <div className="relative aspect-video overflow-hidden bg-gray-100">
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
                <div>
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