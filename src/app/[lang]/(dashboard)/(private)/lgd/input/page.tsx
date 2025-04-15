'use client'

// React Imports
import { useEffect } from 'react'

// Component Imports
import LGDInputPage from '@/views/lgd/input'

// Data Imports
import transaksiData from '@/data/master/transaksiData'
import agunanData from '@/data/lgd/agunanData'
import lgdData from '@/data/lgd/lgdData'

const LGDInputPageWrapper = () => {
  // Set page title
  useEffect(() => {
    document.title = 'Input Agunan | LGD Engine'
  }, [])

  return (
    <>
      <LGDInputPage 
        transaksiData={transaksiData}
        agunanData={agunanData}
        lgdData={lgdData}
      />
    </>
  )
}

export default LGDInputPageWrapper
