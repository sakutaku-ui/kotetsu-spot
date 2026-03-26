'use client'

import { useState, useEffect } from 'react'
import { getApprovedSpots } from '@/app/data/spots'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Header } from '@/app/components/Header'
import { Footer } from '@/app/components/Footer'
import { SpotCard } from '@/app/components/SpotCard'

export default function HomePage() {
  const [allSpots, setAllSpots] = useState<any[]>([])
  const [likedCount, setLikedCount] = useState(0)
  const [visitedCount, setVisitedCount] = useState(0)
  const [stampedCount, setStampedCount] = useState(0)

  useEffect(() => {
    // データ取得
    async function loadData() {
      try {
        const response = await fetch('/api/spots', {
          cache: 'no-store'
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch spots')
        }
        
        const spots = await response.json()
        setAllSpots(spots)
      } catch (error) {
        console.error('Error loading spots:', error)
      }
    }
    
    // localStorageから取得
    const savedLiked = localStorage.getItem('likedSpots')
    const savedVisited = localStorage.getItem('visitedSpots')
    const savedStamped = localStorage.getItem('stampedSpots')
    
    if (savedLiked) setLikedCount(JSON.parse(savedLiked).length)
    if (savedVisited) setVisitedCount(JSON.parse(savedVisited).length)
    if (savedStamped) setStampedCount(JSON.parse(savedStamped).length)
    
    loadData()
  }, [])
  
  // 人気スポット（最初の6件）
  const popularSpots = allSpots.slice(0, 6)
  
  // 新着スポット（作成日順で最新6件）
  const newSpots = [...allSpots]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)
  
  // エリア一覧
  const areas = Array.from(new Set(allSpots.map(spot => spot.area)))

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <Header />
      
      {/* ヒーローセクション */}
      <section className="relative overflow-hidden text-white min-h-[600px]">
        {/* 背景画像 */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/hero-train.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.6)',
          }}
        />
        
        {/* カラーオーバーレイ */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom right, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.5))',
          }}
        />
        
        {/* グリッド模様 */}
        <div className="absolute inset-0 bg-grid-white/5" />
        
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
              親子で楽しむ<br />電車観察スポット
            </h2>
            <p className="text-xl md:text-2xl text-white-100 max-w-2xl mx-auto">
              子どもが夢中になる“特等席”を見つけよう
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/spots">
                <Button size="lg" className="text-white hover:opacity-90 text-lg px-8 py-6 shadow-lg" style={{ backgroundColor: '#80C342' }}>
              <Sparkles className="w-5 h-5 mr-2" />
                  スポットを探す
                </Button>
              </Link>
              <Link href="#areas">
                <Button size="lg" className="text-white hover:opacity-80 text-lg px-8 py-6 shadow-lg" style={{ backgroundColor: '#6BB02E' }}>
                  エリアから探す
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* 統計情報 */}
          <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto mt-16">
            <div className="backdrop-blur-sm rounded-2xl p-6 border-2" style={{ backgroundColor: 'rgba(128, 195, 66, 0.2)', borderColor: 'rgba(128, 195, 66, 0.4)' }}>
              <div className="text-4xl font-bold">{likedCount}</div>
              <div className="text-white mt-1">いいね</div>
            </div>
            <div className="backdrop-blur-sm rounded-2xl p-6 border-2" style={{ backgroundColor: 'rgba(128, 195, 66, 0.2)', borderColor: 'rgba(128, 195, 66, 0.4)' }}>
              <div className="text-4xl font-bold">{visitedCount}</div>
              <div className="text-white mt-1">行った</div>
            </div>
            <div className="backdrop-blur-sm rounded-2xl p-6 border-2" style={{ backgroundColor: 'rgba(128, 195, 66, 0.2)', borderColor: 'rgba(128, 195, 66, 0.4)' }}>
              <div className="text-4xl font-bold">{stampedCount}</div>
              <div className="text-white mt-1">スタンプ</div>
            </div>
          </div>
        </div>
      </section>

      {/* 人気スポット */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-blue-600" />
            <h2 className="text-3xl font-bold">人気のスポット</h2>
          </div>
          <Link href="/spots">
            <Button variant="ghost">
              すべて見る
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularSpots.map((spot) => (
            <SpotCard 
              key={spot.id} 
              spot={spot} 
              showActions={false}
              onClick={() => window.location.href = `/spot/${spot.id}`}
            />
          ))}
        </div>
      </section>

      {/* 新着スポット */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl font-bold">新着スポット</h2>
            </div>
            <Link href="/spots">
              <Button variant="ghost">
                すべて見る
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {newSpots.map((spot) => (
              <SpotCard 
                key={spot.id} 
                spot={spot} 
                showNewBadge 
                showActions={false}
                onClick={() => window.location.href = `/spot/${spot.id}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* エリア一覧 */}
      <section id="areas" className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">エリアから探す</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {areas.map((area) => {
            const count = allSpots.filter(s => s.area === area).length
            return (
              <Link key={area} href={`/spots?area=${area}`}>
                <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-xl group-hover:text-blue-600 transition-colors">
                          {area}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {count}件のスポット
                        </p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      <Footer />
    </div>
  )
}