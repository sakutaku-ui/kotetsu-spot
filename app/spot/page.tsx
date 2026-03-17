import { getApprovedSpots } from '@/app/data/spots'
import { SpotList } from '@/app/components/SpotList'

export default async function SpotsPage() {
  const spots = await getApprovedSpots()
  
  return <SpotList initialSpots={spots} />
}