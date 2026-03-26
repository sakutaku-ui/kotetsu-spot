import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
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
    const imageFiles = formData.getAll('images') as File[]

    // バリデーション
    if (!name || imageFiles.length === 0) {
      return NextResponse.json(
        { error: 'スポット名と画像（最低1枚）は必須です' }, 
        { status: 400 }
      )
    }

    // 全画像をアップロード
    const uploadedUrls: string[] = []
    const timestamp = Date.now()

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i]
      const fileName = `${timestamp}-${i}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      
      const { error: uploadError } = await supabase.storage
        .from('spots')
        .upload(fileName, file)

      if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 500 })
      }

      const { data: { publicUrl } } = supabase.storage
        .from('spots')
        .getPublicUrl(fileName)

      uploadedUrls.push(publicUrl)
    }

    // 1枚目がメイン画像、全画像を additional_images に保存
    const mainImage = uploadedUrls[0]
    const additionalImages = uploadedUrls

    // スポット情報を登録
    const { data, error } = await supabase
      .from('spots')
      .insert({
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
        image: mainImage,
        additional_images: additionalImages.length > 0 ? additionalImages : null,
        status,
        display_order: 999,
      })
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    )
  }
}