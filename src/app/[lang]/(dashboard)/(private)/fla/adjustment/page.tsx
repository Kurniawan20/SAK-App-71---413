// Next Imports
import type { Metadata } from 'next'

// Component Imports
import PdLgdAdjustment from '@/views/fla/adjustment'

// Sample Data Imports
import { 
  getEconomicVariables, 
  getEconomicScenarios, 
  getCorrelationMatrices,
  getVariableCorrelations
} from '@/data/fla/economicData'

import {
  getFLAAdjustments,
  getScenarioAdjustments,
  getVariableImpacts,
  getAdjustmentResults
} from '@/data/fla/adjustmentData'

export const metadata: Metadata = {
  title: 'PD/LGD Adjustment'
}

const Page = () => {
  // Fetch data
  const economicVariables = getEconomicVariables()
  const economicScenarios = getEconomicScenarios()
  const correlationMatrices = getCorrelationMatrices()
  const variableCorrelations = getVariableCorrelations()
  const flaAdjustments = getFLAAdjustments()
  const scenarioAdjustments = getScenarioAdjustments()
  const variableImpacts = getVariableImpacts()
  const adjustmentResults = getAdjustmentResults()

  return (
    <PdLgdAdjustment 
      economicVariables={economicVariables}
      economicScenarios={economicScenarios}
      correlationMatrices={correlationMatrices}
      variableCorrelations={variableCorrelations}
      flaAdjustments={flaAdjustments}
      scenarioAdjustments={scenarioAdjustments}
      variableImpacts={variableImpacts}
      adjustmentResults={adjustmentResults}
    />
  )
}

export default Page
