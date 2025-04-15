'use client'

// React Imports
import { useEffect } from 'react'

// Component Imports
import RecoverySimulator from '@/views/lgd/simulator'

// Data Imports
import transaksiData from '@/data/master/transaksiData'
import agunanData from '@/data/lgd/agunanData'

const RecoverySimulatorPageWrapper = () => {
  // Set page title
  useEffect(() => {
    document.title = 'Recovery Simulator | LGD Engine'
  }, [])

  return (
    <>
      <RecoverySimulator 
        transaksiData={transaksiData}
        agunanData={agunanData}
      />
    </>
  )
}

export default RecoverySimulatorPageWrapper
