'use client'

import { useState, useRef } from 'react'
import { createSpot } from '../actions'

export default function NewSpotPage() {
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    
    try {
      await createSpot(new FormData(e.currentTarget))
      alert('✅ 登録完了')
      formRef.current?.reset()  // useRefを使ってリセット
    } catch (error) {
      alert(`❌ エラー: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">新規スポット登録</h1>
          
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">スポット名 *</label>
              <input
                name="name"
                required
                className="w-full px-3 py-2 border rounded"
                placeholder="田端大橋 跨線橋"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">エリア *</label>
              <input
                name="area"
                required
                className="w-full px-3 py-2 border rounded"
                placeholder="東京23区"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">最寄り駅 *</label>
              <input
                name="station"
                required
                className="w-full px-3 py-2 border rounded"
                placeholder="田端駅"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">徒歩分数 *</label>
              <input
                name="walkMinutes"
                type="number"
                required
                min="1"
                className="w-full px-3 py-2 border rounded"
                placeholder="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">住所 *</label>
              <input
                name="address"
                required
                className="w-full px-3 py-2 border rounded"
                placeholder="東京都北区田端"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">場所タイプ *</label>
              <select name="placeType" required className="w-full px-3 py-2 border rounded">
                <option value="">選択してください</option>
                <option value="公園">公園</option>
                <option value="橋">橋</option>
                <option value="跨線橋">跨線橋</option>
                <option value="展望台">展望台</option>
                <option value="その他">その他</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">見える路線（カンマ区切り） *</label>
              <input
                name="lines"
                required
                className="w-full px-3 py-2 border rounded"
                placeholder="山手線, 京浜東北線, 東北本線"
              />
              <p className="text-xs text-gray-500 mt-1">複数の路線はカンマで区切って入力</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">説明 *</label>
              <textarea
                name="description"
                required
                rows={4}
                className="w-full px-3 py-2 border rounded"
                placeholder="跨線橋の中央から複数路線を見下ろせる。"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">安全メモ</label>
              <textarea
                name="safetyNote"
                rows={2}
                className="w-full px-3 py-2 border rounded"
                placeholder="歩道幅2m、柵あり、車道と分離"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">画像 *</label>
              <input
                name="image"
                type="file"
                accept="image/*"
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? '登録中...' : '登録する'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}