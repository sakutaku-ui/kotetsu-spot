'use client'

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, Heart, Check } from 'lucide-react'
import Image from 'next/image'
import { Spot } from '@/app/data/schema'

interface SpotCardProps {
  spot: Spot
  showNewBadge?: boolean
  showActions?: boolean
  isLiked?: boolean
  isVisited?: boolean
  onLike?: () => void
  onVisited?: () => void
  onClick?: () => void
}

export function SpotCard({ 
  spot, 
  showNewBadge = false,
  showActions = true,
  isLiked = false, 
  isVisited = false, 
  onLike, 
  onVisited, 
  onClick 
}: SpotCardProps) {
  return (
    <Card 
      className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
      onClick={onClick}
    >
      {/* 画像 */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        <Image 
          src={spot.image} 
          alt={spot.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* NEWバッジ */}
        {showNewBadge && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-purple-500 text-white border-0">
              NEW
            </Badge>
          </div>
        )}
        
        {/* エリアバッジ */}
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 backdrop-blur-sm">
            {spot.area}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className={`font-bold text-lg line-clamp-2 transition-colors ${
          showNewBadge ? 'group-hover:text-purple-600' : 'group-hover:text-blue-600'
        }`}>
          {spot.name}
        </h3>
        
        {/* アクセス情報 */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <MapPin className={`w-4 h-4 ${showNewBadge ? 'text-purple-500' : ''}`} />
            <span>{spot.station}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className={`w-4 h-4 ${showNewBadge ? 'text-purple-500' : ''}`} />
            <span>徒歩{spot.walkMinutes}分</span>
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

      {/* アクションボタン（オプション） */}
      {showActions && (
        <CardFooter className="pt-0 gap-2">
          <Button
            variant={isLiked ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation()
              onLike?.()
            }}
          >
            <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
            いいね
          </Button>
          <Button
            variant={isVisited ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation()
              onVisited?.()
            }}
          >
            <Check className="w-4 h-4 mr-1" />
            行った
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}