'use client'

import { useState, useEffect } from 'react'
import { Heart, Check } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// 型定義
type Spot = {
  id: number
  name: string
  line: string
  station: string
  walkMinutes: number
  address: string
  description: string
  placeType: string
  lines: string[]
  trainTypes: string[]
  intervals: string
  safety: string
  crowdLevel: string
  image: string
}

// 仮データ
const SPOTS: Spot[] = [
  {
    id: 1,
    name: '田端大橋 跨線橋',
    line: '埼玉高速鉄道',
    station: '田端駅',
    walkMinutes: 3,
    address: '東京都北区田端',
    description: '跨線橋の中央から複数路線を見下ろせる。並走シーンが多く、本数も多い。',
    placeType: '跨線橋',
    lines: ['山手線', '京浜東北線', '東北本線', '高崎線', '常磐線'],
    trainTypes: ['E231系', 'E233系', 'E531系', 'E657系（特急）'],
    intervals: '山手線・京浜東北線（2〜3分）、その他（5〜15分）',
    safety: '歩道幅2m、柵あり（腰より上）、車道と分離',
    crowdLevel: '平日朝夕やや混雑、日中・休日は空いている',
    image: '/spots/tabata.jpg',
  },
  {
    id: 2,
    name: '新小岩駅南口 線路沿い歩道',
    line: '東京メトロ東西線',
    station: '新小岩駅',
    walkMinutes: 2,
    address: '東京都葛飾区新小岩',
    description: '駅至近のため本数が非常に多い。柵越しだが高低差がなく見やすい。',
    placeType: '歩道',
    lines: ['総武線（快速）', '総武線（各停）'],
    trainTypes: ['E217系', 'E231系'],
    intervals: '快速・各停合わせて2〜3分おき',
    safety: '歩道幅1.5m、金網柵あり、車道に面していない',
    crowdLevel: '商店街沿いのため常時人通りあり',
    image: '/spots/shinkoiwa.jpg',
  },
  {
    id: 3,
    name: '御茶ノ水 聖橋',
    line: '京王線',
    station: '御茶ノ水駅',
    walkMinutes: 3,
    address: '東京都千代田区神田駿河台',
    description: '橋の上から見下ろす形。カーブを曲がる電車を正面から捉えられる。',
    placeType: '橋',
    lines: ['中央線（快速）', '中央・総武線（各停）', '丸ノ内線'],
    trainTypes: ['E233系', '02系（丸ノ内線）'],
    intervals: '中央線快速（3〜5分）、総武線各停（3〜5分）',
    safety: '歩道幅1.5m、柵あり（腰より上）、ガードレールあり',
    crowdLevel: '観光地のため休日混雑、平日日中は空いている',
    image: '/spots/hijiri.jpg',
  },
  {
    id: 4,
    name: '品川駅高輪口 第一京浜跨線橋',
    line: 'JR各線',
    station: '品川駅',
    walkMinutes: 5,
    address: '東京都港区高輪',
    description: '新幹線と在来線を同時に見られる。本数が多く飽きない。',
    placeType: '跨線橋',
    lines: ['東海道線', '横須賀線', '山手線', '京浜東北線', '東海道新幹線'],
    trainTypes: ['E231系', 'E233系', 'E217系', 'N700系', 'E5系（新幹線）'],
    intervals: '在来線（2〜5分）、新幹線（10〜15分）',
    safety: '歩道幅2m、柵あり（胸程度）、ガードレールあり',
    crowdLevel: '平日朝夕混雑、休日は比較的空いている',
    image: '/spots/shinagawa.jpg',
  },
  {
    id: 5,
    name: '西大井駅東口 線路沿い公園端',
    line: '東急田園都市線',
    station: '西大井駅',
    walkMinutes: 1,
    address: '東京都品川区西大井',
    description: '公園の端に位置し車道なし。ベンチがあるため座って見られる。',
    placeType: '公園端',
    lines: ['東海道線', '横須賀線', '湘南新宿ライン', '東海道新幹線（遠景）'],
    trainTypes: ['E231系', 'E233系', 'E217系', 'N700系（新幹線・遠景）'],
    intervals: '在来線（2〜5分）、新幹線（15〜20分・遠景）',
    safety: '車道なし、フェンスあり、ベンチあり、トイレあり',
    crowdLevel: '公園利用者がいる程度、比較的空いている',
    image: '/spots/nishioi.jpg',
  },
]

const LINES = ['すべて', '山手線', '京浜東北線', '東北本線', '高崎線', '常磐線', '総武線（快速）', '総武線（各停）', '中央線（快速）', '中央・総武線（各停）', '丸ノ内線', '東海道線', '横須賀線', '湘南新宿ライン', '東海道新幹線']

export default function Home() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'parent' | 'child'>('parent')
  const [selectedLine, setSelectedLine] = useState('すべて')
  const [likedSpots, setLikedSpots] = useState<number[]>([])
  const [visitedSpots, setVisitedSpots] = useState<number[]>([])
  const [stampedSpots, setStampedSpots] = useState<number[]>([])
  const [animatingStamp, setAnimatingStamp] = useState<number | null>(null)

  // localStorageから復元（SSRエラー回避）
  useEffect(() => {
    const savedLiked = localStorage.getItem('likedSpots')
    const savedVisited = localStorage.getItem('visitedSpots')
    const savedStamped = localStorage.getItem('stampedSpots')
    
    if (savedLiked) {
      setLikedSpots(JSON.parse(savedLiked))
    }
    if (savedVisited) {
      setVisitedSpots(JSON.parse(savedVisited))
    }
    if (savedStamped) {
      setStampedSpots(JSON.parse(savedStamped))
    }
  }, [])

  // 絞り込み処理
  const filteredSpots = selectedLine === 'すべて' 
    ? SPOTS 
    : SPOTS.filter(spot => spot.lines.includes(selectedLine))

  // いいねトグル
  const toggleLike = (id: number) => {
    setLikedSpots(prev => {
      const newLiked = prev.includes(id) 
        ? prev.filter(spotId => spotId !== id) 
        : [...prev, id]
      localStorage.setItem('likedSpots', JSON.stringify(newLiked))
      return newLiked
    })
  }

  // 行ったトグル
  const toggleVisited = (id: number) => {
    setVisitedSpots(prev => {
      const newVisited = prev.includes(id) 
        ? prev.filter(spotId => spotId !== id) 
        : [...prev, id]
      localStorage.setItem('visitedSpots', JSON.stringify(newVisited))
      return newVisited
    })
  }

  // スタンプを押す
  const toggleStamp = (id: number) => {
    // アニメーション開始
    setAnimatingStamp(id)
    
    setStampedSpots(prev => {
      const newStamped = prev.includes(id) 
        ? prev.filter(spotId => spotId !== id) 
        : [...prev, id]
      localStorage.setItem('stampedSpots', JSON.stringify(newStamped))
      return newStamped
    })

    // アニメーション終了
    setTimeout(() => {
      setAnimatingStamp(null)
    }, 300)
  }

  // 訪問済みスポットを取得
  const visitedSpotsList = SPOTS.filter(spot => visitedSpots.includes(spot.id))

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
              activeTab === 'parent'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            スポット一覧
          </button>
          <button
            onClick={() => setActiveTab('child')}
            className={`flex-1 py-3 rounded-md font-semibold transition-colors ${
              activeTab === 'child'
                ? 'bg-yellow-400 text-gray-800'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            スタンプ帳
          </button>
        </div>
      </div>

      {/* 親タブ */}
      {activeTab === 'parent' && (
        <div className="max-w-6xl mx-auto px-4 pb-8">
          {/* 絞り込み */}
          <div className="mb-6">
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {LINES.map(line => (
                <option key={line} value={line}>{line}</option>
              ))}
            </select>
          </div>

          {/* スポットカード一覧 */}
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredSpots.map(spot => (
              <div
                key={spot.id}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
              >
                {/* スポット画像 */}
                <div 
                  className="relative w-full aspect-video cursor-pointer"
                  onClick={() => router.push(`/spot/${spot.id}`)}
                >
                  <Image
                    src={spot.image}
                    alt={spot.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* カード内容 */}
                <div className="p-4">
                  <div 
                    className="flex items-start justify-between mb-2 cursor-pointer"
                    onClick={() => router.push(`/spot/${spot.id}`)}
                  >
                    {/* 主情報 */}
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {spot.name}
                      </h3>
                      
                      {/* 見える路線 */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {spot.lines.slice(0, 3).map((line, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                            {line}
                          </span>
                        ))}
                        {spot.lines.length > 3 && (
                          <span className="text-xs text-gray-500 px-2 py-1">
                            他{spot.lines.length - 3}路線
                          </span>
                        )}
                      </div>

                      {/* 副情報 */}
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span>📍 {spot.station} / 徒歩{spot.walkMinutes}分</span>
                        <span>🏷️ {spot.placeType}</span>
                      </div>
                    </div>
                  </div>

                  {/* アクションボタン */}
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleLike(spot.id)
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg transition-all hover:scale-105"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          likedSpots.includes(spot.id)
                            ? 'fill-red-500 text-red-500'
                            : 'text-gray-400'
                        }`}
                      />
                      <span className={`text-sm font-semibold ${
                        likedSpots.includes(spot.id) ? 'text-red-500' : 'text-gray-500'
                      }`}>
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
                      <Check
                        className={`w-5 h-5 ${
                          visitedSpots.includes(spot.id)
                            ? 'text-yellow-500'
                            : 'text-gray-400'
                        }`}
                      />
                      <span className={`text-sm font-semibold ${
                        visitedSpots.includes(spot.id) ? 'text-yellow-500' : 'text-gray-500'
                      }`}>
                        行った
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 子供タブ（スタンプ帳） */}
      {activeTab === 'child' && (
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <p className="text-3xl font-bold text-yellow-600">
                {visitedSpots.length}こ いったよ！
              </p>
            </div>

            {/* 訪問済みスポット一覧 */}
            {visitedSpotsList.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {visitedSpotsList.map(spot => (
                  <div
                    key={spot.id}
                    className="p-6 rounded-lg bg-yellow-50 border-2 border-yellow-200"
                  >
                    <p className="text-lg font-bold text-gray-800 mb-4 text-center">
                      {spot.name}
                    </p>
                    
                    {/* スタンプ画像 */}
                    <button
                      onClick={() => toggleStamp(spot.id)}
                      className="w-full flex justify-center"
                    >
                      <div 
                        className={`relative w-32 h-32 transition-all duration-300 ${
                          animatingStamp === spot.id
                            ? 'scale-125'
                            : 'scale-100 hover:scale-110'
                        }`}
                      >
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