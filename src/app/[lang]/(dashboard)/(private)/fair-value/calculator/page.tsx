// Next Imports
import type { Metadata } from 'next'

// Component Imports
import FairValueCalculator from '@/views/fair-value/calculator'

// Sample Data Imports
import { getTransaksiData } from '@/data/master/transaksiData'
import { getFairValueData } from '@/data/fair-value/fairValueData'
import { getCashFlowData } from '@/data/fair-value/cashFlowData'

export const metadata: Metadata = {
  title: 'Fair Value Calculator'
}

const Page = () => {
  // Fetch data
  const transaksiData = getTransaksiData()
  const fairValueData = getFairValueData()
  const cashFlowData = getCashFlowData()

  return <FairValueCalculator transaksiData={transaksiData} fairValueData={fairValueData} cashFlowData={cashFlowData} />
}

export default Page
