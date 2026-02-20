import { getSpotById } from '@/app/data/spots'
import Image from 'next/image'
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
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-blue-600 text-center">🚃 子鉄スポット帳</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* 戻るボタン */}
          <div className="p-4">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              ← もどる
            </a>
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{spot.name}</h2>

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

              {/* アクセス */}
              <div>
                <span className="font-semibold text-gray-800">📍 アクセス：</span>
                <p className="mt-1">{spot.station} 徒歩{spot.walkMinutes}分</p>
              </div>

              {/* 住所 */}
              <div>
                <span className="font-semibold text-gray-800">🏠 住所：</span>
                <p className="mt-1">{spot.address}</p>
              </div>

              {/* 場所タイプ */}
              <div>
                <span className="font-semibold text-gray-800">🏷️ 場所タイプ：</span>
                <p className="mt-1">{spot.placeType}</p>
              </div>

              {/* 説明 */}
              <div className="pt-3 border-t">
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{spot.description}</p>
              </div>

              {/* 安全メモ */}
              {spot.safetyNote && (
                <div className="pt-3 border-t">
                  <span className="font-semibold text-gray-700">🛡️ 安全面：</span>
                  <p className="text-gray-600 mt-1">{spot.safetyNote}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}