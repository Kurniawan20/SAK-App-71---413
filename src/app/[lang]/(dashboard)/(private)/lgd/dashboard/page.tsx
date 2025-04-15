'use client'

// React Imports
import { useEffect } from 'react'

// Component Imports
import LGDDashboard from '@/views/lgd/dashboard'

// Data Imports
import transaksiData from '@/data/master/transaksiData'
import agunanData from '@/data/lgd/agunanData'
import lgdData from '@/data/lgd/lgdData'

const LGDDashboardPageWrapper = () => {
  // Set page title
  useEffect(() => {
    document.title = 'Dashboard LGD | LGD Engine'
  }, [])

  return (
    <>
      <LGDDashboard 
        transaksiData={transaksiData}
        agunanData={agunanData}
        lgdData={lgdData}
      />
    </>
  )
}

export default LGDDashboardPageWrapper
