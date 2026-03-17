import { getSpotById } from '@/app/data/spots'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  MapPin, 
  Clock, 
  Tag, 
  Shield, 
  ArrowLeft, 
  Navigation,
  Train
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function SpotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const spot = await getSpotById(id)

  if (!spot) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10 backdrop-blur-lg bg-white/90">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold text-blue-600 cursor-pointer hover:opacity-80 transition-opacity">
              🚃 子鉄スポット帳
            </h1>
          </Link>
          <nav className="flex gap-4">
            <Link href="/spots">
              <Button variant="ghost">スポット検索</Button>
            </Link>
            <Link href="/mypage">
              <Button variant="ghost">マイページ</Button>
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* メイン画像 */}
        <Card className="overflow-hidden mb-8 shadow-2xl">
          <div className="relative aspect-video md:aspect-[21/9]">
            <Image
              src={spot.image}
              alt={spot.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
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
                      <div className="font-semibold text-lg">{spot.station}駅</div>
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
                  {spot.lines.map((line, idx) => (
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
                  {spot.lines.some(line => line.includes('新幹線') || line.includes('特急')) && (
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
                <Button className="w-full" size="lg">
                  お気に入りに追加
                </Button>
                <Button className="w-full" variant="outline" size="lg">
                  シェアする
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}