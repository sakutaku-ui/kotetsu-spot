'use client'

import { useState, useEffect } from 'react'
import { Heart, Check, ChevronDown, MapPin, Trees, Layers, Zap } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Spot } from '@/app/data/schema'

// よく見る路線
const POPULAR_LINES = ['西武線', '東武線', '東海道線', '中央線', '山手線', '京浜東北線']

// 路線グループ → 検索キーワードのマッピング
// 「東武線」ボタンで「東武アーバンパークライン」なども一致させる
const LINE_GROUP_KEYWORDS: Record<string, string[]> = {
  '東武線': ['東武'],
  '西武線': ['西武'],
  '東海道線': ['東海道'],
  '中央線': ['中央線', '中央・総武線'],
  '山手線': ['山手線'],
  '京浜東北線': ['京浜東北線'],
  '東急線': ['東急'],
  '京王線': ['京王'],
  '小田急線': ['小田急'],
}

// エリアと路線データ
const AREAS = ['東京', '埼玉', '神奈川', '千葉']

const LINE_COMPANIES = {
  'JR東日本': ['山手線', '京浜東北線', '中央線', '総武線', '東海道線', '横須賀線', '湘南新宿ライン'],
  '私鉄': ['西武線', '東武線', '東急線', '京王線', '小田急線'],
  '地下鉄': ['丸ノ内線', '銀座線', '日比谷線', '東西線'],
}

export function SpotList({ initialSpots }: { initialSpots: Spot[] }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'parent' | 'child'>('parent')
  const [selectedMainLine, setSelectedMainLine] = useState<string>('')
  const [selectedArea, setSelectedArea] = useState<string>('')
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [likedSpots, setLikedSpots] = useState<string[]>([])
  const [visitedSpots, setVisitedSpots] = useState<string[]>([])
  const [stampedSpots, setStampedSpots] = useState<string[]>([])
  const [animatingStamp, setAnimatingStamp] = useState<string | null>(null)
  
  // アコーディオン管理
  const [showOtherLines, setShowOtherLines] = useState(false)
  const [expandedCompany, setExpandedCompany] = useState<string>('')

  // localStorageから復元
  useEffect(() => {
    const savedLiked = localStorage.getItem('likedSpots')
    const savedVisited = localStorage.getItem('visitedSpots')
    const savedStamped = localStorage.getItem('stampedSpots')
    
    if (savedLiked) setLikedSpots(JSON.parse(savedLiked))
    if (savedVisited) setVisitedSpots(JSON.parse(savedVisited))
    if (savedStamped) setStampedSpots(JSON.parse(savedStamped))
  }, [])

  // フィルター処理
  const filteredSpots = initialSpots.filter(spot => {
    // エリアフィルター（部分一致）
    if (selectedArea && !spot.area.includes(selectedArea)) {
      return false
    }
    
    // 路線フィルター（グループキーワードで部分一致）
    if (selectedMainLine) {
      const keywords = LINE_GROUP_KEYWORDS[selectedMainLine] ?? [selectedMainLine]
      if (!spot.lines.some(line => keywords.some(keyword => line.includes(keyword)))) {
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

  // スタンプトグル
  const toggleStamp = (id: string) => {
    setAnimatingStamp(id)
    setStampedSpots(prev => {
      const newStamped = prev.includes(id) ? prev.filter(spotId => spotId !== id) : [...prev, id]
      localStorage.setItem('stampedSpots', JSON.stringify(newStamped))
      return newStamped
    })
    setTimeout(() => setAnimatingStamp(null), 300)
  }

  const visitedSpotsList = initialSpots.filter(spot => visitedSpots.includes(spot.id))

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-blue-600 text-center">🚃 子鉄スポット帳</h1>
        </div>
      </header>

      {/* タブ切り替え */}
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm p-1 flex gap-1">
          <button
            onClick={() => setActiveTab('parent')}
            className={`flex-1 py-3 rounded-md font-semibold transition-colors ${
              activeTab === 'parent' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            スポット一覧
          </button>
          <button
            onClick={() => setActiveTab('child')}
            className={`flex-1 py-3 rounded-md font-semibold transition-colors ${
              activeTab === 'child' ? 'bg-yellow-400 text-gray-800' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            スタンプ帳
          </button>
        </div>
      </div>

      {/* 親タブ */}
      {activeTab === 'parent' && (
        <div className="max-w-6xl mx-auto px-4 pb-8">
          {/* 検索エリア */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6 space-y-6">
            {/* エリア選択 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">エリアで絞り込む</h3>
              <div className="flex flex-wrap gap-2">
                {AREAS.map(area => (
                  <button
                    key={area}
                    onClick={() => setSelectedArea(selectedArea === area ? '' : area)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      selectedArea === area
                        ? 'bg-purple-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* よく見る路線 */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">よく見る路線</h3>
              <div className="flex flex-wrap gap-2">
                {POPULAR_LINES.map(line => (
                  <button
                    key={line}
                    onClick={() => setSelectedMainLine(selectedMainLine === line ? '' : line)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      selectedMainLine === line
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {line}
                  </button>
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
                <div className="mt-4 space-y-4 pl-4 border-l-2 border-gray-200">
                  {/* 会社・路線選択 */}
                  <div className="space-y-2">
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
                              <button
                                key={line}
                                onClick={() => setSelectedMainLine(selectedMainLine === line ? '' : line)}
                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                                  selectedMainLine === line
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                              >
                                {line}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 条件フィルター */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">条件で絞り込む</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleFilter('駅近')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedFilters.includes('駅近')
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  駅近
                </button>
                <button
                  onClick={() => toggleFilter('公園あり')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedFilters.includes('公園あり')
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Trees className="w-3.5 h-3.5" />
                  公園あり
                </button>
                <button
                  onClick={() => toggleFilter('複数路線見れる')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedFilters.includes('複数路線見れる')
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  複数路線見れる
                </button>
                <button
                  onClick={() => toggleFilter('特急・新幹線見れる')}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedFilters.includes('特急・新幹線見れる')
                      ? 'bg-green-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  特急・新幹線見れる
                </button>
              </div>
              
              {/* 解除ボタン */}
              {(selectedArea || selectedMainLine || selectedFilters.length > 0) && (
                <button
                  onClick={() => {
                    setSelectedArea('')
                    setSelectedMainLine('')
                    setSelectedFilters([])
                    setExpandedCompany('')
                  }}
                  className="mt-3 w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-all border-2 border-red-200"
                >
                  🔄 条件をすべて解除
                </button>
              )}
            </div>
          </div>

          {/* スポットカード一覧 */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredSpots.map(spot => (
              <div
                key={spot.id}
                className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                {/* スポット画像 */}
                <div 
                  className="relative w-full aspect-video cursor-pointer"
                  onClick={() => router.push(`/spot/${spot.id}`)}
                >
                  <Image src={spot.image} alt={spot.name} fill className="object-cover" />
                </div>

                {/* カード内容 */}
                <div className="p-4">
                  <div onClick={() => router.push(`/spot/${spot.id}`)} className="cursor-pointer">
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{spot.name}</h3>
                    <p className="text-xs text-gray-500 mb-3">{spot.area}</p>
                    
                    {/* 条件タグ */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {spot.walkMinutes <= 5 && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">駅近</span>
                      )}
                      {spot.placeType === '公園' && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">公園あり</span>
                      )}
                    </div>
                    
                    {/* 見れる路線 */}
                    {spot.lines.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">見れる路線</p>
                        <div className="flex flex-wrap gap-1">
                          {spot.lines.slice(0, 3).map((line, idx) => (
                            <span key={idx} className="bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                              {line}
                            </span>
                          ))}
                          {spot.lines.length > 3 && (
                            <span className="text-xs text-gray-500 px-2 py-0.5">
                              他{spot.lines.length - 3}路線
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* アクションボタン */}
                  <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLike(spot.id)
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all hover:scale-105"
                    >
                      <Heart className={`w-5 h-5 ${likedSpots.includes(spot.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                      <span className={`text-sm font-semibold ${likedSpots.includes(spot.id) ? 'text-red-500' : 'text-gray-500'}`}>
                        いいね
                      </span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleVisited(spot.id)
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all hover:scale-105"
                    >
                      <Check className={`w-5 h-5 ${visitedSpots.includes(spot.id) ? 'text-yellow-500' : 'text-gray-400'}`} />
                      <span className={`text-sm font-semibold ${visitedSpots.includes(spot.id) ? 'text-yellow-500' : 'text-gray-500'}`}>
                        行った
                      </span>
                    </button>
                  </div>
                </div>
              </div>
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
      )}

      {/* 子供タブ（スタンプ帳） */}
      {activeTab === 'child' && (
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-yellow-600">{visitedSpots.length}こ いったよ！</p>
            </div>

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
                <p className="text-xl text-gray-500">まだ行った場所がないよ！</p>
                <p className="text-sm text-gray-400 mt-2">スポット一覧で「行った」を押してね</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
