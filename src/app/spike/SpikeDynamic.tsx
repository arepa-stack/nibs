'use client'
import dynamic from 'next/dynamic'

const SpaceJourney = dynamic(() => import('@/components/spike/SpaceJourneyCanvas'), { ssr: false })

export default function SpikeDynamic() {
  return <SpaceJourney />
}
