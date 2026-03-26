'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { TagInput } from '@/app/components/TagInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, Eye, EyeOff, Edit, Upload } from 'lucide-react'
import { Spot, SpotStatus, PlaceType, SafetyRank } from '@/app/data/schema'
import Image from 'next/image'

export default function ManageSpotsPage() {
  const [spots, setSpots] = useState<Spot[]>([])
  const [filteredSpots, setFilteredSpots] = useState<Spot[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [areaFilter, setAreaFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingSpot, setEditingSpot] = useState<Spot | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  // データ取得
  useEffect(() => {
    loadSpots()
  }, [])

  // フィルタリング
  useEffect(() => {
    let filtered = spots

    if (searchQuery) {
      filtered = filtered.filter(spot => 
        spot.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (areaFilter !== 'all') {
      filtered = filtered.filter(spot => spot.area === areaFilter)
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(spot => spot.status === statusFilter)
    }

    setFilteredSpots(filtered)
  }, [spots, searchQuery, areaFilter, statusFilter])

  const loadSpots = async () => {
    const response = await fetch('/api/admin/spots')
    const data = await response.json()
    setSpots(data)
    setFilteredSpots(data)
  }

  const toggleVisibility = async (id: string, currentStatus: SpotStatus) => {
    const newStatus: SpotStatus = currentStatus === 'hidden' ? 'approved' : 'hidden'
    
    await fetch('/api/admin/spots/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus })
    })

    loadSpots()
  }

  const updateStatus = async (id: string, newStatus: SpotStatus) => {
    await fetch('/api/admin/spots/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus })
    })

    loadSpots()
  }

  const openEditDialog = (spot: Spot) => {
    setEditingSpot({ ...spot })
    // メイン画像と追加画像を統合してプレビュー
    const allImages = [spot.image, ...(spot.additionalImages || [])]
    setImagePreviews(allImages)
    setImageFiles([])
    setIsEditDialogOpen(true)
  }

  const openNewDialog = () => {
    setEditingSpot({
      id: '',
      name: '',
      area: '東京都',
      station: '',
      walkMinutes: 5,
      address: '',
      description: '',
      placeType: '公園',
      lines: [],
      facilities: [],
      safetyRank: 5,
      safetyNote: '',
      image: '',
      status: 'draft',
      displayOrder: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Spot)
    setImagePreviews([])
    setImageFiles([])
    setIsNewDialogOpen(true)
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setImageFiles(files)

    // 全画像のプレビューを生成
    const previews: string[] = []
    let loadedCount = 0

    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        previews.push(reader.result as string)
        loadedCount++
        
        if (loadedCount === files.length) {
          setImagePreviews(previews)
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // 画像を削除する関数
  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const saveSpot = async () => {
    if (!editingSpot) return

    try {
      const formData = new FormData()
      formData.append('id', editingSpot.id)
      formData.append('name', editingSpot.name || '')
      formData.append('area', editingSpot.area || '東京都')
      formData.append('station', editingSpot.station || '')
      formData.append('walkMinutes', (editingSpot.walkMinutes || 0).toString())
      formData.append('address', editingSpot.address || '')
      formData.append('description', editingSpot.description || '')
      formData.append('placeType', editingSpot.placeType || '公園')
      formData.append('lines', JSON.stringify(editingSpot.lines || []))
      formData.append('facilities', JSON.stringify(editingSpot.facilities || []))
      formData.append('safetyRank', (editingSpot.safetyRank || 5).toString())
      formData.append('safetyNote', editingSpot.safetyNote || '')
      formData.append('status', editingSpot.status || 'draft')
      
      // 新しい画像がアップロードされた場合
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formData.append('images', file)
        })
      }

      const response = await fetch('/api/admin/spots/edit', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Save error:', error)
        alert('保存に失敗しました: ' + (error.error || '不明なエラー'))
        return
      }

      setIsEditDialogOpen(false)
      loadSpots()
    } catch (error) {
      console.error('Save error:', error)
      alert('保存に失敗しました')
    }
  }

  const createSpot = async () => {
    if (!editingSpot) return
    if (imageFiles.length === 0) {
      alert('画像を選択してください（最低1枚）')
      return
    }

    try {
      const formData = new FormData()
      formData.append('name', editingSpot.name || '')
      formData.append('area', editingSpot.area || '東京都')
      formData.append('station', editingSpot.station || '')
      formData.append('walkMinutes', (editingSpot.walkMinutes || 0).toString())
      formData.append('address', editingSpot.address || '')
      formData.append('description', editingSpot.description || '')
      formData.append('placeType', editingSpot.placeType || '公園')
      formData.append('lines', JSON.stringify(editingSpot.lines || []))
      formData.append('facilities', JSON.stringify(editingSpot.facilities || []))
      formData.append('safetyRank', (editingSpot.safetyRank || 5).toString())
      formData.append('safetyNote', editingSpot.safetyNote || '')
      formData.append('status', 'approved')
      
      // 複数画像をアップロード
      imageFiles.forEach((file) => {
        formData.append('images', file)
      })

      const response = await fetch('/api/admin/spots/create', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Create error:', error)
        alert('登録に失敗しました: ' + (error.error || '不明なエラー'))
        return
      }

      setIsNewDialogOpen(false)
      loadSpots()
    } catch (error) {
      console.error('Create error:', error)
      alert('登録に失敗しました')
    }
  }

  const areas = Array.from(new Set(spots.map(spot => spot.area)))
  const isVisible = (status: SpotStatus) => status !== 'hidden'

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ヘッダー */}
      <header className="shadow-sm border-b sticky top-0 z-50 backdrop-blur-lg" style={{ backgroundColor: '#80C342' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">スポット管理</h1>
          <Button variant="ghost" className="text-white hover:bg-white/20">
            ログアウト
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* フィルター */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="スポット名で検索..."
                  value={searchQuery}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={areaFilter} onValueChange={(value: string) => setAreaFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="エリア" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全エリア</SelectItem>
                  {areas.map(area => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="ステータス" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全ステータス</SelectItem>
                  <SelectItem value="approved">表示中</SelectItem>
                  <SelectItem value="hidden">非表示</SelectItem>
                  <SelectItem value="draft">下書き</SelectItem>
                  <SelectItem value="pending">承認待ち</SelectItem>
                  <SelectItem value="rejected">却下</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* 新規登録ボタン */}
        <div className="flex justify-end mb-4">
          <Button 
            onClick={openNewDialog}
            style={{ backgroundColor: '#80C342' }}
            className="text-white"
          >
            ➕ 新規登録
          </Button>
        </div>

        {/* スポット一覧 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">スポット一覧（{filteredSpots.length}件）</h2>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredSpots.map(spot => (
                <div 
                  key={spot.id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* サムネイル */}
                  <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={spot.image}
                      alt={spot.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* スポット名 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">{spot.name}</h3>
                    <p className="text-sm text-gray-500">{spot.station} · 徒歩{spot.walkMinutes}分</p>
                  </div>

                  {/* エリア */}
                  <Badge variant="secondary" className="hidden sm:block">
                    {spot.area}
                  </Badge>

                  {/* ステータス選択 */}
                  <Select 
                    value={spot.status} 
                    onValueChange={(value: string) => updateStatus(spot.id, value as SpotStatus)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">承認済み</SelectItem>
                      <SelectItem value="hidden">非表示</SelectItem>
                      <SelectItem value="draft">下書き</SelectItem>
                      <SelectItem value="pending">承認待ち</SelectItem>
                      <SelectItem value="rejected">却下</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* 表示/非表示スイッチ */}
                  <div className="flex items-center gap-2">
                    {isVisible(spot.status) ? (
                      <Eye className="w-5 h-5 text-green-600" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    )}
                    <Switch
                      checked={isVisible(spot.status)}
                      onCheckedChange={() => toggleVisibility(spot.id, spot.status)}
                    />
                  </div>

                  {/* 編集ボタン */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(spot)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    編集
                  </Button>
                </div>
              ))}

              {filteredSpots.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  該当するスポットがありません
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 編集ダイアログ */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>スポット編集</DialogTitle>
          </DialogHeader>

          {editingSpot && (
            <div className="space-y-4">
              {/* スポット名 */}
              <div>
                <Label>スポット名</Label>
                <Input
                  value={editingSpot?.name || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (editingSpot) {
                      setEditingSpot({ ...editingSpot, name: e.target.value })
                    }
                  }}
                />
              </div>

              {/* エリア・駅名 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>エリア</Label>
                  <Select 
                    value={editingSpot?.area || '東京都'}
                    onValueChange={(value: string) => {
                      if (editingSpot) {
                        setEditingSpot({ ...editingSpot, area: value })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="東京都">東京都</SelectItem>
                      <SelectItem value="埼玉県">埼玉県</SelectItem>
                      <SelectItem value="神奈川県">神奈川県</SelectItem>
                      <SelectItem value="千葉県">千葉県</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>最寄り駅</Label>
                  <Input
                    value={editingSpot?.station || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (editingSpot) {
                        setEditingSpot({ ...editingSpot, station: e.target.value })
                      }
                    }}
                  />
                </div>
              </div>

              {/* 徒歩分数・場所タイプ */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>徒歩分数</Label>
                  <Input
                    type="number"
                    value={editingSpot?.walkMinutes || 0}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (editingSpot) {
                        setEditingSpot({ ...editingSpot, walkMinutes: parseInt(e.target.value) || 0 })
                      }
                    }}
                  />
                </div>
                <div>
                  <Label>場所タイプ</Label>
                  <Select 
                    value={editingSpot?.placeType || '公園'}
                    onValueChange={(value: string) => {
                      if (editingSpot) {
                        setEditingSpot({ ...editingSpot, placeType: value as PlaceType })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="公園">公園</SelectItem>
                      <SelectItem value="橋">橋</SelectItem>
                      <SelectItem value="跨線橋">跨線橋</SelectItem>
                      <SelectItem value="展望台">展望台</SelectItem>
                      <SelectItem value="その他">その他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 住所 */}
              <div>
                <Label>住所</Label>
                <Input
                  value={editingSpot?.address || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (editingSpot) {
                      setEditingSpot({ ...editingSpot, address: e.target.value })
                    }
                  }}
                />
              </div>

              {/* 説明 */}
              <div>
                <Label>説明</Label>
                <Textarea
                  value={editingSpot?.description || ''}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                    if (editingSpot) {
                      setEditingSpot({ ...editingSpot, description: e.target.value })
                    }
                  }}
                  rows={4}
                />
              </div>

              {/* 画像 */}
              <div>
                <Label>画像（複数選択可能）</Label>
                <p className="text-sm text-gray-500 mb-2">※1枚目がメイン画像（サムネイル）になります</p>
                <div className="space-y-2">
                  {/* プレビュー */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-video rounded overflow-hidden border-2 border-gray-200">
                          {index === 0 && (
                            <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded z-10">
                              メイン
                            </div>
                          )}
                          <Image
                            src={preview}
                            alt={`プレビュー${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          {imageFiles.length > 0 && (
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 z-10"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* アップロードボタン */}
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          画像を選択
                        </span>
                      </Button>
                    </Label>
                    {imageFiles.length > 0 && (
                      <span className="text-sm text-gray-500">{imageFiles.length}枚選択中</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 見える路線 */}
              <div>
                <Label>見える路線</Label>
                <p className="text-sm text-gray-500 mb-2">Enterキーまたはカンマで追加</p>
                <TagInput
                  value={editingSpot?.lines || []}
                  onChange={(lines) => {
                    if (editingSpot) {
                      setEditingSpot({ ...editingSpot, lines })
                    }
                  }}
                  placeholder="例: 山手線"
                />
              </div>

              {/* 近くの施設 */}
              <div>
                <Label>近くの施設</Label>
                <p className="text-sm text-gray-500 mb-2">Enterキーまたはカンマで追加</p>
                <TagInput
                  value={editingSpot?.facilities || []}
                  onChange={(facilities) => {
                    if (editingSpot) {
                      setEditingSpot({ ...editingSpot, facilities })
                    }
                  }}
                  placeholder="例: コンビニ"
                />
              </div>
              
              {/* 安全ランク・メモ */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>安全ランク</Label>
                  <Select 
                    value={editingSpot?.safetyRank?.toString() || '5'}
                    onValueChange={(value: string) => {
                      if (editingSpot) {
                        setEditingSpot({ ...editingSpot, safetyRank: parseInt(value) as SafetyRank })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - 注意が必要</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3 - 普通</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5 - 非常に安全</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>安全メモ</Label>
                  <Input
                    value={editingSpot?.safetyNote || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (editingSpot) {
                        setEditingSpot({ ...editingSpot, safetyNote: e.target.value })
                      }
                    }}
                  />
                </div>
              </div>

              {/* ボタン */}
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button onClick={saveSpot} style={{ backgroundColor: '#80C342' }} className="text-white">
                  保存する
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 新規登録ダイアログ */}
      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>新規スポット登録</DialogTitle>
          </DialogHeader>

          {editingSpot && (
            <div className="space-y-4">
              {/* スポット名 */}
              <div>
                <Label>スポット名 <span className="text-red-500">*</span></Label>
                <Input
                  value={editingSpot?.name || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (editingSpot) {
                      setEditingSpot({ ...editingSpot, name: e.target.value })
                    }
                  }}
                  placeholder="例: 荒川岩淵水門"
                />
              </div>

              {/* エリア・駅名 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>エリア <span className="text-red-500">*</span></Label>
                  <Select 
                    value={editingSpot?.area || '東京都'}
                    onValueChange={(value: string) => {
                      if (editingSpot) {
                        setEditingSpot({ ...editingSpot, area: value })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="東京都">東京都</SelectItem>
                      <SelectItem value="埼玉県">埼玉県</SelectItem>
                      <SelectItem value="神奈川県">神奈川県</SelectItem>
                      <SelectItem value="千葉県">千葉県</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>最寄り駅 <span className="text-red-500">*</span></Label>
                  <Input
                    value={editingSpot?.station || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (editingSpot) {
                        setEditingSpot({ ...editingSpot, station: e.target.value })
                      }
                    }}
                    placeholder="例: 赤羽岩淵駅"
                  />
                </div>
              </div>

              {/* 徒歩分数・場所タイプ */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>徒歩分数 <span className="text-red-500">*</span></Label>
                  <Input
                    type="number"
                    value={editingSpot?.walkMinutes || 0}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (editingSpot) {
                        setEditingSpot({ ...editingSpot, walkMinutes: parseInt(e.target.value) || 0 })
                      }
                    }}
                  />
                </div>
                <div>
                  <Label>場所タイプ <span className="text-red-500">*</span></Label>
                  <Select 
                    value={editingSpot?.placeType || '公園'}
                    onValueChange={(value: string) => {
                      if (editingSpot) {
                        setEditingSpot({ ...editingSpot, placeType: value as PlaceType })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="公園">公園</SelectItem>
                      <SelectItem value="橋">橋</SelectItem>
                      <SelectItem value="跨線橋">跨線橋</SelectItem>
                      <SelectItem value="展望台">展望台</SelectItem>
                      <SelectItem value="その他">その他</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 住所 */}
              <div>
                <Label>住所 <span className="text-red-500">*</span></Label>
                <Input
                  value={editingSpot?.address || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    if (editingSpot) {
                      setEditingSpot({ ...editingSpot, address: e.target.value })
                    }
                  }}
                  placeholder="例: 東京都北区志茂5-41-1"
                />
              </div>

              {/* 説明 */}
              <div>
                <Label>説明 <span className="text-red-500">*</span></Label>
                <Textarea
                  value={editingSpot?.description || ''}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                    if (editingSpot) {
                      setEditingSpot({ ...editingSpot, description: e.target.value })
                    }
                  }}
                  rows={4}
                  placeholder="スポットの特徴や魅力を記入してください"
                />
              </div>

              {/* 画像 */}
              <div>
                <Label>画像（複数選択可能） <span className="text-red-500">*</span></Label>
                <p className="text-sm text-gray-500 mb-2">※1枚目がメイン画像（サムネイル）になります</p>
                <div className="space-y-2">
                  {/* プレビュー */}
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-3 gap-2">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative aspect-video rounded overflow-hidden border-2 border-gray-200">
                          {index === 0 && (
                            <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded z-10">
                              メイン
                            </div>
                          )}
                          <Image
                            src={preview}
                            alt={`プレビュー${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 z-10"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* アップロードボタン */}
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                      id="new-image-upload"
                    />
                    <Label htmlFor="new-image-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" asChild>
                        <span>
                          <Upload className="w-4 h-4 mr-2" />
                          画像を選択
                        </span>
                      </Button>
                    </Label>
                    {imageFiles.length > 0 && (
                      <span className="text-sm text-gray-500">{imageFiles.length}枚選択中</span>
                    )}
                  </div>
                </div>
              </div>

{/* 見える路線 */}
<div>
                <Label>見える路線 <span className="text-red-500">*</span></Label>
                <p className="text-sm text-gray-500 mb-2">Enterキーまたはカンマで追加</p>
                <TagInput
                  value={editingSpot?.lines || []}
                  onChange={(lines) => {
                    if (editingSpot) {
                      setEditingSpot({ ...editingSpot, lines })
                    }
                  }}
                  placeholder="例: 山手線"
                />
              </div>

              {/* 近くの施設 */}
              <div>
                <Label>近くの施設</Label>
                <p className="text-sm text-gray-500 mb-2">Enterキーまたはカンマで追加</p>
                <TagInput
                  value={editingSpot?.facilities || []}
                  onChange={(facilities) => {
                    if (editingSpot) {
                      setEditingSpot({ ...editingSpot, facilities })
                    }
                  }}
                  placeholder="例: コンビニ"
                />
              </div>

              {/* 安全ランク・メモ */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>安全ランク</Label>
                  <Select 
                    value={editingSpot?.safetyRank?.toString() || '5'}
                    onValueChange={(value: string) => {
                      if (editingSpot) {
                        setEditingSpot({ ...editingSpot, safetyRank: parseInt(value) as SafetyRank })
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - 注意が必要</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3 - 普通</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5 - 非常に安全</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>安全メモ</Label>
                  <Input
                    value={editingSpot?.safetyNote || ''}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (editingSpot) {
                        setEditingSpot({ ...editingSpot, safetyNote: e.target.value })
                      }
                    }}
                    placeholder="例: 柵あり"
                  />
                </div>
              </div>

              {/* ボタン */}
              <div className="flex gap-2 justify-end pt-4">
                <Button variant="outline" onClick={() => setIsNewDialogOpen(false)}>
                  キャンセル
                </Button>
                <Button onClick={createSpot} style={{ backgroundColor: '#80C342' }} className="text-white">
                  登録する
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}