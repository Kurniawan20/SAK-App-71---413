// Next Imports
import type { Metadata } from 'next'

// Component Imports
import ECLBatchProcessing from '@/views/ecl/batch'

// Sample Data Imports
import { 
  getECLParameters,
  getECLCalculationBatches
} from '@/data/ecl/eclData'

export const metadata: Metadata = {
  title: 'ECL Batch Processing'
}

const Page = () => {
  // Fetch data
  const eclParameters = getECLParameters()
  const eclBatches = getECLCalculationBatches()

  return (
    <ECLBatchProcessing 
      eclParameters={eclParameters}
      eclBatches={eclBatches}
    />
  )
}

export default Page
