// Types for Cash Flow data
import type { CashFlow } from './fairValueData'

// Sample Cash Flow Data for Fair Value Calculations
const cashFlowData: CashFlow[] = [
  // Cash flows for transaction_id: 10001, calculation_id: 1
  {
    id: 1,
    calculation_id: 1,
    periode: 1,
    tanggal: '2025-02-15',
    nominal: 15000000,
    present_value: 14285714
  },
  {
    id: 2,
    calculation_id: 1,
    periode: 2,
    tanggal: '2025-03-15',
    nominal: 15000000,
    present_value: 13605442
  },
  {
    id: 3,
    calculation_id: 1,
    periode: 3,
    tanggal: '2025-04-15',
    nominal: 15000000,
    present_value: 12957564
  },
  {
    id: 4,
    calculation_id: 1,
    periode: 4,
    tanggal: '2025-05-15',
    nominal: 15000000,
    present_value: 12340537
  },
  {
    id: 5,
    calculation_id: 1,
    periode: 5,
    tanggal: '2025-06-15',
    nominal: 15000000,
    present_value: 11752893
  },
  {
    id: 6,
    calculation_id: 1,
    periode: 6,
    tanggal: '2025-07-15',
    nominal: 15000000,
    present_value: 11193232
  },
  // Add more periods for transaction_id: 10001...
  
  // Cash flows for transaction_id: 10002, calculation_id: 2
  {
    id: 37,
    calculation_id: 2,
    periode: 1,
    tanggal: '2025-02-15',
    nominal: 7000000,
    present_value: 6637168
  },
  {
    id: 38,
    calculation_id: 2,
    periode: 2,
    tanggal: '2025-03-15',
    nominal: 7000000,
    present_value: 6293939
  },
  {
    id: 39,
    calculation_id: 2,
    periode: 3,
    tanggal: '2025-04-15',
    nominal: 7000000,
    present_value: 5969035
  },
  {
    id: 40,
    calculation_id: 2,
    periode: 4,
    tanggal: '2025-05-15',
    nominal: 7000000,
    present_value: 5661194
  },
  {
    id: 41,
    calculation_id: 2,
    periode: 5,
    tanggal: '2025-06-15',
    nominal: 7000000,
    present_value: 5369165
  },
  {
    id: 42,
    calculation_id: 2,
    periode: 6,
    tanggal: '2025-07-15',
    nominal: 7000000,
    present_value: 5091809
  },
  // Add more periods for transaction_id: 10002...
  
  // Cash flows for transaction_id: 10004, calculation_id: 4
  {
    id: 73,
    calculation_id: 4,
    periode: 1,
    tanggal: '2025-02-15',
    nominal: 6500000,
    present_value: 6401099
  },
  {
    id: 74,
    calculation_id: 4,
    periode: 2,
    tanggal: '2025-03-15',
    nominal: 6500000,
    present_value: 6303957
  },
  {
    id: 75,
    calculation_id: 4,
    periode: 3,
    tanggal: '2025-04-15',
    nominal: 6500000,
    present_value: 6208553
  },
  {
    id: 76,
    calculation_id: 4,
    periode: 4,
    tanggal: '2025-05-15',
    nominal: 6500000,
    present_value: 6114867
  },
  {
    id: 77,
    calculation_id: 4,
    periode: 5,
    tanggal: '2025-06-15',
    nominal: 6500000,
    present_value: 6022879
  },
  {
    id: 78,
    calculation_id: 4,
    periode: 6,
    tanggal: '2025-07-15',
    nominal: 6500000,
    present_value: 5932570
  },
  // Add more periods for transaction_id: 10004...
  
  // Cash flows for transaction_id: 10006, calculation_id: 6
  {
    id: 109,
    calculation_id: 6,
    periode: 1,
    tanggal: '2025-02-15',
    nominal: 6000000,
    present_value: 5945946
  },
  {
    id: 110,
    calculation_id: 6,
    periode: 2,
    tanggal: '2025-03-15',
    nominal: 6000000,
    present_value: 5892582
  },
  {
    id: 111,
    calculation_id: 6,
    periode: 3,
    tanggal: '2025-04-15',
    nominal: 6000000,
    present_value: 5839902
  },
  {
    id: 112,
    calculation_id: 6,
    periode: 4,
    tanggal: '2025-05-15',
    nominal: 6000000,
    present_value: 5787897
  },
  {
    id: 113,
    calculation_id: 6,
    periode: 5,
    tanggal: '2025-06-15',
    nominal: 6000000,
    present_value: 5736559
  },
  {
    id: 114,
    calculation_id: 6,
    periode: 6,
    tanggal: '2025-07-15',
    nominal: 6000000,
    present_value: 5685879
  },
  // Add more periods for transaction_id: 10006...
  
  // Cash flows for transaction_id: 10008, calculation_id: 8
  {
    id: 145,
    calculation_id: 8,
    periode: 1,
    tanggal: '2025-02-15',
    nominal: 10500000,
    present_value: 10359281
  },
  {
    id: 146,
    calculation_id: 8,
    periode: 2,
    tanggal: '2025-03-15',
    nominal: 10500000,
    present_value: 10220122
  },
  {
    id: 147,
    calculation_id: 8,
    periode: 3,
    tanggal: '2025-04-15',
    nominal: 10500000,
    present_value: 10082508
  },
  {
    id: 148,
    calculation_id: 8,
    periode: 4,
    tanggal: '2025-05-15',
    nominal: 10500000,
    present_value: 9946425
  },
  {
    id: 149,
    calculation_id: 8,
    periode: 5,
    tanggal: '2025-06-15',
    nominal: 10500000,
    present_value: 9811859
  },
  {
    id: 150,
    calculation_id: 8,
    periode: 6,
    tanggal: '2025-07-15',
    nominal: 10500000,
    present_value: 9678797
  },
  // Add more periods for transaction_id: 10008...
  
  // Cash flows for transaction_id: 10010, calculation_id: 10
  {
    id: 181,
    calculation_id: 10,
    periode: 1,
    tanggal: '2025-02-15',
    nominal: 4500000,
    present_value: 4464286
  },
  {
    id: 182,
    calculation_id: 10,
    periode: 2,
    tanggal: '2025-03-15',
    nominal: 4500000,
    present_value: 4428868
  },
  {
    id: 183,
    calculation_id: 10,
    periode: 3,
    tanggal: '2025-04-15',
    nominal: 4500000,
    present_value: 4393744
  },
  {
    id: 184,
    calculation_id: 10,
    periode: 4,
    tanggal: '2025-05-15',
    nominal: 4500000,
    present_value: 4358911
  },
  {
    id: 185,
    calculation_id: 10,
    periode: 5,
    tanggal: '2025-06-15',
    nominal: 4500000,
    present_value: 4324367
  },
  {
    id: 186,
    calculation_id: 10,
    periode: 6,
    tanggal: '2025-07-15',
    nominal: 4500000,
    present_value: 4290108
  }
  // Add more periods for transaction_id: 10010...
]

// Helper function to get cash flows by calculation ID
export const getCashFlowsByCalculationId = (calculationId: number): CashFlow[] => {
  return cashFlowData.filter(cf => cf.calculation_id === calculationId)
}

// Helper function to get all cash flow data
export const getCashFlowData = (): CashFlow[] => {
  return cashFlowData
}

export default cashFlowData
