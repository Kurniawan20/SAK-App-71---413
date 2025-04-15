// Types for Kolektibilitas History
export interface KolektibilitasHistory {
  history_id: number
  transaction_id: number
  tanggal_perubahan: string
  kolektibilitas_lama: string
  kolektibilitas_baru: string
  keterangan: string
  created_at?: string
  updated_at?: string
}

// Sample Kolektibilitas History Data
const kolektibilitasHistoryData: KolektibilitasHistory[] = [
  {
    history_id: 1,
    transaction_id: 1001,
    tanggal_perubahan: '2024-12-01',
    kolektibilitas_lama: '1',
    kolektibilitas_baru: '1',
    keterangan: 'Pembayaran tepat waktu',
    created_at: '2024-12-01',
    updated_at: '2024-12-01'
  },
  {
    history_id: 2,
    transaction_id: 1002,
    tanggal_perubahan: '2024-12-15',
    kolektibilitas_lama: '1',
    kolektibilitas_baru: '2',
    keterangan: 'Keterlambatan pembayaran 30 hari',
    created_at: '2024-12-15',
    updated_at: '2024-12-15'
  },
  {
    history_id: 3,
    transaction_id: 1002,
    tanggal_perubahan: '2025-01-20',
    kolektibilitas_lama: '2',
    kolektibilitas_baru: '1',
    keterangan: 'Pembayaran kembali normal',
    created_at: '2025-01-20',
    updated_at: '2025-01-20'
  },
  {
    history_id: 4,
    transaction_id: 1003,
    tanggal_perubahan: '2024-11-25',
    kolektibilitas_lama: '1',
    kolektibilitas_baru: '3',
    keterangan: 'Keterlambatan pembayaran 90 hari',
    created_at: '2024-11-25',
    updated_at: '2024-11-25'
  },
  {
    history_id: 5,
    transaction_id: 1003,
    tanggal_perubahan: '2025-01-10',
    kolektibilitas_lama: '3',
    kolektibilitas_baru: '4',
    keterangan: 'Keterlambatan pembayaran 120 hari',
    created_at: '2025-01-10',
    updated_at: '2025-01-10'
  },
  {
    history_id: 6,
    transaction_id: 1003,
    tanggal_perubahan: '2025-02-15',
    kolektibilitas_lama: '4',
    kolektibilitas_baru: '5',
    keterangan: 'Keterlambatan pembayaran lebih dari 180 hari',
    created_at: '2025-02-15',
    updated_at: '2025-02-15'
  },
  {
    history_id: 7,
    transaction_id: 1004,
    tanggal_perubahan: '2024-12-05',
    kolektibilitas_lama: '2',
    kolektibilitas_baru: '3',
    keterangan: 'Keterlambatan pembayaran 90 hari',
    created_at: '2024-12-05',
    updated_at: '2024-12-05'
  },
  {
    history_id: 8,
    transaction_id: 1005,
    tanggal_perubahan: '2024-12-10',
    kolektibilitas_lama: '1',
    kolektibilitas_baru: '2',
    keterangan: 'Keterlambatan pembayaran 30 hari',
    created_at: '2024-12-10',
    updated_at: '2024-12-10'
  },
  {
    history_id: 9,
    transaction_id: 1005,
    tanggal_perubahan: '2025-01-15',
    kolektibilitas_lama: '2',
    kolektibilitas_baru: '1',
    keterangan: 'Pembayaran kembali normal',
    created_at: '2025-01-15',
    updated_at: '2025-01-15'
  },
  {
    history_id: 10,
    transaction_id: 1006,
    tanggal_perubahan: '2024-11-20',
    kolektibilitas_lama: '1',
    kolektibilitas_baru: '1',
    keterangan: 'Pembayaran tepat waktu',
    created_at: '2024-11-20',
    updated_at: '2024-11-20'
  }
]

export default kolektibilitasHistoryData
