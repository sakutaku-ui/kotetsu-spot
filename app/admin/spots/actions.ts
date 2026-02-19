'use server'

import { createAdminClient } from '@/app/lib/supabase-admin'
import { revalidatePath } from 'next/cache'

export async function createSpot(formData: FormData) {
  const supabase = createAdminClient()
  
  // フォームデータ取得
  const name = formData.get('name') as string
  const area = formData.get('area') as string
  const station = formData.get('station') as string
  const walkMinutes = parseInt(formData.get('walkMinutes') as string)
  const address = formData.get('address') as string
  const description = formData.get('description') as string
  const placeType = formData.get('placeType') as string
  const linesStr = formData.get('lines') as string
  const safetyNote = formData.get('safetyNote') as string || null
  const imageFile = formData.get('image') as File
  
  // 路線を配列に変換
  const lines = linesStr.split(',').map(l => l.trim())
  
  // ファイル名を安全な形式に変換
  const timestamp = Date.now()
  const safeFileName = imageFile.name
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .toLowerCase()
  const fileName = `${timestamp}-${safeFileName}`
  
  // 画像アップロード
  const { error: uploadError } = await supabase.storage
    .from('spots')
    .upload(fileName, imageFile)
  
  if (uploadError) throw new Error(uploadError.message)
  
  // 公開URL取得
  const { data: { publicUrl } } = supabase.storage
    .from('spots')
    .getPublicUrl(fileName)
  
  // spots挿入
  const { error } = await supabase.from('spots').insert({
    name,
    area,
    station,
    walk_minutes: walkMinutes,
    address,
    description,
    place_type: placeType,
    lines,
    safety_rank: 5,
    safety_note: safetyNote,
    image: publicUrl,
    status: 'approved',
  })
  
  if (error) throw new Error(error.message)
  
  revalidatePath('/')
  return { success: true }
}