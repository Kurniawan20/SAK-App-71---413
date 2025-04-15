// Types for Agunan (Collateral) data
export interface Agunan {
  agunan_id: number
  transaction_id: number
  jenis_agunan: JenisAgunan
  nilai_agunan_awal: number
  nilai_pasar_kini: number
  haircut_persen: number
  tanggal_penilaian: string
  keterangan: string
  created_at?: string
  updated_at?: string
}

// Jenis Agunan types
export type JenisAgunan = 
  | 'Tanah' 
  | 'Bangunan' 
  | 'Kendaraan' 
  | 'Mesin' 
  | 'Deposito' 
  | 'Inventory' 
  | 'Piutang' 
  | 'Lainnya'

// Helper function to get haircut percentage recommendation based on collateral type
export const getDefaultHaircutPersen = (jenisAgunan: JenisAgunan): number => {
  const defaultHaircuts: Record<JenisAgunan, number> = {
    'Tanah': 20,
    'Bangunan': 30,
    'Kendaraan': 50,
    'Mesin': 60,
    'Deposito': 0,
    'Inventory': 70,
    'Piutang': 40,
    'Lainnya': 80
  }
  
  return defaultHaircuts[jenisAgunan]
}

// Helper function to calculate expected recovery value
export const calculateExpectedRecovery = (agunan: Agunan): number => {
  return agunan.nilai_pasar_kini * (1 - (agunan.haircut_persen / 100))
}

// Sample Agunan Data
const agunanData: Agunan[] = [
  {
    agunan_id: 5001,
    transaction_id: 10001,
    jenis_agunan: 'Tanah',
    nilai_agunan_awal: 600000000,
    nilai_pasar_kini: 650000000,
    haircut_persen: 20,
    tanggal_penilaian: '2024-12-15',
    keterangan: 'Tanah di kawasan komersial',
    created_at: '2024-12-15',
    updated_at: '2024-12-15'
  },
  {
    agunan_id: 5002,
    transaction_id: 10001,
    jenis_agunan: 'Bangunan',
    nilai_agunan_awal: 400000000,
    nilai_pasar_kini: 380000000,
    haircut_persen: 30,
    tanggal_penilaian: '2024-12-15',
    keterangan: 'Bangunan ruko 2 lantai',
    created_at: '2024-12-15',
    updated_at: '2024-12-15'
  },
  {
    agunan_id: 5003,
    transaction_id: 10002,
    jenis_agunan: 'Kendaraan',
    nilai_agunan_awal: 250000000,
    nilai_pasar_kini: 200000000,
    haircut_persen: 50,
    tanggal_penilaian: '2024-11-20',
    keterangan: 'Mobil operasional perusahaan',
    created_at: '2024-11-20',
    updated_at: '2024-11-20'
  },
  {
    agunan_id: 5004,
    transaction_id: 10003,
    jenis_agunan: 'Mesin',
    nilai_agunan_awal: 350000000,
    nilai_pasar_kini: 300000000,
    haircut_persen: 60,
    tanggal_penilaian: '2024-10-05',
    keterangan: 'Mesin produksi tekstil',
    created_at: '2024-10-05',
    updated_at: '2024-10-05'
  },
  {
    agunan_id: 5005,
    transaction_id: 10004,
    jenis_agunan: 'Deposito',
    nilai_agunan_awal: 100000000,
    nilai_pasar_kini: 100000000,
    haircut_persen: 0,
    tanggal_penilaian: '2025-01-10',
    keterangan: 'Deposito di Bank Syariah Indonesia',
    created_at: '2025-01-10',
    updated_at: '2025-01-10'
  },
  {
    agunan_id: 5006,
    transaction_id: 10005,
    jenis_agunan: 'Inventory',
    nilai_agunan_awal: 200000000,
    nilai_pasar_kini: 180000000,
    haircut_persen: 70,
    tanggal_penilaian: '2024-12-20',
    keterangan: 'Persediaan barang dagang',
    created_at: '2024-12-20',
    updated_at: '2024-12-20'
  },
  {
    agunan_id: 5007,
    transaction_id: 10006,
    jenis_agunan: 'Piutang',
    nilai_agunan_awal: 150000000,
    nilai_pasar_kini: 130000000,
    haircut_persen: 40,
    tanggal_penilaian: '2025-01-05',
    keterangan: 'Piutang dagang perusahaan',
    created_at: '2025-01-05',
    updated_at: '2025-01-05'
  },
  {
    agunan_id: 5008,
    transaction_id: 10007,
    jenis_agunan: 'Tanah',
    nilai_agunan_awal: 800000000,
    nilai_pasar_kini: 900000000,
    haircut_persen: 20,
    tanggal_penilaian: '2024-11-15',
    keterangan: 'Tanah di kawasan industri',
    created_at: '2024-11-15',
    updated_at: '2024-11-15'
  },
  {
    agunan_id: 5009,
    transaction_id: 10008,
    jenis_agunan: 'Bangunan',
    nilai_agunan_awal: 500000000,
    nilai_pasar_kini: 480000000,
    haircut_persen: 30,
    tanggal_penilaian: '2024-12-10',
    keterangan: 'Gudang penyimpanan',
    created_at: '2024-12-10',
    updated_at: '2024-12-10'
  },
  {
    agunan_id: 5010,
    transaction_id: 10009,
    jenis_agunan: 'Lainnya',
    nilai_agunan_awal: 50000000,
    nilai_pasar_kini: 40000000,
    haircut_persen: 80,
    tanggal_penilaian: '2025-01-20',
    keterangan: 'Hak kekayaan intelektual',
    created_at: '2025-01-20',
    updated_at: '2025-01-20'
  }
]

export default agunanData
