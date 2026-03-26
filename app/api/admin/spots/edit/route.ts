import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const formData = await request.formData()
  
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const area = formData.get('area') as string
  const station = formData.get('station') as string
  const walkMinutes = parseInt(formData.get('walkMinutes') as string)
  const address = formData.get('address') as string
  const description = formData.get('description') as string
  const placeType = formData.get('placeType') as string
  const lines = JSON.parse(formData.get('lines') as string)
  const facilities = JSON.parse(formData.get('facilities') as string)
  const safetyRank = parseInt(formData.get('safetyRank') as string)
  const safetyNote = formData.get('safetyNote') as string
  const status = formData.get('status') as string
  const imageFile = formData.get('image') as File | null

  let imageUrl = null

  // 画像がアップロードされた場合
  if (imageFile) {
    const timestamp = Date.now()
    const fileName = `${timestamp}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    
    const { error: uploadError } = await supabase.storage
      .from('spots')
      .upload(fileName, imageFile)

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('spots')
      .getPublicUrl(fileName)

    imageUrl = publicUrl
  }

  // スポット情報を更新
  const updateData: any = {
    name,
    area,
    station,
    walk_minutes: walkMinutes,
    address,
    description,
    place_type: placeType,
    lines,
    facilities,
    safety_rank: safetyRank,
    safety_note: safetyNote,
    status,
    updated_at: new Date().toISOString()
  }

  if (imageUrl) {
    updateData.image = imageUrl
  }

  const { data, error } = await supabase
    .from('spots')
    .update(updateData)
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}