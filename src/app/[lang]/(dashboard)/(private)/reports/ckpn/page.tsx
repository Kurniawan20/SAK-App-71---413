// Next Imports
import type { Metadata } from 'next'

// Component Imports
import CKPNReport from '@/views/reports/ckpn'

export const metadata: Metadata = {
  title: 'CKPN Reports'
}

const Page = () => {
  return <CKPNReport />
}

export default Page
