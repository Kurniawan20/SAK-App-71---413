// Types for Kafalah (Guarantee) data model

export type KafalahStatus = 'Active' | 'Expired' | 'Terminated' | 'Claimed'

export type KafalahType = 'Bank Guarantee' | 'Surety Bond' | 'Standby LC' | 'Letter of Guarantee'

export interface KafalahContract {
  contract_id: number
  reference_number: string
  nasabah_id: number
  nasabah_name: string
  type: KafalahType
  issue_date: string
  effective_date: string
  expiry_date: string
  amount: number
  fee_amount: number
  fee_percentage: number
  status: KafalahStatus
  beneficiary_name: string
  purpose: string
  collateral_amount?: number
  collateral_type?: string
  risk_rating?: number
  created_by: string
  created_date: string
  last_modified_by?: string
  last_modified_date?: string
}

export interface KafalahFeeCalculation {
  calculation_id: number
  contract_id: number
  calculation_date: string
  fee_method: 'Flat' | 'Reducing' | 'Stepped'
  total_days: number
  fee_percentage: number
  fee_amount: number
  is_approved: boolean
  approver?: string
  approval_date?: string
  comments?: string
}

export interface KafalahClaim {
  claim_id: number
  contract_id: number
  claim_date: string
  claim_amount: number
  claim_reason: string
  claim_status: 'Pending' | 'Approved' | 'Rejected' | 'Paid'
  payment_date?: string
  payment_amount?: number
  processor: string
  approver?: string
  comments?: string
}

export interface KafalahProvision {
  provision_id: number
  contract_id: number
  calculation_date: string
  provision_amount: number
  provision_percentage: number
  risk_factor: number
  is_approved: boolean
  approver?: string
  approval_date?: string
}

// Sample data for Kafalah contracts
const sampleKafalahContracts: KafalahContract[] = [
  {
    contract_id: 1,
    reference_number: 'KFL/2025/03/001',
    nasabah_id: 101,
    nasabah_name: 'PT Maju Bersama',
    type: 'Bank Guarantee',
    issue_date: '2025-03-01',
    effective_date: '2025-03-05',
    expiry_date: '2025-09-05',
    amount: 500000000,
    fee_amount: 15000000,
    fee_percentage: 3.0,
    status: 'Active',
    beneficiary_name: 'Kementerian Pekerjaan Umum',
    purpose: 'Jaminan Tender Proyek Infrastruktur',
    collateral_amount: 250000000,
    collateral_type: 'Deposito',
    risk_rating: 2,
    created_by: 'Ahmad Rizki',
    created_date: '2025-02-25T10:30:00'
  },
  {
    contract_id: 2,
    reference_number: 'KFL/2025/03/002',
    nasabah_id: 102,
    nasabah_name: 'CV Karya Mandiri',
    type: 'Surety Bond',
    issue_date: '2025-03-10',
    effective_date: '2025-03-15',
    expiry_date: '2025-06-15',
    amount: 200000000,
    fee_amount: 6000000,
    fee_percentage: 3.0,
    status: 'Active',
    beneficiary_name: 'PT Pembangunan Perumahan',
    purpose: 'Jaminan Pelaksanaan Proyek Perumahan',
    risk_rating: 3,
    created_by: 'Siti Aminah',
    created_date: '2025-03-08T14:45:00'
  },
  {
    contract_id: 3,
    reference_number: 'KFL/2025/02/001',
    nasabah_id: 103,
    nasabah_name: 'PT Sejahtera Abadi',
    type: 'Letter of Guarantee',
    issue_date: '2025-02-15',
    effective_date: '2025-02-20',
    expiry_date: '2025-05-20',
    amount: 350000000,
    fee_amount: 8750000,
    fee_percentage: 2.5,
    status: 'Expired',
    beneficiary_name: 'Dinas Pendidikan Provinsi',
    purpose: 'Jaminan Pengadaan Peralatan Sekolah',
    collateral_amount: 175000000,
    collateral_type: 'Properti',
    risk_rating: 2,
    created_by: 'Budi Santoso',
    created_date: '2025-02-10T09:15:00'
  },
  {
    contract_id: 4,
    reference_number: 'KFL/2025/01/001',
    nasabah_id: 104,
    nasabah_name: 'PT Teknologi Maju',
    type: 'Standby LC',
    issue_date: '2025-01-05',
    effective_date: '2025-01-10',
    expiry_date: '2025-07-10',
    amount: 1000000000,
    fee_amount: 30000000,
    fee_percentage: 3.0,
    status: 'Claimed',
    beneficiary_name: 'PT Telekomunikasi Indonesia',
    purpose: 'Jaminan Pengadaan Peralatan Telekomunikasi',
    collateral_amount: 500000000,
    collateral_type: 'Deposito',
    risk_rating: 1,
    created_by: 'Ahmad Rizki',
    created_date: '2024-12-28T11:20:00',
    last_modified_by: 'Budi Santoso',
    last_modified_date: '2025-04-05T15:30:00'
  }
]

// Sample data for Kafalah fee calculations
const sampleKafalahFeeCalculations: KafalahFeeCalculation[] = [
  {
    calculation_id: 1,
    contract_id: 1,
    calculation_date: '2025-02-25T10:30:00',
    fee_method: 'Flat',
    total_days: 180,
    fee_percentage: 3.0,
    fee_amount: 15000000,
    is_approved: true,
    approver: 'Budi Santoso',
    approval_date: '2025-02-26T09:15:00'
  },
  {
    calculation_id: 2,
    contract_id: 2,
    calculation_date: '2025-03-08T14:45:00',
    fee_method: 'Flat',
    total_days: 90,
    fee_percentage: 3.0,
    fee_amount: 6000000,
    is_approved: true,
    approver: 'Budi Santoso',
    approval_date: '2025-03-09T10:30:00'
  },
  {
    calculation_id: 3,
    contract_id: 3,
    calculation_date: '2025-02-10T09:15:00',
    fee_method: 'Flat',
    total_days: 90,
    fee_percentage: 2.5,
    fee_amount: 8750000,
    is_approved: true,
    approver: 'Budi Santoso',
    approval_date: '2025-02-11T14:20:00'
  },
  {
    calculation_id: 4,
    contract_id: 4,
    calculation_date: '2024-12-28T11:20:00',
    fee_method: 'Flat',
    total_days: 180,
    fee_percentage: 3.0,
    fee_amount: 30000000,
    is_approved: true,
    approver: 'Budi Santoso',
    approval_date: '2024-12-29T09:45:00'
  }
]

// Sample data for Kafalah claims
const sampleKafalahClaims: KafalahClaim[] = [
  {
    claim_id: 1,
    contract_id: 4,
    claim_date: '2025-04-05T15:30:00',
    claim_amount: 800000000,
    claim_reason: 'Wanprestasi kontrak pengadaan',
    claim_status: 'Approved',
    payment_date: '2025-04-10T10:15:00',
    payment_amount: 800000000,
    processor: 'Siti Aminah',
    approver: 'Budi Santoso',
    comments: 'Klaim disetujui setelah verifikasi dokumen lengkap dan valid.'
  }
]

// Sample data for Kafalah provisions
const sampleKafalahProvisions: KafalahProvision[] = [
  {
    provision_id: 1,
    contract_id: 1,
    calculation_date: '2025-03-31',
    provision_amount: 5000000,
    provision_percentage: 1.0,
    risk_factor: 0.5,
    is_approved: true,
    approver: 'Budi Santoso',
    approval_date: '2025-04-05T09:30:00'
  },
  {
    provision_id: 2,
    contract_id: 2,
    calculation_date: '2025-03-31',
    provision_amount: 3000000,
    provision_percentage: 1.5,
    risk_factor: 0.75,
    is_approved: true,
    approver: 'Budi Santoso',
    approval_date: '2025-04-05T09:35:00'
  },
  {
    provision_id: 3,
    contract_id: 3,
    calculation_date: '2025-03-31',
    provision_amount: 0,
    provision_percentage: 0,
    risk_factor: 0,
    is_approved: true,
    approver: 'Budi Santoso',
    approval_date: '2025-04-05T09:40:00'
  },
  {
    provision_id: 4,
    contract_id: 4,
    calculation_date: '2025-03-31',
    provision_amount: 800000000,
    provision_percentage: 80.0,
    risk_factor: 1.0,
    is_approved: true,
    approver: 'Budi Santoso',
    approval_date: '2025-04-05T09:45:00'
  }
]

// Getter functions
export const getKafalahContracts = (): KafalahContract[] => {
  return sampleKafalahContracts
}

export const getKafalahFeeCalculations = (): KafalahFeeCalculation[] => {
  return sampleKafalahFeeCalculations
}

export const getKafalahClaims = (): KafalahClaim[] => {
  return sampleKafalahClaims
}

export const getKafalahProvisions = (): KafalahProvision[] => {
  return sampleKafalahProvisions
}

export const getKafalahContractById = (contractId: number): KafalahContract | undefined => {
  return sampleKafalahContracts.find(contract => contract.contract_id === contractId)
}

export const getKafalahFeeCalculationsByContractId = (contractId: number): KafalahFeeCalculation[] => {
  return sampleKafalahFeeCalculations.filter(calc => calc.contract_id === contractId)
}

export const getKafalahClaimsByContractId = (contractId: number): KafalahClaim[] => {
  return sampleKafalahClaims.filter(claim => claim.contract_id === contractId)
}

export const getKafalahProvisionsByContractId = (contractId: number): KafalahProvision[] => {
  return sampleKafalahProvisions.filter(provision => provision.contract_id === contractId)
}
