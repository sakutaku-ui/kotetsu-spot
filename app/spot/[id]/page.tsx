'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

// 型定義
type Spot = {
  id: number
  name: string
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

// 仮データ（app/page.tsxと同じデータ）
const SPOTS: Spot[] = [
  {
    id: 1,
    name: '田端大橋 跨線橋',
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

export default function SpotDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [isFavorite, setIsFavorite] = useState(false)
  
  const spot = SPOTS.find(s => s.id === parseInt(id))

  if (!spot) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">スポットが見つかりませんでした</p>
          <button
            onClick={() => router.push('/')}
            className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
          >
            ← トップに戻る
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-blue-600 text-center">🚃 子鉄スポット帳</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* 戻るボタン */}
          <div className="p-4">
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← もどる
            </button>
          </div>

          {/* スポット画像 */}
          <div className="relative w-full aspect-video">
            <Image
              src={spot.image}
              alt={spot.name}
              fill
              className="object-cover"
            />
          </div>

          {/* 詳細情報 */}
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{spot.name}</h2>
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2"
              >
                <Heart
                  className={`w-8 h-8 ${
                    isFavorite
                      ? 'fill-red-500 text-red-500'
                      : 'text-gray-400'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-4 text-gray-700">
              {/* 見える路線 */}
              <div>
                <span className="font-semibold text-gray-800">🚃 見える路線：</span>
                <div className="mt-1 flex flex-wrap gap-2">
                  {spot.lines.map((line, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {line}
                    </span>
                  ))}
                </div>
              </div>

              {/* 見える車両 */}
              <div>
                <span className="font-semibold text-gray-800">🚂 見える車両：</span>
                <p className="mt-1">{spot.trainTypes.join('、')}</p>
              </div>

              {/* アクセス */}
              <div>
                <span className="font-semibold text-gray-800">📍 アクセス：</span>
                <p className="mt-1">{spot.station} 徒歩{spot.walkMinutes}分</p>
              </div>

              {/* 場所タイプ */}
              <div>
                <span className="font-semibold text-gray-800">🏷️ 場所タイプ：</span>
                <p className="mt-1">{spot.placeType}</p>
              </div>

              <div className="pt-3 border-t">
                <p className="text-gray-600 leading-relaxed">{spot.description}</p>
              </div>

              {/* 補足情報 */}
              <div className="pt-3 border-t space-y-2">
                <div className="text-sm">
                  <span className="font-semibold text-gray-700">⏱️ 車両間隔：</span>
                  <p className="text-gray-600 mt-1">{spot.intervals}</p>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-700">🛡️ 安全面：</span>
                  <p className="text-gray-600 mt-1">{spot.safety}</p>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-gray-700">👥 混雑傾向：</span>
                  <p className="text-gray-600 mt-1">{spot.crowdLevel}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}