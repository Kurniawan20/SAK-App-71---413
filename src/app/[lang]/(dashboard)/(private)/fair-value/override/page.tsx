// Next Imports
import type { Metadata } from 'next'

// Component Imports
import ManualOverride from '@/views/fair-value/override'

// Sample Data Imports
import { getTransaksiData } from '@/data/master/transaksiData'
import { getFairValueData } from '@/data/fair-value/fairValueData'

export const metadata: Metadata = {
  title: 'Fair Value Manual Override'
}

const Page = () => {
  // Fetch data
  const transaksiData = getTransaksiData()
  const fairValueData = getFairValueData()

  return <ManualOverride transaksiData={transaksiData} fairValueData={fairValueData} />
}

export default Page
