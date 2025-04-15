'use client'

// React Imports
import { useEffect } from 'react'

// Component Imports
import LGDHistoryPage from '@/views/lgd/history'

// Data Imports
import transaksiData from '@/data/master/transaksiData'
import lgdHistoryData from '@/data/lgd/lgdHistoryData'

const LGDHistoryPageWrapper = () => {
  // Set page title
  useEffect(() => {
    document.title = 'Riwayat LGD | LGD Engine'
  }, [])

  return (
    <>
      <LGDHistoryPage 
        transaksiData={transaksiData}
        lgdHistoryData={lgdHistoryData}
      />
    </>
  )
}

export default LGDHistoryPageWrapper
