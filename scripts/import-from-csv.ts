import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'
import * as fs from 'fs'
import * as path from 'path'

// .env.localを読み込む
config({ path: resolve(process.cwd(), '.env.local') })

// 環境変数を確認
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 環境変数が設定されていません')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ 設定済み' : '❌ 未設定')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅ 設定済み' : '❌ 未設定')
  console.error('\n.env.local ファイルを確認してください')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function importFromCSV() {
  // CSVファイルを読み込む
  const csvPath = path.join(process.cwd(), 'spots.csv')
  
  if (!fs.existsSync(csvPath)) {
    console.error('❌ spots.csv が見つかりません')
    console.error('プロジェクトルートに spots.csv を配置してください')
    return
  }
  
  const csvContent = fs.readFileSync(csvPath, 'utf-8')
  
  // 行ごとに分割（1行目はヘッダーなのでスキップ）
  const lines = csvContent.split('\n').slice(1)
  
  console.log(`📄 ${lines.length}件のスポットを処理します...\n`)
  
  let successCount = 0
  let errorCount = 0
  
  for (const line of lines) {
    if (!line.trim()) continue // 空行はスキップ
    
    try {
      // CSVパース（カンマ区切り、ダブルクォート対応）
      const columns = parseCSVLine(line)
      
      if (columns.length < 9) {
        console.log(`⚠️  列が不足しています。スキップします`)
        errorCount++
        continue
      }
      
      const [
        name,
        area,
        station,
        walkMinutes,
        address,
        placeType,
        linesStr,
        description,
        imageFileName,
        safetyNote = '',
        facilitiesStr = '' // 11列目: 近くの施設（オプション）
      ] = columns
      
      console.log(`処理中: ${name}`)
      
      // 1. 画像をアップロード
      const imagePath = path.join(process.cwd(), 'temp-images', imageFileName.trim())
      
      if (!fs.existsSync(imagePath)) {
        console.log(`  ⚠️  画像が見つかりません: ${imageFileName}`)
        console.log(`  パス: ${imagePath}`)
        errorCount++
        continue
      }
      
      const imageBuffer = fs.readFileSync(imagePath)
      const timestamp = Date.now()
      const safeFileName = imageFileName
        .trim()
        .replace(/[^a-zA-Z0-9.-]/g, '_')
        .replace(/_+/g, '_')
        .toLowerCase()
      const storageFileName = `${timestamp}-${safeFileName}`
      
      const { error: uploadError } = await supabase.storage
        .from('spots')
        .upload(storageFileName, imageBuffer)
      
      if (uploadError) {
        console.log(`  ❌ 画像アップロードエラー: ${uploadError.message}`)
        errorCount++
        continue
      }
      
      console.log(`  ✅ 画像アップロード成功`)
      
      // 2. 公開URLを取得
      const { data: { publicUrl } } = supabase.storage
        .from('spots')
        .getPublicUrl(storageFileName)
      
      // 3. 路線を配列に変換
      const linesList = linesStr.split(',').map(l => l.trim()).filter(l => l)
      
      // 4. 施設を配列に変換
      const facilitiesList = facilitiesStr && facilitiesStr.trim() !== ''
        ? facilitiesStr.split(',').map(f => f.trim()).filter(f => f)
        : []
      
      // 5. Supabaseに登録
      const { error: insertError } = await supabase
        .from('spots')
        .insert({
          name: name.trim(),
          area: area.trim(),
          station: station.trim(),
          walk_minutes: parseInt(walkMinutes),
          address: address.trim(),
          description: description.trim(),
          place_type: placeType.trim(),
          lines: linesList,
          facilities: facilitiesList, // 追加
          safety_rank: 5, // 固定値（全て安全と判断したもののみ登録）
          safety_note: safetyNote ? safetyNote.trim() : null,
          image: publicUrl,
          status: 'approved',
        })
      
      if (insertError) {
        console.log(`  ❌ 登録エラー: ${insertError.message}`)
        errorCount++
      } else {
        console.log(`  ✅ 登録完了`)
        if (facilitiesList.length > 0) {
          console.log(`  📍 施設: ${facilitiesList.join(', ')}`)
        }
        successCount++
      }
      
      console.log('')
      
    } catch (error) {
      console.log(`  ❌ エラー: ${error}`)
      errorCount++
      console.log('')
    }
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`🎉 インポート完了！`)
  console.log(`✅ 成功: ${successCount}件`)
  console.log(`❌ 失敗: ${errorCount}件`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

// CSV行をパース（ダブルクォート対応）
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current)
  return result
}

importFromCSV()
