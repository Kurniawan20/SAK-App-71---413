'use client'

// Component Imports
import KolektibilitasHistoryPage from '@/views/pd/history'

// Data Imports
import kolektibilitasHistoryData from '@/data/pd/kolektibilitasHistoryData'
import transaksiData from '@/data/master/transaksiData'

const KolektibilitasHistoryPageWrapper = () => {
  return (
    <KolektibilitasHistoryPage 
      historyData={kolektibilitasHistoryData} 
      transaksiData={transaksiData || []}
    />
  )
}

export default KolektibilitasHistoryPageWrapper
