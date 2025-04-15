// Types for FLA Adjustments
import type { EconomicScenario, EconomicVariable } from './economicData'

export interface FLAAdjustment {
  adjustment_id: number
  name: string
  description: string
  effective_date: string
  expiry_date: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ScenarioAdjustment {
  scenario_adjustment_id: number
  adjustment_id: number
  scenario_id: number
  segment: 'Retail' | 'Commercial' | 'Corporate' | 'All'
  pd_adjustment_factor: number
  lgd_adjustment_factor: number
  created_at: string
  updated_at: string
  // References for UI display
  scenario?: EconomicScenario
}

export interface VariableImpact {
  impact_id: number
  adjustment_id: number
  variable_id: number
  impact_weight: number
  created_at: string
  updated_at: string
  // References for UI display
  variable?: EconomicVariable
}

export interface AdjustmentResult {
  result_id: number
  adjustment_id: number
  scenario_id: number
  segment: 'Retail' | 'Commercial' | 'Corporate' | 'All'
  original_pd: number
  adjusted_pd: number
  original_lgd: number
  adjusted_lgd: number
  effective_date: string
  created_at: string
  updated_at: string
}

// Helper function to get all FLA adjustments
export const getFLAAdjustments = (): FLAAdjustment[] => {
  return flaAdjustments
}

// Helper function to get all scenario adjustments
export const getScenarioAdjustments = (): ScenarioAdjustment[] => {
  return scenarioAdjustments
}

// Helper function to get scenario adjustments by adjustment ID
export const getScenarioAdjustmentsByAdjustmentId = (adjustmentId: number): ScenarioAdjustment[] => {
  return scenarioAdjustments.filter(sa => sa.adjustment_id === adjustmentId)
}

// Helper function to get all variable impacts
export const getVariableImpacts = (): VariableImpact[] => {
  return variableImpacts
}

// Helper function to get variable impacts by adjustment ID
export const getVariableImpactsByAdjustmentId = (adjustmentId: number): VariableImpact[] => {
  return variableImpacts.filter(vi => vi.adjustment_id === adjustmentId)
}

// Helper function to get all adjustment results
export const getAdjustmentResults = (): AdjustmentResult[] => {
  return adjustmentResults
}

// Helper function to get adjustment results by adjustment ID
export const getAdjustmentResultsByAdjustmentId = (adjustmentId: number): AdjustmentResult[] => {
  return adjustmentResults.filter(ar => ar.adjustment_id === adjustmentId)
}

// Sample FLA Adjustments
const flaAdjustments: FLAAdjustment[] = [
  {
    adjustment_id: 1,
    name: 'Q1 2025 FLA',
    description: 'Forward Looking Adjustment for Q1 2025',
    effective_date: '2025-01-01',
    expiry_date: '2025-03-31',
    is_active: true,
    created_at: '2024-12-15T00:00:00',
    updated_at: '2024-12-15T00:00:00'
  },
  {
    adjustment_id: 2,
    name: 'Q2 2025 FLA',
    description: 'Forward Looking Adjustment for Q2 2025',
    effective_date: '2025-04-01',
    expiry_date: '2025-06-30',
    is_active: true,
    created_at: '2025-03-15T00:00:00',
    updated_at: '2025-03-15T00:00:00'
  },
  {
    adjustment_id: 3,
    name: 'Pandemic Stress Scenario',
    description: 'Special adjustment for pandemic stress scenario',
    effective_date: '2025-01-01',
    expiry_date: '2025-12-31',
    is_active: false,
    created_at: '2024-12-01T00:00:00',
    updated_at: '2024-12-01T00:00:00'
  }
]

// Sample Scenario Adjustments
const scenarioAdjustments: ScenarioAdjustment[] = [
  // Q1 2025 FLA - Base Scenario
  {
    scenario_adjustment_id: 1,
    adjustment_id: 1,
    scenario_id: 1,
    segment: 'All',
    pd_adjustment_factor: 1.05, // 5% increase in PD
    lgd_adjustment_factor: 1.02, // 2% increase in LGD
    created_at: '2024-12-15T00:00:00',
    updated_at: '2024-12-15T00:00:00'
  },
  // Q1 2025 FLA - Upside Scenario
  {
    scenario_adjustment_id: 2,
    adjustment_id: 1,
    scenario_id: 2,
    segment: 'All',
    pd_adjustment_factor: 0.95, // 5% decrease in PD
    lgd_adjustment_factor: 0.98, // 2% decrease in LGD
    created_at: '2024-12-15T00:00:00',
    updated_at: '2024-12-15T00:00:00'
  },
  // Q1 2025 FLA - Downside Scenario
  {
    scenario_adjustment_id: 3,
    adjustment_id: 1,
    scenario_id: 3,
    segment: 'All',
    pd_adjustment_factor: 1.15, // 15% increase in PD
    lgd_adjustment_factor: 1.10, // 10% increase in LGD
    created_at: '2024-12-15T00:00:00',
    updated_at: '2024-12-15T00:00:00'
  },
  // Q1 2025 FLA - Severe Downside Scenario
  {
    scenario_adjustment_id: 4,
    adjustment_id: 1,
    scenario_id: 4,
    segment: 'All',
    pd_adjustment_factor: 1.30, // 30% increase in PD
    lgd_adjustment_factor: 1.20, // 20% increase in LGD
    created_at: '2024-12-15T00:00:00',
    updated_at: '2024-12-15T00:00:00'
  },
  
  // Q2 2025 FLA - Base Scenario
  {
    scenario_adjustment_id: 5,
    adjustment_id: 2,
    scenario_id: 1,
    segment: 'Retail',
    pd_adjustment_factor: 1.08, // 8% increase in PD for Retail
    lgd_adjustment_factor: 1.05, // 5% increase in LGD for Retail
    created_at: '2025-03-15T00:00:00',
    updated_at: '2025-03-15T00:00:00'
  },
  {
    scenario_adjustment_id: 6,
    adjustment_id: 2,
    scenario_id: 1,
    segment: 'Commercial',
    pd_adjustment_factor: 1.06, // 6% increase in PD for Commercial
    lgd_adjustment_factor: 1.03, // 3% increase in LGD for Commercial
    created_at: '2025-03-15T00:00:00',
    updated_at: '2025-03-15T00:00:00'
  },
  {
    scenario_adjustment_id: 7,
    adjustment_id: 2,
    scenario_id: 1,
    segment: 'Corporate',
    pd_adjustment_factor: 1.04, // 4% increase in PD for Corporate
    lgd_adjustment_factor: 1.02, // 2% increase in LGD for Corporate
    created_at: '2025-03-15T00:00:00',
    updated_at: '2025-03-15T00:00:00'
  },
  
  // Pandemic Stress Scenario - Base Scenario
  {
    scenario_adjustment_id: 8,
    adjustment_id: 3,
    scenario_id: 1,
    segment: 'All',
    pd_adjustment_factor: 1.50, // 50% increase in PD
    lgd_adjustment_factor: 1.30, // 30% increase in LGD
    created_at: '2024-12-01T00:00:00',
    updated_at: '2024-12-01T00:00:00'
  }
]

// Sample Variable Impacts
const variableImpacts: VariableImpact[] = [
  // Q1 2025 FLA
  {
    impact_id: 1,
    adjustment_id: 1,
    variable_id: 1, // GDP Growth
    impact_weight: 0.3, // 30% weight
    created_at: '2024-12-15T00:00:00',
    updated_at: '2024-12-15T00:00:00'
  },
  {
    impact_id: 2,
    adjustment_id: 1,
    variable_id: 2, // Inflation Rate
    impact_weight: 0.2, // 20% weight
    created_at: '2024-12-15T00:00:00',
    updated_at: '2024-12-15T00:00:00'
  },
  {
    impact_id: 3,
    adjustment_id: 1,
    variable_id: 4, // Interest Rate
    impact_weight: 0.25, // 25% weight
    created_at: '2024-12-15T00:00:00',
    updated_at: '2024-12-15T00:00:00'
  },
  {
    impact_id: 4,
    adjustment_id: 1,
    variable_id: 5, // Unemployment Rate
    impact_weight: 0.25, // 25% weight
    created_at: '2024-12-15T00:00:00',
    updated_at: '2024-12-15T00:00:00'
  },
  
  // Q2 2025 FLA
  {
    impact_id: 5,
    adjustment_id: 2,
    variable_id: 1, // GDP Growth
    impact_weight: 0.25, // 25% weight
    created_at: '2025-03-15T00:00:00',
    updated_at: '2025-03-15T00:00:00'
  },
  {
    impact_id: 6,
    adjustment_id: 2,
    variable_id: 2, // Inflation Rate
    impact_weight: 0.15, // 15% weight
    created_at: '2025-03-15T00:00:00',
    updated_at: '2025-03-15T00:00:00'
  },
  {
    impact_id: 7,
    adjustment_id: 2,
    variable_id: 3, // Exchange Rate
    impact_weight: 0.2, // 20% weight
    created_at: '2025-03-15T00:00:00',
    updated_at: '2025-03-15T00:00:00'
  },
  {
    impact_id: 8,
    adjustment_id: 2,
    variable_id: 4, // Interest Rate
    impact_weight: 0.2, // 20% weight
    created_at: '2025-03-15T00:00:00',
    updated_at: '2025-03-15T00:00:00'
  },
  {
    impact_id: 9,
    adjustment_id: 2,
    variable_id: 5, // Unemployment Rate
    impact_weight: 0.2, // 20% weight
    created_at: '2025-03-15T00:00:00',
    updated_at: '2025-03-15T00:00:00'
  }
]

// Sample Adjustment Results
const adjustmentResults: AdjustmentResult[] = [
  // Q1 2025 FLA - Base Scenario
  {
    result_id: 1,
    adjustment_id: 1,
    scenario_id: 1,
    segment: 'Retail',
    original_pd: 0.05, // 5% PD
    adjusted_pd: 0.0525, // 5.25% PD after adjustment
    original_lgd: 0.4, // 40% LGD
    adjusted_lgd: 0.408, // 40.8% LGD after adjustment
    effective_date: '2025-01-01',
    created_at: '2024-12-15T00:00:00',
    updated_at: '2024-12-15T00:00:00'
  },
  {
    result_id: 2,
    adjustment_id: 1,
    scenario_id: 1,
    segment: 'Commercial',
    original_pd: 0.03, // 3% PD
    adjusted_pd: 0.0315, // 3.15% PD after adjustment
    original_lgd: 0.35, // 35% LGD
    adjusted_lgd: 0.357, // 35.7% LGD after adjustment
    effective_date: '2025-01-01',
    created_at: '2024-12-15T00:00:00',
    updated_at: '2024-12-15T00:00:00'
  },
  {
    result_id: 3,
    adjustment_id: 1,
    scenario_id: 1,
    segment: 'Corporate',
    original_pd: 0.02, // 2% PD
    adjusted_pd: 0.021, // 2.1% PD after adjustment
    original_lgd: 0.3, // 30% LGD
    adjusted_lgd: 0.306, // 30.6% LGD after adjustment
    effective_date: '2025-01-01',
    created_at: '2024-12-15T00:00:00',
    updated_at: '2024-12-15T00:00:00'
  },
  
  // Q1 2025 FLA - Downside Scenario
  {
    result_id: 4,
    adjustment_id: 1,
    scenario_id: 3,
    segment: 'Retail',
    original_pd: 0.05, // 5% PD
    adjusted_pd: 0.0575, // 5.75% PD after adjustment
    original_lgd: 0.4, // 40% LGD
    adjusted_lgd: 0.44, // 44% LGD after adjustment
    effective_date: '2025-01-01',
    created_at: '2024-12-15T00:00:00',
    updated_at: '2024-12-15T00:00:00'
  },
  {
    result_id: 5,
    adjustment_id: 1,
    scenario_id: 3,
    segment: 'Commercial',
    original_pd: 0.03, // 3% PD
    adjusted_pd: 0.0345, // 3.45% PD after adjustment
    original_lgd: 0.35, // 35% LGD
    adjusted_lgd: 0.385, // 38.5% LGD after adjustment
    effective_date: '2025-01-01',
    created_at: '2024-12-15T00:00:00',
    updated_at: '2024-12-15T00:00:00'
  },
  {
    result_id: 6,
    adjustment_id: 1,
    scenario_id: 3,
    segment: 'Corporate',
    original_pd: 0.02, // 2% PD
    adjusted_pd: 0.023, // 2.3% PD after adjustment
    original_lgd: 0.3, // 30% LGD
    adjusted_lgd: 0.33, // 33% LGD after adjustment
    effective_date: '2025-01-01',
    created_at: '2024-12-15T00:00:00',
    updated_at: '2024-12-15T00:00:00'
  }
]

export default flaAdjustments
