import { getSpotById } from '@/app/data/spots'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const spot = await getSpotById(params.id)
  
  if (!spot) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  
  return NextResponse.json(spot)
}