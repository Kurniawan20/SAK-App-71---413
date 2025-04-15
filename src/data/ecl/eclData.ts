// ECL (Expected Credit Loss) Data Models

// ECL Calculation Types
export type ECLCalculationType = 'Individual' | 'Collective'
export type StagingType = 'Stage 1' | 'Stage 2' | 'Stage 3'
export type TimeHorizon = '12-Month' | 'Lifetime'
export type DiscountMethod = 'Effective Rate' | 'Contractual Rate' | 'Original EIR'

// ECL Parameters Interface
export interface ECLParameters {
  parameter_id: number
  name: string
  description: string
  is_active: boolean
  created_date: string
  modified_date: string
  calculation_type: ECLCalculationType
  default_staging_rules: StagingRule[]
  default_time_horizons: { [key in StagingType]: TimeHorizon }
  default_discount_method: DiscountMethod
  default_margin_inclusion: boolean
  include_collateral: boolean
  include_guarantees: boolean
  include_netting: boolean
}

// Staging Rule Interface
export interface StagingRule {
  rule_id: number
  name: string
  description: string
  criteria: StagingCriteria[]
  stage_result: StagingType
  priority: number
  is_active: boolean
}

// Staging Criteria Interface
export interface StagingCriteria {
  criteria_id: number
  field: string
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains' | 'in' | 'not_in'
  value: any
  logic_operator?: 'AND' | 'OR'
}

// ECL Calculation Result Interface
export interface ECLCalculationResult {
  result_id: number
  transaction_id: number
  calculation_date: string
  calculation_type: ECLCalculationType
  assigned_stage: StagingType
  time_horizon: TimeHorizon
  exposure_at_default: number
  probability_of_default: number
  loss_given_default: number
  discount_rate: number
  expected_credit_loss: number
  ecl_percentage: number
  is_final: boolean
  approved_by?: string
  approval_date?: string
  notes?: string
}

// ECL Calculation History Interface
export interface ECLCalculationHistory {
  history_id: number
  transaction_id: number
  calculation_date: string
  stage_history: StagingType[]
  ecl_history: number[]
  ecl_percentage_history: number[]
  reason_for_change?: string
}

// ECL Adjustment Interface
export interface ECLAdjustment {
  adjustment_id: number
  transaction_id: number
  original_ecl: number
  adjusted_ecl: number
  adjustment_reason: string
  adjustment_date: string
  adjusted_by: string
  is_approved: boolean
  approved_by?: string
  approval_date?: string
}

// ECL Calculation Batch Interface
export interface ECLCalculationBatch {
  batch_id: number
  batch_name: string
  calculation_date: string
  number_of_transactions: number
  total_exposure: number
  total_ecl: number
  status: 'Pending' | 'In Progress' | 'Completed' | 'Failed'
  created_by: string
  created_date: string
  completed_date?: string
  notes?: string
}

// Sample data functions
export const getECLParameters = (): ECLParameters[] => {
  return [
    {
      parameter_id: 1,
      name: 'Standard ECL Parameters',
      description: 'Default parameters for ECL calculation based on PSAK 71 requirements',
      is_active: true,
      created_date: '2025-01-01',
      modified_date: '2025-03-15',
      calculation_type: 'Collective',
      default_staging_rules: [
        {
          rule_id: 1,
          name: 'DPD > 90 Rule',
          description: 'Assign Stage 3 if Days Past Due > 90',
          criteria: [
            {
              criteria_id: 1,
              field: 'dpd',
              operator: 'greater_than',
              value: 90
            }
          ],
          stage_result: 'Stage 3',
          priority: 1,
          is_active: true
        },
        {
          rule_id: 2,
          name: 'DPD > 30 Rule',
          description: 'Assign Stage 2 if Days Past Due > 30',
          criteria: [
            {
              criteria_id: 2,
              field: 'dpd',
              operator: 'greater_than',
              value: 30
            }
          ],
          stage_result: 'Stage 2',
          priority: 2,
          is_active: true
        },
        {
          rule_id: 3,
          name: 'SICR Rule',
          description: 'Assign Stage 2 if Significant Increase in Credit Risk',
          criteria: [
            {
              criteria_id: 3,
              field: 'pd_increase_percentage',
              operator: 'greater_than',
              value: 200
            }
          ],
          stage_result: 'Stage 2',
          priority: 3,
          is_active: true
        },
        {
          rule_id: 4,
          name: 'Default Stage 1',
          description: 'Default rule to assign Stage 1',
          criteria: [],
          stage_result: 'Stage 1',
          priority: 999,
          is_active: true
        }
      ],
      default_time_horizons: {
        'Stage 1': '12-Month',
        'Stage 2': 'Lifetime',
        'Stage 3': 'Lifetime'
      },
      default_discount_method: 'Effective Rate',
      default_margin_inclusion: true,
      include_collateral: true,
      include_guarantees: true,
      include_netting: false
    },
    {
      parameter_id: 2,
      name: 'Murabahah ECL Parameters',
      description: 'Specialized parameters for Murabahah contracts',
      is_active: true,
      created_date: '2025-01-15',
      modified_date: '2025-03-20',
      calculation_type: 'Collective',
      default_staging_rules: [
        {
          rule_id: 5,
          name: 'DPD > 90 Rule',
          description: 'Assign Stage 3 if Days Past Due > 90',
          criteria: [
            {
              criteria_id: 5,
              field: 'dpd',
              operator: 'greater_than',
              value: 90
            }
          ],
          stage_result: 'Stage 3',
          priority: 1,
          is_active: true
        },
        {
          rule_id: 6,
          name: 'DPD > 30 Rule',
          description: 'Assign Stage 2 if Days Past Due > 30',
          criteria: [
            {
              criteria_id: 6,
              field: 'dpd',
              operator: 'greater_than',
              value: 30
            }
          ],
          stage_result: 'Stage 2',
          priority: 2,
          is_active: true
        },
        {
          rule_id: 7,
          name: 'Default Stage 1',
          description: 'Default rule to assign Stage 1',
          criteria: [],
          stage_result: 'Stage 1',
          priority: 999,
          is_active: true
        }
      ],
      default_time_horizons: {
        'Stage 1': '12-Month',
        'Stage 2': 'Lifetime',
        'Stage 3': 'Lifetime'
      },
      default_discount_method: 'Contractual Rate',
      default_margin_inclusion: true,
      include_collateral: true,
      include_guarantees: true,
      include_netting: false
    }
  ]
}

export const getECLCalculationResults = (): ECLCalculationResult[] => {
  return [
    {
      result_id: 1,
      transaction_id: 1001,
      calculation_date: '2025-04-01',
      calculation_type: 'Collective',
      assigned_stage: 'Stage 1',
      time_horizon: '12-Month',
      exposure_at_default: 100000000,
      probability_of_default: 0.02,
      loss_given_default: 0.45,
      discount_rate: 0.12,
      expected_credit_loss: 900000,
      ecl_percentage: 0.009,
      is_final: true,
      approved_by: 'Ahmad Fauzi',
      approval_date: '2025-04-02',
      notes: 'Regular ECL calculation for Murabahah contract'
    },
    {
      result_id: 2,
      transaction_id: 1002,
      calculation_date: '2025-04-01',
      calculation_type: 'Collective',
      assigned_stage: 'Stage 2',
      time_horizon: 'Lifetime',
      exposure_at_default: 75000000,
      probability_of_default: 0.15,
      loss_given_default: 0.5,
      discount_rate: 0.12,
      expected_credit_loss: 5625000,
      ecl_percentage: 0.075,
      is_final: true,
      approved_by: 'Ahmad Fauzi',
      approval_date: '2025-04-02',
      notes: 'SICR detected due to industry downturn'
    },
    {
      result_id: 3,
      transaction_id: 1003,
      calculation_date: '2025-04-01',
      calculation_type: 'Individual',
      assigned_stage: 'Stage 3',
      time_horizon: 'Lifetime',
      exposure_at_default: 50000000,
      probability_of_default: 1.0,
      loss_given_default: 0.6,
      discount_rate: 0.12,
      expected_credit_loss: 30000000,
      ecl_percentage: 0.6,
      is_final: true,
      approved_by: 'Ahmad Fauzi',
      approval_date: '2025-04-02',
      notes: 'Default event occurred, individual assessment performed'
    }
  ]
}

export const getECLCalculationHistory = (): ECLCalculationHistory[] => {
  return [
    {
      history_id: 1,
      transaction_id: 1001,
      calculation_date: '2025-04-01',
      stage_history: ['Stage 1', 'Stage 1', 'Stage 1', 'Stage 1', 'Stage 1', 'Stage 1'],
      ecl_history: [850000, 875000, 900000, 925000, 950000, 900000],
      ecl_percentage_history: [0.0085, 0.00875, 0.009, 0.00925, 0.0095, 0.009],
      reason_for_change: 'Regular monthly calculation'
    },
    {
      history_id: 2,
      transaction_id: 1002,
      calculation_date: '2025-04-01',
      stage_history: ['Stage 1', 'Stage 1', 'Stage 1', 'Stage 2', 'Stage 2', 'Stage 2'],
      ecl_history: [750000, 800000, 850000, 5000000, 5500000, 5625000],
      ecl_percentage_history: [0.01, 0.0107, 0.0113, 0.0667, 0.0733, 0.075],
      reason_for_change: 'Stage migration due to SICR'
    },
    {
      history_id: 3,
      transaction_id: 1003,
      calculation_date: '2025-04-01',
      stage_history: ['Stage 1', 'Stage 2', 'Stage 2', 'Stage 3', 'Stage 3', 'Stage 3'],
      ecl_history: [500000, 3750000, 4000000, 25000000, 28000000, 30000000],
      ecl_percentage_history: [0.01, 0.075, 0.08, 0.5, 0.56, 0.6],
      reason_for_change: 'Progressive deterioration leading to default'
    }
  ]
}

export const getECLAdjustments = (): ECLAdjustment[] => {
  return [
    {
      adjustment_id: 1,
      transaction_id: 1001,
      original_ecl: 900000,
      adjusted_ecl: 1000000,
      adjustment_reason: 'Management overlay due to economic uncertainty',
      adjustment_date: '2025-04-03',
      adjusted_by: 'Siti Aisyah',
      is_approved: true,
      approved_by: 'Muhammad Rizki',
      approval_date: '2025-04-04'
    },
    {
      adjustment_id: 2,
      transaction_id: 1002,
      original_ecl: 5625000,
      adjusted_ecl: 6000000,
      adjustment_reason: 'Additional provision due to industry-specific risks',
      adjustment_date: '2025-04-03',
      adjusted_by: 'Siti Aisyah',
      is_approved: true,
      approved_by: 'Muhammad Rizki',
      approval_date: '2025-04-04'
    },
    {
      adjustment_id: 3,
      transaction_id: 1003,
      original_ecl: 30000000,
      adjusted_ecl: 32500000,
      adjustment_reason: 'Adjustment based on latest collateral valuation',
      adjustment_date: '2025-04-03',
      adjusted_by: 'Siti Aisyah',
      is_approved: false
    }
  ]
}

export const getECLCalculationBatches = (): ECLCalculationBatch[] => {
  return [
    {
      batch_id: 1,
      batch_name: 'March 2025 Month-End ECL Calculation',
      calculation_date: '2025-03-31',
      number_of_transactions: 1250,
      total_exposure: 2500000000,
      total_ecl: 75000000,
      status: 'Completed',
      created_by: 'System',
      created_date: '2025-03-31',
      completed_date: '2025-04-01',
      notes: 'Regular month-end ECL calculation'
    },
    {
      batch_id: 2,
      batch_name: 'April 2025 Month-End ECL Calculation',
      calculation_date: '2025-04-30',
      number_of_transactions: 1275,
      total_exposure: 2550000000,
      total_ecl: 78000000,
      status: 'Pending',
      created_by: 'System',
      created_date: '2025-04-15'
    },
    {
      batch_id: 3,
      batch_name: 'Q1 2025 Stress Test',
      calculation_date: '2025-03-31',
      number_of_transactions: 1250,
      total_exposure: 2500000000,
      total_ecl: 125000000,
      status: 'Completed',
      created_by: 'Ahmad Fauzi',
      created_date: '2025-04-05',
      completed_date: '2025-04-06',
      notes: 'Stress test scenario with 5% GDP decline'
    }
  ]
}
