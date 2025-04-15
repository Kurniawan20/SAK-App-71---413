// Next Imports
import type { Metadata } from 'next'

// Component Imports
import StagingRulesManager from '@/views/ecl/staging'

// Sample Data Imports
import { 
  getECLParameters
} from '@/data/ecl/eclData'

export const metadata: Metadata = {
  title: 'Staging Rules Manager'
}

const Page = () => {
  // Fetch data
  const eclParameters = getECLParameters()
  const stagingRules = eclParameters[0]?.default_staging_rules || []

  return (
    <StagingRulesManager 
      eclParameters={eclParameters}
      stagingRules={stagingRules}
    />
  )
}

export default Page
