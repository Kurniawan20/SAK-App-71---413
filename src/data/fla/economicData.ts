// Types for Economic Variables and Scenarios
export type EconomicVariableType = 
  | 'GDP Growth' 
  | 'Inflation Rate' 
  | 'Exchange Rate' 
  | 'Interest Rate' 
  | 'Unemployment Rate'
  | 'Commodity Price'
  | 'Property Price Index'
  | 'Stock Market Index'
  | 'Custom'

export interface EconomicVariable {
  variable_id: number
  name: string
  type: EconomicVariableType
  unit: string
  description: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type ScenarioType = 'Base' | 'Upside' | 'Downside' | 'Severe Downside'

export interface EconomicScenario {
  scenario_id: number
  name: string
  type: ScenarioType
  description: string
  probability: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface EconomicForecast {
  forecast_id: number
  scenario_id: number
  variable_id: number
  period: string // YYYY-MM format
  value: number
  created_at: string
  updated_at: string
  // References for UI display
  variable?: EconomicVariable
  scenario?: EconomicScenario
}

export interface CorrelationMatrix {
  matrix_id: number
  name: string
  description: string
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface VariableCorrelation {
  correlation_id: number
  matrix_id: number
  variable_id: number
  pd_correlation: number
  lgd_correlation: number
  created_at: string
  updated_at: string
  // References for UI display
  variable?: EconomicVariable
}

// Helper function to get all economic variables
export const getEconomicVariables = (): EconomicVariable[] => {
  return economicVariables
}

// Helper function to get all economic scenarios
export const getEconomicScenarios = (): EconomicScenario[] => {
  return economicScenarios
}

// Helper function to get all economic forecasts
export const getEconomicForecasts = (): EconomicForecast[] => {
  return economicForecasts
}

// Helper function to get all correlation matrices
export const getCorrelationMatrices = (): CorrelationMatrix[] => {
  return correlationMatrices
}

// Helper function to get all variable correlations
export const getVariableCorrelations = (): VariableCorrelation[] => {
  return variableCorrelations
}

// Helper function to get variable correlations by matrix ID
export const getVariableCorrelationsByMatrixId = (matrixId: number): VariableCorrelation[] => {
  return variableCorrelations.filter(vc => vc.matrix_id === matrixId)
}

// Helper function to get forecasts by scenario ID
export const getForecastsByScenarioId = (scenarioId: number): EconomicForecast[] => {
  return economicForecasts.filter(ef => ef.scenario_id === scenarioId)
}

// Sample Economic Variables
const economicVariables: EconomicVariable[] = [
  {
    variable_id: 1,
    name: 'GDP Growth Rate',
    type: 'GDP Growth',
    unit: '%',
    description: 'Annual GDP growth rate of Indonesia',
    is_active: true,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    variable_id: 2,
    name: 'Inflation Rate',
    type: 'Inflation Rate',
    unit: '%',
    description: 'Annual inflation rate of Indonesia',
    is_active: true,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    variable_id: 3,
    name: 'USD/IDR Exchange Rate',
    type: 'Exchange Rate',
    unit: 'IDR',
    description: 'Exchange rate of USD to IDR',
    is_active: true,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    variable_id: 4,
    name: 'BI Rate',
    type: 'Interest Rate',
    unit: '%',
    description: 'Bank Indonesia interest rate',
    is_active: true,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    variable_id: 5,
    name: 'Unemployment Rate',
    type: 'Unemployment Rate',
    unit: '%',
    description: 'Unemployment rate of Indonesia',
    is_active: true,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    variable_id: 6,
    name: 'Crude Oil Price',
    type: 'Commodity Price',
    unit: 'USD',
    description: 'Crude oil price per barrel',
    is_active: true,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    variable_id: 7,
    name: 'Property Price Index',
    type: 'Property Price Index',
    unit: 'Index',
    description: 'Property price index of Indonesia',
    is_active: true,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    variable_id: 8,
    name: 'Jakarta Composite Index',
    type: 'Stock Market Index',
    unit: 'Index',
    description: 'Jakarta Composite Index (IHSG)',
    is_active: true,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  }
]

// Sample Economic Scenarios
const economicScenarios: EconomicScenario[] = [
  {
    scenario_id: 1,
    name: 'Base Case',
    type: 'Base',
    description: 'Most likely economic scenario based on current trends',
    probability: 0.6,
    is_active: true,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    scenario_id: 2,
    name: 'Upside Scenario',
    type: 'Upside',
    description: 'Optimistic economic scenario with better than expected performance',
    probability: 0.2,
    is_active: true,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    scenario_id: 3,
    name: 'Downside Scenario',
    type: 'Downside',
    description: 'Pessimistic economic scenario with worse than expected performance',
    probability: 0.15,
    is_active: true,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    scenario_id: 4,
    name: 'Severe Downside Scenario',
    type: 'Severe Downside',
    description: 'Severe economic downturn scenario',
    probability: 0.05,
    is_active: true,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  }
]

// Sample Economic Forecasts
const economicForecasts: EconomicForecast[] = [
  // Base Case - GDP Growth
  {
    forecast_id: 1,
    scenario_id: 1,
    variable_id: 1,
    period: '2025-01',
    value: 5.1,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    forecast_id: 2,
    scenario_id: 1,
    variable_id: 1,
    period: '2025-04',
    value: 5.2,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    forecast_id: 3,
    scenario_id: 1,
    variable_id: 1,
    period: '2025-07',
    value: 5.3,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    forecast_id: 4,
    scenario_id: 1,
    variable_id: 1,
    period: '2025-10',
    value: 5.3,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  
  // Base Case - Inflation Rate
  {
    forecast_id: 5,
    scenario_id: 1,
    variable_id: 2,
    period: '2025-01',
    value: 3.2,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    forecast_id: 6,
    scenario_id: 1,
    variable_id: 2,
    period: '2025-04',
    value: 3.3,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    forecast_id: 7,
    scenario_id: 1,
    variable_id: 2,
    period: '2025-07',
    value: 3.4,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    forecast_id: 8,
    scenario_id: 1,
    variable_id: 2,
    period: '2025-10',
    value: 3.5,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  
  // Upside Scenario - GDP Growth
  {
    forecast_id: 9,
    scenario_id: 2,
    variable_id: 1,
    period: '2025-01',
    value: 5.5,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    forecast_id: 10,
    scenario_id: 2,
    variable_id: 1,
    period: '2025-04',
    value: 5.7,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    forecast_id: 11,
    scenario_id: 2,
    variable_id: 1,
    period: '2025-07',
    value: 5.9,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    forecast_id: 12,
    scenario_id: 2,
    variable_id: 1,
    period: '2025-10',
    value: 6.0,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  
  // Downside Scenario - GDP Growth
  {
    forecast_id: 13,
    scenario_id: 3,
    variable_id: 1,
    period: '2025-01',
    value: 4.5,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    forecast_id: 14,
    scenario_id: 3,
    variable_id: 1,
    period: '2025-04',
    value: 4.3,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    forecast_id: 15,
    scenario_id: 3,
    variable_id: 1,
    period: '2025-07',
    value: 4.2,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    forecast_id: 16,
    scenario_id: 3,
    variable_id: 1,
    period: '2025-10',
    value: 4.0,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  }
  // Add more forecasts for other variables and scenarios as needed
]

// Sample Correlation Matrices
const correlationMatrices: CorrelationMatrix[] = [
  {
    matrix_id: 1,
    name: 'Default Correlation Matrix',
    description: 'Default correlation matrix for economic variables',
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00',
    is_active: true
  },
  {
    matrix_id: 2,
    name: 'Corporate Segment Matrix',
    description: 'Correlation matrix for corporate segment',
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00',
    is_active: true
  },
  {
    matrix_id: 3,
    name: 'Retail Segment Matrix',
    description: 'Correlation matrix for retail segment',
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00',
    is_active: true
  }
]

// Sample Variable Correlations
const variableCorrelations: VariableCorrelation[] = [
  // Default Matrix
  {
    correlation_id: 1,
    matrix_id: 1,
    variable_id: 1,
    pd_correlation: -0.7, // Negative correlation: higher GDP growth -> lower PD
    lgd_correlation: -0.5, // Negative correlation: higher GDP growth -> lower LGD
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    correlation_id: 2,
    matrix_id: 1,
    variable_id: 2,
    pd_correlation: 0.4, // Positive correlation: higher inflation -> higher PD
    lgd_correlation: 0.3, // Positive correlation: higher inflation -> higher LGD
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    correlation_id: 3,
    matrix_id: 1,
    variable_id: 3,
    pd_correlation: 0.5, // Positive correlation: higher exchange rate (depreciation) -> higher PD
    lgd_correlation: 0.4, // Positive correlation: higher exchange rate (depreciation) -> higher LGD
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    correlation_id: 4,
    matrix_id: 1,
    variable_id: 4,
    pd_correlation: 0.6, // Positive correlation: higher interest rate -> higher PD
    lgd_correlation: 0.3, // Positive correlation: higher interest rate -> higher LGD
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    correlation_id: 5,
    matrix_id: 1,
    variable_id: 5,
    pd_correlation: 0.8, // Positive correlation: higher unemployment -> higher PD
    lgd_correlation: 0.6, // Positive correlation: higher unemployment -> higher LGD
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  
  // Corporate Segment Matrix
  {
    correlation_id: 6,
    matrix_id: 2,
    variable_id: 1,
    pd_correlation: -0.8, // Stronger negative correlation for corporate segment
    lgd_correlation: -0.6,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    correlation_id: 7,
    matrix_id: 2,
    variable_id: 6,
    pd_correlation: 0.7, // Oil price has stronger impact on corporate segment
    lgd_correlation: 0.5,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  
  // Retail Segment Matrix
  {
    correlation_id: 8,
    matrix_id: 3,
    variable_id: 5,
    pd_correlation: 0.9, // Unemployment has stronger impact on retail segment
    lgd_correlation: 0.7,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  },
  {
    correlation_id: 9,
    matrix_id: 3,
    variable_id: 7,
    pd_correlation: -0.6, // Property prices have stronger impact on retail segment
    lgd_correlation: -0.8,
    created_at: '2025-01-01T00:00:00',
    updated_at: '2025-01-01T00:00:00'
  }
]

export default economicForecasts
