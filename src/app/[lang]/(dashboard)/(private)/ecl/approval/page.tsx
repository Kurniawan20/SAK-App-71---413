// Next Imports
import type { Metadata } from 'next'

// Component Imports
import ECLApproval from '@/views/ecl/approval'

export const metadata: Metadata = {
  title: 'ECL Approval'
}

const Page = () => {
  return <ECLApproval />
}

export default Page
