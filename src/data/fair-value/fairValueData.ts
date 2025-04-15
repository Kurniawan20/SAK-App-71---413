// Types for Fair Value calculations
export interface FairValueCalculation {
  calculation_id: number
  transaction_id: number
  tanggal_perhitungan: string
  metode_perhitungan: MetodePerhitungan
  nilai_tercatat: number
  nilai_wajar: number
  selisih_nilai: number
  discount_rate: number
  tenor_sisa: number
  keterangan: string
  created_at?: string
  updated_at?: string
}

// Types of calculation methods
export type MetodePerhitungan = 
  | 'DCF' 
  | 'Market Comparison' 
  | 'Income Approach' 
  | 'Manual Override'

// Cash flow data for DCF calculations
export interface CashFlow {
  id: number
  calculation_id: number
  periode: number
  tanggal: string
  nominal: number
  present_value: number
}

// Helper function to calculate present value
export const calculatePresentValue = (
  cashFlowAmount: number, 
  discountRate: number, 
  periodInYears: number
): number => {
  return cashFlowAmount / Math.pow(1 + discountRate, periodInYears)
}

// Helper function to calculate fair value using DCF method
export const calculateFairValueDCF = (
  cashFlows: { nominal: number; periode: number }[],
  discountRate: number
): number => {
  return cashFlows.reduce((sum, cf) => {
    const presentValue = calculatePresentValue(cf.nominal, discountRate, cf.periode / 12)
    return sum + presentValue
  }, 0)
}

// Sample Fair Value Calculation Data
const fairValueData: FairValueCalculation[] = [
  {
    calculation_id: 1,
    transaction_id: 10001,
    tanggal_perhitungan: '2025-01-15',
    metode_perhitungan: 'DCF',
    nilai_tercatat: 500000000,
    nilai_wajar: 485000000,
    selisih_nilai: -15000000,
    discount_rate: 0.12,
    tenor_sisa: 36,
    keterangan: 'Perhitungan nilai wajar menggunakan metode DCF',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    calculation_id: 2,
    transaction_id: 10002,
    tanggal_perhitungan: '2025-01-15',
    metode_perhitungan: 'DCF',
    nilai_tercatat: 150000000,
    nilai_wajar: 142500000,
    selisih_nilai: -7500000,
    discount_rate: 0.13,
    tenor_sisa: 24,
    keterangan: 'Perhitungan nilai wajar menggunakan metode DCF',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    calculation_id: 3,
    transaction_id: 10003,
    tanggal_perhitungan: '2025-01-15',
    metode_perhitungan: 'Market Comparison',
    nilai_tercatat: 400000000,
    nilai_wajar: 380000000,
    selisih_nilai: -20000000,
    discount_rate: 0,
    tenor_sisa: 48,
    keterangan: 'Perhitungan nilai wajar menggunakan metode perbandingan pasar',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    calculation_id: 4,
    transaction_id: 10004,
    tanggal_perhitungan: '2025-01-15',
    metode_perhitungan: 'DCF',
    nilai_tercatat: 75000000,
    nilai_wajar: 74250000,
    selisih_nilai: -750000,
    discount_rate: 0.10,
    tenor_sisa: 12,
    keterangan: 'Perhitungan nilai wajar menggunakan metode DCF',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    calculation_id: 5,
    transaction_id: 10005,
    tanggal_perhitungan: '2025-01-15',
    metode_perhitungan: 'Income Approach',
    nilai_tercatat: 250000000,
    nilai_wajar: 237500000,
    selisih_nilai: -12500000,
    discount_rate: 0.15,
    tenor_sisa: 36,
    keterangan: 'Perhitungan nilai wajar menggunakan metode pendekatan pendapatan',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    calculation_id: 6,
    transaction_id: 10006,
    tanggal_perhitungan: '2025-01-15',
    metode_perhitungan: 'DCF',
    nilai_tercatat: 100000000,
    nilai_wajar: 97000000,
    selisih_nilai: -3000000,
    discount_rate: 0.11,
    tenor_sisa: 18,
    keterangan: 'Perhitungan nilai wajar menggunakan metode DCF',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    calculation_id: 7,
    transaction_id: 10007,
    tanggal_perhitungan: '2025-01-15',
    metode_perhitungan: 'Manual Override',
    nilai_tercatat: 600000000,
    nilai_wajar: 600000000,
    selisih_nilai: 0,
    discount_rate: 0,
    tenor_sisa: 60,
    keterangan: 'Nilai wajar diinput manual sesuai kebijakan',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    calculation_id: 8,
    transaction_id: 10008,
    tanggal_perhitungan: '2025-01-15',
    metode_perhitungan: 'DCF',
    nilai_tercatat: 400000000,
    nilai_wajar: 376000000,
    selisih_nilai: -24000000,
    discount_rate: 0.14,
    tenor_sisa: 42,
    keterangan: 'Perhitungan nilai wajar menggunakan metode DCF',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    calculation_id: 9,
    transaction_id: 10009,
    tanggal_perhitungan: '2025-01-15',
    metode_perhitungan: 'Market Comparison',
    nilai_tercatat: 150000000,
    nilai_wajar: 135000000,
    selisih_nilai: -15000000,
    discount_rate: 0,
    tenor_sisa: 30,
    keterangan: 'Perhitungan nilai wajar menggunakan metode perbandingan pasar',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    calculation_id: 10,
    transaction_id: 10010,
    tanggal_perhitungan: '2025-01-15',
    metode_perhitungan: 'DCF',
    nilai_tercatat: 100000000,
    nilai_wajar: 92000000,
    selisih_nilai: -8000000,
    discount_rate: 0.12,
    tenor_sisa: 24,
    keterangan: 'Perhitungan nilai wajar menggunakan metode DCF',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  }
]

// Helper function to get all fair value calculation data
export const getFairValueData = (): FairValueCalculation[] => {
  return fairValueData
}

export default fairValueData
