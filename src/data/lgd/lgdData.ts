// Types for LGD (Loss Given Default) data
export interface LGDCalculation {
  lgd_id: number
  transaction_id: number
  tanggal_perhitungan: string
  total_nilai_agunan: number
  total_recovery_value: number
  outstanding_pokok: number
  lgd_percentage: number
  keterangan: string
  created_at?: string
  updated_at?: string
}

// Helper function to calculate LGD percentage
export const calculateLGDPercentage = (outstandingPokok: number, totalRecoveryValue: number): number => {
  if (outstandingPokok === 0) return 0
  
  // LGD = 1 - (Recovery Value / Outstanding Principal)
  const lgdValue = 1 - (Math.min(totalRecoveryValue, outstandingPokok) / outstandingPokok)
  
  // Ensure LGD is between 0 and 1
  return Math.max(0, Math.min(1, lgdValue))
}

// Sample LGD Calculation Data
const lgdData: LGDCalculation[] = [
  {
    lgd_id: 1,
    transaction_id: 10001,
    tanggal_perhitungan: '2025-01-15',
    total_nilai_agunan: 1030000000, // Combined market value of all collateral
    total_recovery_value: 754000000, // After haircut
    outstanding_pokok: 500000000,
    lgd_percentage: 0,
    keterangan: 'Recovery value exceeds outstanding principal',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    lgd_id: 2,
    transaction_id: 10002,
    tanggal_perhitungan: '2025-01-15',
    total_nilai_agunan: 200000000,
    total_recovery_value: 100000000,
    outstanding_pokok: 150000000,
    lgd_percentage: 0.33,
    keterangan: 'Partial recovery expected',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    lgd_id: 3,
    transaction_id: 10003,
    tanggal_perhitungan: '2025-01-15',
    total_nilai_agunan: 300000000,
    total_recovery_value: 120000000,
    outstanding_pokok: 400000000,
    lgd_percentage: 0.70,
    keterangan: 'High loss expected due to low collateral value',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    lgd_id: 4,
    transaction_id: 10004,
    tanggal_perhitungan: '2025-01-15',
    total_nilai_agunan: 100000000,
    total_recovery_value: 100000000,
    outstanding_pokok: 75000000,
    lgd_percentage: 0,
    keterangan: 'Cash collateral fully covers outstanding',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    lgd_id: 5,
    transaction_id: 10005,
    tanggal_perhitungan: '2025-01-15',
    total_nilai_agunan: 180000000,
    total_recovery_value: 54000000,
    outstanding_pokok: 250000000,
    lgd_percentage: 0.78,
    keterangan: 'High loss due to inventory with high haircut',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    lgd_id: 6,
    transaction_id: 10006,
    tanggal_perhitungan: '2025-01-15',
    total_nilai_agunan: 130000000,
    total_recovery_value: 78000000,
    outstanding_pokok: 100000000,
    lgd_percentage: 0.22,
    keterangan: 'Moderate recovery from receivables',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    lgd_id: 7,
    transaction_id: 10007,
    tanggal_perhitungan: '2025-01-15',
    total_nilai_agunan: 900000000,
    total_recovery_value: 720000000,
    outstanding_pokok: 600000000,
    lgd_percentage: 0,
    keterangan: 'Land collateral fully covers outstanding',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    lgd_id: 8,
    transaction_id: 10008,
    tanggal_perhitungan: '2025-01-15',
    total_nilai_agunan: 480000000,
    total_recovery_value: 336000000,
    outstanding_pokok: 400000000,
    lgd_percentage: 0.16,
    keterangan: 'Building collateral covers most of outstanding',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    lgd_id: 9,
    transaction_id: 10009,
    tanggal_perhitungan: '2025-01-15',
    total_nilai_agunan: 40000000,
    total_recovery_value: 8000000,
    outstanding_pokok: 150000000,
    lgd_percentage: 0.95,
    keterangan: 'Very high loss due to low value collateral',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    lgd_id: 10,
    transaction_id: 10010,
    tanggal_perhitungan: '2025-01-15',
    total_nilai_agunan: 0,
    total_recovery_value: 0,
    outstanding_pokok: 100000000,
    lgd_percentage: 1.0,
    keterangan: 'No collateral, 100% loss expected',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  }
]

export default lgdData
