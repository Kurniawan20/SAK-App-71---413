// Next Imports
import type { Metadata } from 'next'

// Component Imports
import AmortizedCost from '@/views/fair-value/amortized'

// Sample Data Imports
import { getTransaksiData } from '@/data/master/transaksiData'
import { getFairValueData } from '@/data/fair-value/fairValueData'
import { getCashFlowData } from '@/data/fair-value/cashFlowData'

export const metadata: Metadata = {
  title: 'Amortized Cost'
}

const Page = () => {
  // Fetch data
  const transaksiData = getTransaksiData()
  const fairValueData = getFairValueData()
  const cashFlowData = getCashFlowData()

  return <AmortizedCost transaksiData={transaksiData} fairValueData={fairValueData} cashFlowData={cashFlowData} />
}

export default Page
