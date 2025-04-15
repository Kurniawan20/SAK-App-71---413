// Types for Migration Matrix
export interface MigrationMatrix {
  matrix_id: number
  periode_awal: string
  periode_akhir: string
  dari_kolektibilitas: string
  ke_kolektibilitas: string
  probability_value: number
  created_at?: string
  updated_at?: string
}

// Sample Migration Matrix Data
const migrationMatrixData: MigrationMatrix[] = [
  // From Kolektibilitas 1
  {
    matrix_id: 1,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '1',
    ke_kolektibilitas: '1',
    probability_value: 0.92,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  {
    matrix_id: 2,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '1',
    ke_kolektibilitas: '2',
    probability_value: 0.05,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  {
    matrix_id: 3,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '1',
    ke_kolektibilitas: '3',
    probability_value: 0.02,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  {
    matrix_id: 4,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '1',
    ke_kolektibilitas: '4',
    probability_value: 0.01,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  {
    matrix_id: 5,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '1',
    ke_kolektibilitas: '5',
    probability_value: 0.00,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  
  // From Kolektibilitas 2
  {
    matrix_id: 6,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '2',
    ke_kolektibilitas: '1',
    probability_value: 0.25,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  {
    matrix_id: 7,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '2',
    ke_kolektibilitas: '2',
    probability_value: 0.60,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  {
    matrix_id: 8,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '2',
    ke_kolektibilitas: '3',
    probability_value: 0.10,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  {
    matrix_id: 9,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '2',
    ke_kolektibilitas: '4',
    probability_value: 0.03,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  {
    matrix_id: 10,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '2',
    ke_kolektibilitas: '5',
    probability_value: 0.02,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  
  // From Kolektibilitas 3
  {
    matrix_id: 11,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '3',
    ke_kolektibilitas: '1',
    probability_value: 0.10,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  {
    matrix_id: 12,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '3',
    ke_kolektibilitas: '2',
    probability_value: 0.20,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  {
    matrix_id: 13,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '3',
    ke_kolektibilitas: '3',
    probability_value: 0.45,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  {
    matrix_id: 14,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '3',
    ke_kolektibilitas: '4',
    probability_value: 0.15,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  {
    matrix_id: 15,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '3',
    ke_kolektibilitas: '5',
    probability_value: 0.10,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  
  // From Kolektibilitas 4
  {
    matrix_id: 16,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '4',
    ke_kolektibilitas: '1',
    probability_value: 0.05,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  {
    matrix_id: 17,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '4',
    ke_kolektibilitas: '2',
    probability_value: 0.10,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  {
    matrix_id: 18,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '4',
    ke_kolektibilitas: '3',
    probability_value: 0.15,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  {
    matrix_id: 19,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '4',
    ke_kolektibilitas: '4',
    probability_value: 0.40,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  {
    matrix_id: 20,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '4',
    ke_kolektibilitas: '5',
    probability_value: 0.30,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  
  // From Kolektibilitas 5
  {
    matrix_id: 21,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '5',
    ke_kolektibilitas: '1',
    probability_value: 0.01,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  {
    matrix_id: 22,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '5',
    ke_kolektibilitas: '2',
    probability_value: 0.02,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  {
    matrix_id: 23,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '5',
    ke_kolektibilitas: '3',
    probability_value: 0.05,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  {
    matrix_id: 24,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '5',
    ke_kolektibilitas: '4',
    probability_value: 0.12,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  },
  {
    matrix_id: 25,
    periode_awal: '2024-01-01',
    periode_akhir: '2024-03-31',
    dari_kolektibilitas: '5',
    ke_kolektibilitas: '5',
    probability_value: 0.80,
    created_at: '2024-04-01',
    updated_at: '2024-04-01'
  }
]

export default migrationMatrixData
