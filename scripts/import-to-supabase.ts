import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { resolve } from 'path'
import spotsData from '../app/data/spots.json'

// .env.localを読み込む
config({ path: resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 環境変数が設定されていません')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseKey ? '設定済み' : '未設定')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function importSpots() {
  console.log('Starting import...')
  
  for (const spot of spotsData) {
    const { error } = await supabase
      .from('spots')
      .insert({
        id: spot.id,
        name: spot.name,
        area: spot.area,
        station: spot.station,
        walk_minutes: spot.walkMinutes,
        address: spot.address,
        description: spot.description,
        place_type: spot.placeType,
        lines: spot.lines,
        safety_rank: spot.safetyRank,
        safety_note: spot.safetyNote,
        image: spot.image,
        status: spot.status,
        submitted_by: null,
        approved_at: spot.approvedAt || null,
        display_order: spot.displayOrder,
        created_at: spot.createdAt,
        updated_at: spot.updatedAt,
      })
    
    if (error) {
      console.error('❌ Error importing:', spot.name, error)
    } else {
      console.log('✅ Imported:', spot.name)
    }
  }
  
  console.log('Import complete!')
}

importSpots()