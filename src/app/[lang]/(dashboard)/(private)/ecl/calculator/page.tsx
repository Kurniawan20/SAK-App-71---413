// Next Imports
import type { Metadata } from 'next'

// Component Imports
import ECLCalculator from '@/views/ecl/calculator'

// Sample Data Imports
import { 
  getECLParameters,
  getECLCalculationResults
} from '@/data/ecl/eclData'

export const metadata: Metadata = {
  title: 'ECL Calculator'
}

const Page = () => {
  // Fetch data
  const eclParameters = getECLParameters()
  const eclResults = getECLCalculationResults()

  return (
    <ECLCalculator 
      eclParameters={eclParameters}
      eclResults={eclResults}
    />
  )
}

export default Page
