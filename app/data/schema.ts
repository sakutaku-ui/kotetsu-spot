export type SpotStatus = 'draft' | 'pending' | 'approved' | 'rejected'
export type SafetyRank = 1 | 2 | 3 | 4 | 5
export type PlaceType = '公園' | '橋' | '跨線橋' | '展望台' | 'その他'

export type Spot = {
  id: string
  name: string
  area: string
  station: string
  walkMinutes: number
  address: string
  description: string
  placeType: PlaceType
  lines: string[]
  safetyRank: SafetyRank
  safetyNote: string
  image: string
  status: SpotStatus
  submittedBy?: string
  approvedAt?: string
  displayOrder: number
  createdAt: string
  updatedAt: string
}