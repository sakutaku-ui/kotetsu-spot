import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

function convertSpotFromDB(dbSpot: any) {
  return {
    id: dbSpot.id,
    name: dbSpot.name,
    area: dbSpot.area,
    station: dbSpot.station,
    walkMinutes: dbSpot.walk_minutes,
    address: dbSpot.address,
    description: dbSpot.description,
    placeType: dbSpot.place_type,
    lines: dbSpot.lines || [],
    facilities: dbSpot.facilities || [],
    additionalImages: dbSpot.additional_images || [],
    safetyRank: dbSpot.safety_rank,
    safetyNote: dbSpot.safety_note || '',
    image: dbSpot.image,
    status: dbSpot.status,
    submittedBy: dbSpot.submitted_by,
    approvedAt: dbSpot.approved_at,
    displayOrder: dbSpot.display_order,
    createdAt: dbSpot.created_at,
    updatedAt: dbSpot.updated_at,
  }
}

export async function GET() {
  const { data, error } = await supabase
    .from('spots')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // データを変換
  const spots = (data || []).map(convertSpotFromDB)

  return NextResponse.json(spots)
}
