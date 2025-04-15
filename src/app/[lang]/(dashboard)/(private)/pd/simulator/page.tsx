'use client'

// Component Imports
import PDSimulatorPage from '@/views/pd/simulator'

// Data Imports
import migrationMatrixData from '@/data/pd/migrationMatrixData'
import transaksiData from '@/data/master/transaksiData'
import pdResultData from '@/data/pd/pdResultData'

const PDSimulatorPageWrapper = () => {
  return (
    <PDSimulatorPage 
      migrationMatrixData={migrationMatrixData} 
      transaksiData={transaksiData || []} 
      pdResultData={pdResultData}
    />
  )
}

export default PDSimulatorPageWrapper
