// Types for Transaksi Syariah (Islamic Transaction) data
import type { Nasabah } from './nasabahData'
import type { AkadSyariah } from './akadData'

export type KolektibilitasType = 1 | 2 | 3 | 4 | 5

export interface TransaksiSyariah {
  transaction_id: number
  nasabah_id: number
  akad_id: number
  tanggal_akad: string
  pokok_pembiayaan: number
  margin: number
  tenor_bulan: number
  status_transaksi: 'aktif' | 'lunas' | 'macet'
  kolektibilitas_terkini: KolektibilitasType
  tanggal_update_kolektibilitas: string
  created_at: string
  updated_at: string
  // References for UI display
  nasabah?: Nasabah
  akad?: AkadSyariah
}

// Helper function to format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Helper function to get kolektibilitas label
export const getKolektibilitasLabel = (kol: KolektibilitasType): string => {
  const labels = {
    1: 'Lancar',
    2: 'Dalam Perhatian Khusus',
    3: 'Kurang Lancar',
    4: 'Diragukan',
    5: 'Macet'
  }
  return labels[kol]
}

// Helper function to get kolektibilitas color
export const getKolektibilitasColor = (kol: KolektibilitasType): 'success' | 'info' | 'warning' | 'error' | 'default' => {
  const colors = {
    1: 'success',
    2: 'info',
    3: 'warning',
    4: 'error',
    5: 'error'
  } as const
  return colors[kol]
}

// Import nasabah and akad data for reference
import nasabahData from './nasabahData'
import akadData from './akadData'

// Dummy data for Transaksi Syariah
const transaksiData: TransaksiSyariah[] = [
  {
    transaction_id: 10001,
    nasabah_id: 1001,
    akad_id: 101,
    tanggal_akad: '2024-01-15',
    pokok_pembiayaan: 500000000,
    margin: 75000000,
    tenor_bulan: 36,
    status_transaksi: 'aktif',
    kolektibilitas_terkini: 1,
    tanggal_update_kolektibilitas: '2024-04-01',
    created_at: '2024-01-15T10:30:00',
    updated_at: '2024-04-01T09:15:00',
    nasabah: nasabahData.find(n => n.nasabah_id === 1001),
    akad: akadData.find(a => a.akad_id === 101)
  },
  {
    transaction_id: 10002,
    nasabah_id: 1002,
    akad_id: 102,
    tanggal_akad: '2024-01-20',
    pokok_pembiayaan: 150000000,
    margin: 22500000,
    tenor_bulan: 24,
    status_transaksi: 'aktif',
    kolektibilitas_terkini: 1,
    tanggal_update_kolektibilitas: '2024-04-01',
    created_at: '2024-01-20T11:45:00',
    updated_at: '2024-04-01T09:15:00',
    nasabah: nasabahData.find(n => n.nasabah_id === 1002),
    akad: akadData.find(a => a.akad_id === 102)
  },
  {
    transaction_id: 10003,
    nasabah_id: 1003,
    akad_id: 103,
    tanggal_akad: '2024-02-05',
    pokok_pembiayaan: 350000000,
    margin: 87500000,
    tenor_bulan: 48,
    status_transaksi: 'aktif',
    kolektibilitas_terkini: 2,
    tanggal_update_kolektibilitas: '2024-04-01',
    created_at: '2024-02-05T14:20:00',
    updated_at: '2024-04-01T09:15:00',
    nasabah: nasabahData.find(n => n.nasabah_id === 1003),
    akad: akadData.find(a => a.akad_id === 103)
  },
  {
    transaction_id: 10004,
    nasabah_id: 1004,
    akad_id: 107,
    tanggal_akad: '2024-02-10',
    pokok_pembiayaan: 80000000,
    margin: 16000000,
    tenor_bulan: 24,
    status_transaksi: 'aktif',
    kolektibilitas_terkini: 1,
    tanggal_update_kolektibilitas: '2024-04-01',
    created_at: '2024-02-10T09:30:00',
    updated_at: '2024-04-01T09:15:00',
    nasabah: nasabahData.find(n => n.nasabah_id === 1004),
    akad: akadData.find(a => a.akad_id === 107)
  },
  {
    transaction_id: 10005,
    nasabah_id: 1005,
    akad_id: 104,
    tanggal_akad: '2024-02-15',
    pokok_pembiayaan: 1200000000,
    margin: 360000000,
    tenor_bulan: 60,
    status_transaksi: 'aktif',
    kolektibilitas_terkini: 1,
    tanggal_update_kolektibilitas: '2024-04-01',
    created_at: '2024-02-15T13:15:00',
    updated_at: '2024-04-01T09:15:00',
    nasabah: nasabahData.find(n => n.nasabah_id === 1005),
    akad: akadData.find(a => a.akad_id === 104)
  },
  {
    transaction_id: 10006,
    nasabah_id: 1006,
    akad_id: 108,
    tanggal_akad: '2024-02-20',
    pokok_pembiayaan: 250000000,
    margin: 62500000,
    tenor_bulan: 36,
    status_transaksi: 'aktif',
    kolektibilitas_terkini: 3,
    tanggal_update_kolektibilitas: '2024-04-01',
    created_at: '2024-02-20T10:45:00',
    updated_at: '2024-04-01T09:15:00',
    nasabah: nasabahData.find(n => n.nasabah_id === 1006),
    akad: akadData.find(a => a.akad_id === 108)
  },
  {
    transaction_id: 10007,
    nasabah_id: 1007,
    akad_id: 105,
    tanggal_akad: '2024-03-01',
    pokok_pembiayaan: 450000000,
    margin: 135000000,
    tenor_bulan: 48,
    status_transaksi: 'aktif',
    kolektibilitas_terkini: 1,
    tanggal_update_kolektibilitas: '2024-04-01',
    created_at: '2024-03-01T11:30:00',
    updated_at: '2024-04-01T09:15:00',
    nasabah: nasabahData.find(n => n.nasabah_id === 1007),
    akad: akadData.find(a => a.akad_id === 105)
  },
  {
    transaction_id: 10008,
    nasabah_id: 1008,
    akad_id: 101,
    tanggal_akad: '2024-03-05',
    pokok_pembiayaan: 120000000,
    margin: 18000000,
    tenor_bulan: 24,
    status_transaksi: 'aktif',
    kolektibilitas_terkini: 2,
    tanggal_update_kolektibilitas: '2024-04-01',
    created_at: '2024-03-05T09:15:00',
    updated_at: '2024-04-01T09:15:00',
    nasabah: nasabahData.find(n => n.nasabah_id === 1008),
    akad: akadData.find(a => a.akad_id === 101)
  },
  {
    transaction_id: 10009,
    nasabah_id: 1009,
    akad_id: 103,
    tanggal_akad: '2024-03-10',
    pokok_pembiayaan: 2000000000,
    margin: 600000000,
    tenor_bulan: 60,
    status_transaksi: 'aktif',
    kolektibilitas_terkini: 1,
    tanggal_update_kolektibilitas: '2024-04-01',
    created_at: '2024-03-10T14:00:00',
    updated_at: '2024-04-01T09:15:00',
    nasabah: nasabahData.find(n => n.nasabah_id === 1009),
    akad: akadData.find(a => a.akad_id === 103)
  },
  {
    transaction_id: 10010,
    nasabah_id: 1010,
    akad_id: 102,
    tanggal_akad: '2024-03-15',
    pokok_pembiayaan: 175000000,
    margin: 26250000,
    tenor_bulan: 24,
    status_transaksi: 'aktif',
    kolektibilitas_terkini: 4,
    tanggal_update_kolektibilitas: '2024-04-01',
    created_at: '2024-03-15T10:30:00',
    updated_at: '2024-04-01T09:15:00',
    nasabah: nasabahData.find(n => n.nasabah_id === 1010),
    akad: akadData.find(a => a.akad_id === 102)
  },
  {
    transaction_id: 10011,
    nasabah_id: 1011,
    akad_id: 109,
    tanggal_akad: '2024-03-20',
    pokok_pembiayaan: 300000000,
    margin: 75000000,
    tenor_bulan: 36,
    status_transaksi: 'aktif',
    kolektibilitas_terkini: 1,
    tanggal_update_kolektibilitas: '2024-04-01',
    created_at: '2024-03-20T13:45:00',
    updated_at: '2024-04-01T09:15:00',
    nasabah: nasabahData.find(n => n.nasabah_id === 1011),
    akad: akadData.find(a => a.akad_id === 109)
  },
  {
    transaction_id: 10012,
    nasabah_id: 1012,
    akad_id: 111,
    tanggal_akad: '2024-03-25',
    pokok_pembiayaan: 50000000,
    margin: 0,
    tenor_bulan: 12,
    status_transaksi: 'aktif',
    kolektibilitas_terkini: 1,
    tanggal_update_kolektibilitas: '2024-04-01',
    created_at: '2024-03-25T11:15:00',
    updated_at: '2024-04-01T09:15:00',
    nasabah: nasabahData.find(n => n.nasabah_id === 1012),
    akad: akadData.find(a => a.akad_id === 111)
  },
  {
    transaction_id: 10013,
    nasabah_id: 1001,
    akad_id: 113,
    tanggal_akad: '2024-01-30',
    pokok_pembiayaan: 750000000,
    margin: 112500000,
    tenor_bulan: 24,
    status_transaksi: 'aktif',
    kolektibilitas_terkini: 5,
    tanggal_update_kolektibilitas: '2024-04-01',
    created_at: '2024-01-30T09:45:00',
    updated_at: '2024-04-01T09:15:00',
    nasabah: nasabahData.find(n => n.nasabah_id === 1001),
    akad: akadData.find(a => a.akad_id === 113)
  },
  {
    transaction_id: 10014,
    nasabah_id: 1003,
    akad_id: 106,
    tanggal_akad: '2024-02-25',
    pokok_pembiayaan: 400000000,
    margin: 120000000,
    tenor_bulan: 48,
    status_transaksi: 'lunas',
    kolektibilitas_terkini: 1,
    tanggal_update_kolektibilitas: '2024-04-01',
    created_at: '2024-02-25T14:30:00',
    updated_at: '2024-04-01T09:15:00',
    nasabah: nasabahData.find(n => n.nasabah_id === 1003),
    akad: akadData.find(a => a.akad_id === 106)
  },
  {
    transaction_id: 10015,
    nasabah_id: 1005,
    akad_id: 110,
    tanggal_akad: '2024-03-30',
    pokok_pembiayaan: 850000000,
    margin: 255000000,
    tenor_bulan: 48,
    status_transaksi: 'aktif',
    kolektibilitas_terkini: 1,
    tanggal_update_kolektibilitas: '2024-04-01',
    created_at: '2024-03-30T10:00:00',
    updated_at: '2024-04-01T09:15:00',
    nasabah: nasabahData.find(n => n.nasabah_id === 1005),
    akad: akadData.find(a => a.akad_id === 110)
  }
]

// Helper function to get all transaction data
export const getTransaksiData = (): TransaksiSyariah[] => {
  return transaksiData
}

export default transaksiData
