// Types for PD Results
export interface PDResult {
  pd_id: number
  transaction_id: number
  kolektibilitas_awal: string
  kolektibilitas_akhir: string
  pd_percentage: number
  tanggal_perhitungan: string
  created_at?: string
  updated_at?: string
}

// Sample PD Result Data
const pdResultData: PDResult[] = [
  {
    pd_id: 1,
    transaction_id: 1001,
    kolektibilitas_awal: '1',
    kolektibilitas_akhir: '1',
    pd_percentage: 0.08,
    tanggal_perhitungan: '2025-01-15',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    pd_id: 2,
    transaction_id: 1002,
    kolektibilitas_awal: '1',
    kolektibilitas_akhir: '2',
    pd_percentage: 0.05,
    tanggal_perhitungan: '2025-01-15',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    pd_id: 3,
    transaction_id: 1003,
    kolektibilitas_awal: '2',
    kolektibilitas_akhir: '3',
    pd_percentage: 0.10,
    tanggal_perhitungan: '2025-01-15',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    pd_id: 4,
    transaction_id: 1004,
    kolektibilitas_awal: '3',
    kolektibilitas_akhir: '4',
    pd_percentage: 0.15,
    tanggal_perhitungan: '2025-01-15',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    pd_id: 5,
    transaction_id: 1005,
    kolektibilitas_awal: '4',
    kolektibilitas_akhir: '5',
    pd_percentage: 0.30,
    tanggal_perhitungan: '2025-01-15',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    pd_id: 6,
    transaction_id: 1006,
    kolektibilitas_awal: '1',
    kolektibilitas_akhir: '3',
    pd_percentage: 0.02,
    tanggal_perhitungan: '2025-01-15',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    pd_id: 7,
    transaction_id: 1007,
    kolektibilitas_awal: '2',
    kolektibilitas_akhir: '4',
    pd_percentage: 0.03,
    tanggal_perhitungan: '2025-01-15',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    pd_id: 8,
    transaction_id: 1008,
    kolektibilitas_awal: '3',
    kolektibilitas_akhir: '5',
    pd_percentage: 0.10,
    tanggal_perhitungan: '2025-01-15',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    pd_id: 9,
    transaction_id: 1009,
    kolektibilitas_awal: '1',
    kolektibilitas_akhir: '5',
    pd_percentage: 0.00,
    tanggal_perhitungan: '2025-01-15',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    pd_id: 10,
    transaction_id: 1010,
    kolektibilitas_awal: '5',
    kolektibilitas_akhir: '1',
    pd_percentage: 0.01,
    tanggal_perhitungan: '2025-01-15',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  }
]

export default pdResultData
