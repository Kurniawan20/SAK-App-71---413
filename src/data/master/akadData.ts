// Types for Akad Syariah (Islamic Contract) data
export interface AkadSyariah {
  akad_id: number
  nama_akad: string
  jenis_akad: 'Murabahah' | 'Musyarakah' | 'Mudharabah' | 'Ijarah' | 'Istishna' | 'Salam' | 'Qardh' | 'Wakalah' | 'Kafalah'
  deskripsi: string
  created_at: string
  updated_at: string
}

// Dummy data for Akad Syariah
const akadData: AkadSyariah[] = [
  {
    akad_id: 101,
    nama_akad: 'Murabahah Konsumtif',
    jenis_akad: 'Murabahah',
    deskripsi: 'Akad jual beli barang dengan menyatakan harga perolehan dan keuntungan (margin) yang disepakati oleh penjual dan pembeli untuk keperluan konsumtif.',
    created_at: '2024-01-10T08:00:00',
    updated_at: '2024-01-10T08:00:00'
  },
  {
    akad_id: 102,
    nama_akad: 'Murabahah Produktif',
    jenis_akad: 'Murabahah',
    deskripsi: 'Akad jual beli barang dengan menyatakan harga perolehan dan keuntungan (margin) yang disepakati oleh penjual dan pembeli untuk keperluan produktif/usaha.',
    created_at: '2024-01-10T08:15:00',
    updated_at: '2024-01-10T08:15:00'
  },
  {
    akad_id: 103,
    nama_akad: 'Musyarakah Modal Usaha',
    jenis_akad: 'Musyarakah',
    deskripsi: 'Akad kerjasama antara dua pihak atau lebih untuk suatu usaha tertentu di mana masing-masing pihak memberikan kontribusi dana dengan ketentuan bahwa keuntungan dibagi berdasarkan kesepakatan sedangkan kerugian berdasarkan porsi kontribusi dana.',
    created_at: '2024-01-15T09:30:00',
    updated_at: '2024-01-15T09:30:00'
  },
  {
    akad_id: 104,
    nama_akad: 'Musyarakah Mutanaqishah',
    jenis_akad: 'Musyarakah',
    deskripsi: 'Akad musyarakah dengan ketentuan bagian dana salah satu mitra akan dialihkan secara bertahap kepada mitra lainnya sehingga bagian dananya akan menurun dan pada akhir masa akad mitra lain tersebut akan menjadi pemilik penuh.',
    created_at: '2024-01-15T10:00:00',
    updated_at: '2024-01-15T10:00:00'
  },
  {
    akad_id: 105,
    nama_akad: 'Mudharabah Mutlaqah',
    jenis_akad: 'Mudharabah',
    deskripsi: 'Akad kerjasama usaha antara dua pihak dimana pihak pertama (shahibul maal) menyediakan seluruh modal, sedangkan pihak lainnya menjadi pengelola. Keuntungan usaha dibagi menurut kesepakatan yang dituangkan dalam kontrak, tanpa pembatasan jenis usaha.',
    created_at: '2024-01-20T11:15:00',
    updated_at: '2024-01-20T11:15:00'
  },
  {
    akad_id: 106,
    nama_akad: 'Mudharabah Muqayyadah',
    jenis_akad: 'Mudharabah',
    deskripsi: 'Akad kerjasama usaha antara dua pihak dimana pihak pertama (shahibul maal) menyediakan seluruh modal, sedangkan pihak lainnya menjadi pengelola. Keuntungan usaha dibagi menurut kesepakatan yang dituangkan dalam kontrak, dengan pembatasan jenis usaha.',
    created_at: '2024-01-20T11:30:00',
    updated_at: '2024-01-20T11:30:00'
  },
  {
    akad_id: 107,
    nama_akad: 'Ijarah',
    jenis_akad: 'Ijarah',
    deskripsi: 'Akad pemindahan hak guna (manfaat) atas suatu barang dalam waktu tertentu dengan pembayaran sewa (ujrah), tanpa diikuti dengan pemindahan kepemilikan barang itu sendiri.',
    created_at: '2024-01-25T13:45:00',
    updated_at: '2024-01-25T13:45:00'
  },
  {
    akad_id: 108,
    nama_akad: 'Ijarah Muntahiya Bittamlik',
    jenis_akad: 'Ijarah',
    deskripsi: 'Akad sewa menyewa antara pemilik objek sewa dan penyewa untuk mendapatkan imbalan atas objek sewa yang disewakan dengan opsi perpindahan hak milik objek sewa pada saat tertentu sesuai dengan akad sewa.',
    created_at: '2024-01-25T14:00:00',
    updated_at: '2024-01-25T14:00:00'
  },
  {
    akad_id: 109,
    nama_akad: 'Istishna Reguler',
    jenis_akad: 'Istishna',
    deskripsi: 'Akad jual beli dalam bentuk pemesanan pembuatan barang tertentu dengan kriteria dan persyaratan tertentu yang disepakati antara pemesan (pembeli) dan penjual (pembuat).',
    created_at: '2024-02-01T09:15:00',
    updated_at: '2024-02-01T09:15:00'
  },
  {
    akad_id: 110,
    nama_akad: 'Istishna Paralel',
    jenis_akad: 'Istishna',
    deskripsi: 'Akad istishna dimana penjual mengadakan perjanjian dengan subkontraktor untuk membuat barang yang dipesan oleh pembeli.',
    created_at: '2024-02-01T09:30:00',
    updated_at: '2024-02-01T09:30:00'
  },
  {
    akad_id: 111,
    nama_akad: 'Qardh',
    jenis_akad: 'Qardh',
    deskripsi: 'Akad pinjaman dana kepada nasabah dengan ketentuan bahwa nasabah wajib mengembalikan dana yang diterimanya pada waktu yang telah disepakati.',
    created_at: '2024-02-05T10:45:00',
    updated_at: '2024-02-05T10:45:00'
  },
  {
    akad_id: 112,
    nama_akad: 'Wakalah bil Ujrah',
    jenis_akad: 'Wakalah',
    deskripsi: 'Akad pemberian kuasa dari pemberi kuasa kepada penerima kuasa untuk melaksanakan suatu tugas atas nama pemberi kuasa dengan pemberian fee (ujrah).',
    created_at: '2024-02-10T11:30:00',
    updated_at: '2024-02-10T11:30:00'
  },
  {
    akad_id: 113,
    nama_akad: 'Kafalah bil Ujrah',
    jenis_akad: 'Kafalah',
    deskripsi: 'Akad pemberian jaminan yang diberikan satu pihak kepada pihak lain dimana pemberi jaminan bertanggung jawab atas pembayaran kembali suatu hutang yang menjadi hak penerima jaminan, dengan pemberian fee (ujrah).',
    created_at: '2024-02-15T13:00:00',
    updated_at: '2024-02-15T13:00:00'
  }
]

export default akadData
