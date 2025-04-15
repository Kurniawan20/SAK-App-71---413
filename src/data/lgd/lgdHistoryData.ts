// Types for LGD History data
export interface LGDHistory {
  history_id: number
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

// Sample LGD History Data
const lgdHistoryData: LGDHistory[] = [
  {
    history_id: 1,
    transaction_id: 10001,
    tanggal_perhitungan: '2024-10-15',
    total_nilai_agunan: 1000000000,
    total_recovery_value: 730000000,
    outstanding_pokok: 500000000,
    lgd_percentage: 0,
    keterangan: 'Initial LGD calculation',
    created_at: '2024-10-15',
    updated_at: '2024-10-15'
  },
  {
    history_id: 2,
    transaction_id: 10001,
    tanggal_perhitungan: '2024-11-15',
    total_nilai_agunan: 1020000000,
    total_recovery_value: 745000000,
    outstanding_pokok: 500000000,
    lgd_percentage: 0,
    keterangan: 'Monthly revaluation',
    created_at: '2024-11-15',
    updated_at: '2024-11-15'
  },
  {
    history_id: 3,
    transaction_id: 10001,
    tanggal_perhitungan: '2024-12-15',
    total_nilai_agunan: 1030000000,
    total_recovery_value: 754000000,
    outstanding_pokok: 500000000,
    lgd_percentage: 0,
    keterangan: 'Monthly revaluation',
    created_at: '2024-12-15',
    updated_at: '2024-12-15'
  },
  {
    history_id: 4,
    transaction_id: 10001,
    tanggal_perhitungan: '2025-01-15',
    total_nilai_agunan: 1030000000,
    total_recovery_value: 754000000,
    outstanding_pokok: 500000000,
    lgd_percentage: 0,
    keterangan: 'Monthly revaluation',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    history_id: 5,
    transaction_id: 10002,
    tanggal_perhitungan: '2024-10-15',
    total_nilai_agunan: 180000000,
    total_recovery_value: 90000000,
    outstanding_pokok: 150000000,
    lgd_percentage: 0.40,
    keterangan: 'Initial LGD calculation',
    created_at: '2024-10-15',
    updated_at: '2024-10-15'
  },
  {
    history_id: 6,
    transaction_id: 10002,
    tanggal_perhitungan: '2024-11-15',
    total_nilai_agunan: 190000000,
    total_recovery_value: 95000000,
    outstanding_pokok: 150000000,
    lgd_percentage: 0.37,
    keterangan: 'Monthly revaluation',
    created_at: '2024-11-15',
    updated_at: '2024-11-15'
  },
  {
    history_id: 7,
    transaction_id: 10002,
    tanggal_perhitungan: '2024-12-15',
    total_nilai_agunan: 200000000,
    total_recovery_value: 100000000,
    outstanding_pokok: 150000000,
    lgd_percentage: 0.33,
    keterangan: 'Monthly revaluation',
    created_at: '2024-12-15',
    updated_at: '2024-12-15'
  },
  {
    history_id: 8,
    transaction_id: 10002,
    tanggal_perhitungan: '2025-01-15',
    total_nilai_agunan: 200000000,
    total_recovery_value: 100000000,
    outstanding_pokok: 150000000,
    lgd_percentage: 0.33,
    keterangan: 'Monthly revaluation',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    history_id: 9,
    transaction_id: 10003,
    tanggal_perhitungan: '2024-10-15',
    total_nilai_agunan: 280000000,
    total_recovery_value: 112000000,
    outstanding_pokok: 400000000,
    lgd_percentage: 0.72,
    keterangan: 'Initial LGD calculation',
    created_at: '2024-10-15',
    updated_at: '2024-10-15'
  },
  {
    history_id: 10,
    transaction_id: 10003,
    tanggal_perhitungan: '2024-11-15',
    total_nilai_agunan: 290000000,
    total_recovery_value: 116000000,
    outstanding_pokok: 400000000,
    lgd_percentage: 0.71,
    keterangan: 'Monthly revaluation',
    created_at: '2024-11-15',
    updated_at: '2024-11-15'
  },
  {
    history_id: 11,
    transaction_id: 10003,
    tanggal_perhitungan: '2024-12-15',
    total_nilai_agunan: 300000000,
    total_recovery_value: 120000000,
    outstanding_pokok: 400000000,
    lgd_percentage: 0.70,
    keterangan: 'Monthly revaluation',
    created_at: '2024-12-15',
    updated_at: '2024-12-15'
  },
  {
    history_id: 12,
    transaction_id: 10003,
    tanggal_perhitungan: '2025-01-15',
    total_nilai_agunan: 300000000,
    total_recovery_value: 120000000,
    outstanding_pokok: 400000000,
    lgd_percentage: 0.70,
    keterangan: 'Monthly revaluation',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  }
]

export default lgdHistoryData
