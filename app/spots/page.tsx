import { getApprovedSpots } from '@/app/data/spots'
import { SpotList } from '@/app/components/SpotList'

export default async function SpotsPage({
  searchParams,
}: {
  searchParams: Promise<{ area?: string }>
}) {
  const spots = await getApprovedSpots()
  const params = await searchParams
  
  return <SpotList initialSpots={spots} initialArea={params.area} />
}