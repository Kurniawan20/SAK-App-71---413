'use client'

// React Imports
import { useEffect } from 'react'

// Component Imports
import LGDAnalysisPage from '@/views/lgd/analysis'

// Data Imports
import transaksiData from '@/data/master/transaksiData'
import agunanData from '@/data/lgd/agunanData'
import lgdData from '@/data/lgd/lgdData'

const LGDAnalysisPageWrapper = () => {
  // Set page title
  useEffect(() => {
    document.title = 'Analisis LGD | LGD Engine'
  }, [])

  return (
    <>
      <LGDAnalysisPage 
        transaksiData={transaksiData}
        agunanData={agunanData}
        lgdData={lgdData}
      />
    </>
  )
}

export default LGDAnalysisPageWrapper
