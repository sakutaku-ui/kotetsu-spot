import { getApprovedSpots } from '@/app/data/spots'
import { NextResponse } from 'next/server'

export async function GET() {
  const spots = await getApprovedSpots()
  return NextResponse.json(spots)
}