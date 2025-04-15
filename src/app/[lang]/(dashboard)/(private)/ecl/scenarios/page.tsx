// Next Imports
import type { Metadata } from 'next'

// Component Imports
import EconomicScenarios from '@/views/fla/scenarios'

// Sample Data Imports
import { 
  getEconomicVariables, 
  getEconomicScenarios, 
  getEconomicForecasts 
} from '@/data/fla/economicData'

export const metadata: Metadata = {
  title: 'Economic Scenarios'
}

const Page = () => {
  // Fetch data
  const economicVariables = getEconomicVariables()
  const economicScenarios = getEconomicScenarios()
  const economicForecasts = getEconomicForecasts()

  return (
    <EconomicScenarios 
      economicVariables={economicVariables} 
      economicScenarios={economicScenarios} 
      economicForecasts={economicForecasts} 
    />
  )
}

export default Page
