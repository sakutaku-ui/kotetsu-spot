import { createClient } from '@/app/lib/supabase'
import { Spot } from './schema'

// Supabaseの型をSpot型に変換
function toSpot(row: any): Spot {
  return {
    id: row.id,
    name: row.name,
    area: row.area,
    station: row.station,
    walkMinutes: row.walk_minutes,
    address: row.address,
    description: row.description,
    placeType: row.place_type,
    lines: row.lines,
    safetyRank: row.safety_rank,
    safetyNote: row.safety_note,
    image: row.image,
    status: row.status,
    submittedBy: row.submitted_by,
    approvedAt: row.approved_at,
    displayOrder: row.display_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

// 承認済みスポット取得
export async function getApprovedSpots(): Promise<Spot[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .eq('status', 'approved')
    .order('display_order', { ascending: true })
  
  if (error) {
    console.error('Error fetching spots:', error)
    return []
  }
  
  return data.map(toSpot)
}

// ID指定で取得
export async function getSpotById(id: string): Promise<Spot | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching spot:', error)
    return null
  }
  
  return toSpot(data)
}