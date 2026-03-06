'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, MapPin, Trees, Layers, Zap, X } from 'lucide-react'
import { useState } from 'react'

interface SpotFiltersProps {
  selectedArea: string
  selectedMainLine: string
  selectedFilters: string[]
  onAreaChange: (area: string) => void
  onLineChange: (line: string) => void
  onFilterToggle: (filter: string) => void
  onClearAll: () => void
}

const AREAS = ['東京', '埼玉', '神奈川', '千葉']
const POPULAR_LINES = ['西武線', '東武線', '東海道線', '中央線', '山手線', '京浜東北線']

export function SpotFilters({
  selectedArea,
  selectedMainLine,
  selectedFilters,
  onAreaChange,
  onLineChange,
  onFilterToggle,
  onClearAll
}: SpotFiltersProps) {
  const [showOtherLines, setShowOtherLines] = useState(false)
  
  const hasActiveFilters = selectedArea || selectedMainLine || selectedFilters.length > 0

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">絞り込み検索</CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClearAll}
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
                onClick={() => onAreaChange(selectedArea === area ? '' : area)}
              >
                {area}
              </Badge>
            ))}
          </div>
        </div>

        {/* よく見る路線 */}
        <div>
          <h3 className="text-sm font-semibold mb-3">よく見る路線</h3>
          <div className="flex flex-wrap gap-2">
            {POPULAR_LINES.map(line => (
              <Badge
                key={line}
                variant={selectedMainLine === line ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => onLineChange(selectedMainLine === line ? '' : line)}
              >
                {line}
              </Badge>
            ))}
          </div>
        </div>

        {/* 条件 */}
        <div>
          <h3 className="text-sm font-semibold mb-3">条件</h3>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedFilters.includes('駅近') ? "default" : "outline"}
              className="cursor-pointer px-3 py-2 text-sm"
              onClick={() => onFilterToggle('駅近')}
            >
              <MapPin className="w-3.5 h-3.5 mr-1" />
              駅近
            </Badge>
            <Badge
              variant={selectedFilters.includes('公園あり') ? "default" : "outline"}
              className="cursor-pointer px-3 py-2 text-sm"
              onClick={() => onFilterToggle('公園あり')}
            >
              <Trees className="w-3.5 h-3.5 mr-1" />
              公園あり
            </Badge>
            <Badge
              variant={selectedFilters.includes('複数路線見れる') ? "default" : "outline"}
              className="cursor-pointer px-3 py-2 text-sm"
              onClick={() => onFilterToggle('複数路線見れる')}
            >
              <Layers className="w-3.5 h-3.5 mr-1" />
              複数路線
            </Badge>
            <Badge
              variant={selectedFilters.includes('特急・新幹線見れる') ? "default" : "outline"}
              className="cursor-pointer px-3 py-2 text-sm"
              onClick={() => onFilterToggle('特急・新幹線見れる')}
            >
              <Zap className="w-3.5 h-3.5 mr-1" />
              特急・新幹線
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}