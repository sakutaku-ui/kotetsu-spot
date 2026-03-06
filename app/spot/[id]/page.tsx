import { getSpotById } from '@/app/data/spots'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, Tag, Shield, ArrowLeft } from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              戻る
            </Button>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="overflow-hidden">
          {/* 画像 */}
          <div className="relative aspect-video">
            <Image
              src={spot.image}
              alt={spot.name}
              fill
              className="object-cover"
            />
          </div>

          <CardHeader>
            <div className="space-y-4">
              {/* エリアバッジ */}
              <Badge variant="secondary">{spot.area}</Badge>
              
              {/* タイトル */}
              <h1 className="text-3xl font-bold">{spot.name}</h1>

              {/* アクセス情報 */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{spot.station}駅から徒歩{spot.walkMinutes}分</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>{spot.placeType}</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* 説明 */}
            <div>
              <h2 className="font-semibold text-lg mb-2">スポット説明</h2>
              <p className="text-muted-foreground leading-relaxed">
                {spot.description}
              </p>
            </div>

            <Separator />

            {/* 見える路線 */}
            <div>
              <h2 className="font-semibold text-lg mb-3">見える路線</h2>
              <div className="flex flex-wrap gap-2">
                {spot.lines.map((line, idx) => (
                  <Badge key={idx} variant="secondary" className="px-3 py-1">
                    {line}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* 住所 */}
            <div>
              <h2 className="font-semibold text-lg mb-2">住所</h2>
              <p className="text-muted-foreground">{spot.address}</p>
            </div>

            {/* 安全メモ */}
            {spot.safetyNote && (
              <>
                <Separator />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <h2 className="font-semibold text-lg">安全メモ</h2>
                  </div>
                  <p className="text-muted-foreground">{spot.safetyNote}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}