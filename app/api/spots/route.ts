import { getApprovedSpots } from '@/app/data/spots'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const spots = await getApprovedSpots()
    
    return NextResponse.json(spots, {
      headers: {
        'Cache-Control': 'no-store, max-age=0, must-revalidate',
      }
    })
  } catch (error) {
    console.error('Error fetching spots:', error)
    return NextResponse.json({ error: 'Failed to fetch spots' }, { status: 500 })
  }
}