// Next Imports
import type { Metadata } from 'next'

// Component Imports
import FLASimulator from '@/views/fla/simulator'

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
  title: 'FLA Simulator'
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
    <FLASimulator 
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
