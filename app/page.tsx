import { getApprovedSpots } from './data/spots'
import { SpotList } from './components/SpotList'

export default async function Home() {
  const spots = await getApprovedSpots()
  
  return <SpotList initialSpots={spots} />
}