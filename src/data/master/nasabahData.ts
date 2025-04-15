// Types for Nasabah (Customer) data
export interface Nasabah {
  nasabah_id: number
  nama: string
  alamat: string
  jenis_nasabah: 'Perorangan' | 'Korporasi'
  no_identitas: string
  segmentasi: 'Retail' | 'Commercial' | 'Corporate'
  created_at: string
  updated_at: string
}

// Dummy data for Nasabah
const nasabahData: Nasabah[] = [
  {
    nasabah_id: 1001,
    nama: 'PT Maju Bersama',
    alamat: 'Jl. Sudirman No. 123, Jakarta Pusat',
    jenis_nasabah: 'Korporasi',
    no_identitas: '9876543210123',
    segmentasi: 'Corporate',
    created_at: '2024-01-15T08:30:00',
    updated_at: '2024-03-20T14:45:00'
  },
  {
    nasabah_id: 1002,
    nama: 'Ahmad Rizki',
    alamat: 'Jl. Gatot Subroto No. 45, Jakarta Selatan',
    jenis_nasabah: 'Perorangan',
    no_identitas: '3271046709880002',
    segmentasi: 'Retail',
    created_at: '2024-01-20T10:15:00',
    updated_at: '2024-01-20T10:15:00'
  },
  {
    nasabah_id: 1003,
    nama: 'CV Berkah Jaya',
    alamat: 'Jl. Pahlawan No. 78, Bandung',
    jenis_nasabah: 'Korporasi',
    no_identitas: '8765432101234',
    segmentasi: 'Commercial',
    created_at: '2024-02-05T09:20:00',
    updated_at: '2024-02-05T09:20:00'
  },
  {
    nasabah_id: 1004,
    nama: 'Siti Aminah',
    alamat: 'Jl. Diponegoro No. 56, Surabaya',
    jenis_nasabah: 'Perorangan',
    no_identitas: '3578136509900003',
    segmentasi: 'Retail',
    created_at: '2024-02-10T13:45:00',
    updated_at: '2024-02-10T13:45:00'
  },
  {
    nasabah_id: 1005,
    nama: 'PT Sentosa Abadi',
    alamat: 'Jl. Ahmad Yani No. 234, Semarang',
    jenis_nasabah: 'Korporasi',
    no_identitas: '7654321098765',
    segmentasi: 'Corporate',
    created_at: '2024-02-15T11:30:00',
    updated_at: '2024-03-25T16:20:00'
  },
  {
    nasabah_id: 1006,
    nama: 'Budi Santoso',
    alamat: 'Jl. Veteran No. 12, Yogyakarta',
    jenis_nasabah: 'Perorangan',
    no_identitas: '3471056708870004',
    segmentasi: 'Retail',
    created_at: '2024-02-20T14:10:00',
    updated_at: '2024-02-20T14:10:00'
  },
  {
    nasabah_id: 1007,
    nama: 'CV Makmur Sejahtera',
    alamat: 'Jl. Merdeka No. 89, Malang',
    jenis_nasabah: 'Korporasi',
    no_identitas: '6543210987654',
    segmentasi: 'Commercial',
    created_at: '2024-03-01T10:45:00',
    updated_at: '2024-03-01T10:45:00'
  },
  {
    nasabah_id: 1008,
    nama: 'Dewi Lestari',
    alamat: 'Jl. Imam Bonjol No. 67, Medan',
    jenis_nasabah: 'Perorangan',
    no_identitas: '1271044509910005',
    segmentasi: 'Retail',
    created_at: '2024-03-05T09:30:00',
    updated_at: '2024-03-05T09:30:00'
  },
  {
    nasabah_id: 1009,
    nama: 'PT Barokah Utama',
    alamat: 'Jl. Thamrin No. 345, Jakarta Pusat',
    jenis_nasabah: 'Korporasi',
    no_identitas: '5432109876543',
    segmentasi: 'Corporate',
    created_at: '2024-03-10T11:15:00',
    updated_at: '2024-03-10T11:15:00'
  },
  {
    nasabah_id: 1010,
    nama: 'Hendra Wijaya',
    alamat: 'Jl. Hayam Wuruk No. 23, Surabaya',
    jenis_nasabah: 'Perorangan',
    no_identitas: '3578134506880006',
    segmentasi: 'Retail',
    created_at: '2024-03-15T13:20:00',
    updated_at: '2024-03-15T13:20:00'
  },
  {
    nasabah_id: 1011,
    nama: 'CV Karya Mandiri',
    alamat: 'Jl. Gajah Mada No. 56, Denpasar',
    jenis_nasabah: 'Korporasi',
    no_identitas: '4321098765432',
    segmentasi: 'Commercial',
    created_at: '2024-03-20T10:30:00',
    updated_at: '2024-03-20T10:30:00'
  },
  {
    nasabah_id: 1012,
    nama: 'Rina Fitriani',
    alamat: 'Jl. Juanda No. 78, Bandung',
    jenis_nasabah: 'Perorangan',
    no_identitas: '3273025607900007',
    segmentasi: 'Retail',
    created_at: '2024-03-25T14:45:00',
    updated_at: '2024-03-25T14:45:00'
  }
]

export default nasabahData
